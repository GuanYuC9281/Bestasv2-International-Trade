import express from 'express';
import {MongoClient} from 'mongodb';
import nodemailer from 'nodemailer';
import {timingSafeEqual} from 'node:crypto';
import {validateSubmission} from './validation.js';
import {recommend} from './recommend.js';

const must=(name)=>{if(!process.env[name])throw new Error(`缺少 ${name} 環境變數`);return process.env[name];};
const uri=must('MONGODB_URI'),dbName=must('MONGODB_DB'),origin=must('PUBLIC_ORIGIN');
must('OPENAI_API_KEY');must('OPENAI_MODEL');must('SMTP_HOST');must('SMTP_FROM');must('ADMIN_API_TOKEN');
const notifyTo=process.env.NOTIFY_TO||'info@bestasv.vn';
const adminToken=process.env.ADMIN_API_TOKEN;
if(adminToken.length<32)throw new Error('ADMIN_API_TOKEN 至少 32 字元。');
const client=new MongoClient(uri,{serverSelectionTimeoutMS:8000});
await client.connect();
const records=client.db(dbName).collection('customer_needs');
await records.createIndex({requestId:1},{unique:true});
await records.createIndex({deleteAt:1},{expireAfterSeconds:0});
await records.createIndex({createdAt:-1});
const retention=Math.max(30,Math.min(3650,Number(process.env.DATA_RETENTION_DAYS)||365));
const transport=nodemailer.createTransport({
  host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:process.env.SMTP_SECURE==='true',
  auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:must('SMTP_PASS')}:undefined,
  requireTLS:process.env.SMTP_SECURE!=='true',connectionTimeout:10000,socketTimeout:30000
});
const app=express();
app.disable('x-powered-by');
if(process.env.TRUST_PROXY==='true')app.set('trust proxy',1);
app.use((req,res,next)=>{
  res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','no-referrer');
  if(req.headers.origin===origin){res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');res.set('Access-Control-Allow-Headers','Content-Type, Idempotency-Key');res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');}
  if(req.method==='OPTIONS')return res.sendStatus(req.headers.origin===origin?204:403);
  if(req.headers.origin&&req.headers.origin!==origin)return res.status(403).json({error:'不允許的來源。'});
  next();
});
app.use(express.json({limit:'32kb',strict:true}));
const requests=new Map();
setInterval(()=>{const now=Date.now();for(const [ip,times] of requests){const recent=times.filter(t=>now-t<3600_000);if(recent.length)requests.set(ip,recent);else requests.delete(ip);}},3600_000).unref();
app.use('/api/needs',(req,res,next)=>{
  if(req.method!=='POST')return next();
  const ip=req.ip,now=Date.now(),recent=(requests.get(ip)||[]).filter(t=>now-t<3600_000);
  if(recent.length>=10)return res.status(429).json({error:'提交次數過多，請稍後再試。'});
  recent.push(now);requests.set(ip,recent);next();
});
app.get('/api/health',async(_req,res)=>{
  try{await client.db(dbName).command({ping:1});res.json({ready:true});}
  catch(_error){res.status(503).json({ready:false});}
});

const sendNotice=async record=>{
  const r=record.requirements,c=record.contact;
  const safe=s=>String(s??'').replace(/[\r\n]+/g,' ').slice(0,600);
  await transport.sendMail({
    from:process.env.SMTP_FROM,to:notifyTo,replyTo:c.email,
    subject:`[需求工具] ${safe(c.company)} · ${record.requestId}`,
    text:[`需求編號：${record.requestId}`,`公司：${safe(c.company)}`,`聯絡人：${safe(c.name)}`,`電話：${safe(c.phone)}`,`信箱：${safe(c.email)}`,`產業：${safe(r.industry)}`,`製程：${safe(r.process)}`,`污染物：${r.pollutants.join(', ')}`,`風量：${r.flow??'未提供'} m³/h（${r.flowBasis}）`,`溫度：${r.temperature??'未提供'} °C`,`濕度：${r.humidity??'未提供'} %`,`目標：${safe(r.target)}`,`限制：${safe(r.constraints)}`,`地點：${safe(r.location)}`,`推薦：${record.recommendation?.items.map(x=>x.name).join('、')||'待人工確認'}`].join('\n')
  });
};

app.post('/api/needs',async(req,res)=>{
  let input;
  try{input=validateSubmission(req.body);}catch(e){return res.status(400).json({error:e.message});}
  const key=req.get('Idempotency-Key');
  if(!key||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key))return res.status(400).json({error:'請重新載入頁面後送出。'});
  try{
    const existing=await records.findOne({requestId:key});
    if(existing)return res.json({requestId:key,status:existing.status,recommendation:existing.recommendation||null,notification:existing.notification});
    const now=new Date();
    const record={requestId:key,createdAt:now,deleteAt:new Date(now.getTime()+retention*86400_000),contact:input.contact,requirements:input.requirements,consentAt:now,consentVersion:'2026-10-03',status:'processing',notification:'pending',recommendation:null,aiModel:process.env.OPENAI_MODEL};
    await records.insertOne(record);
    let recommendation;
    try{recommendation=await recommend(input.requirements);record.recommendation=recommendation;record.status='recommended';}
    catch(error){record.status='manual-review';record.processingError=error.message;console.error('AI recommendation failed for',key,error.message);}
    await records.updateOne({requestId:key},{$set:{recommendation:record.recommendation,status:record.status,processingError:record.processingError||null}});
    try{await sendNotice(record);record.notification='sent';}
    catch(error){record.notification='failed';console.error('Notification failed for',key,error.message);}
    await records.updateOne({requestId:key},{$set:{notification:record.notification}});
    res.status(201).json({requestId:key,status:record.status,recommendation:record.recommendation,notification:record.notification});
  }catch(error){
    if(error.code===11000){const existing=await records.findOne({requestId:key});return res.json({requestId:key,status:existing?.status||'processing',recommendation:existing?.recommendation||null,notification:existing?.notification||'pending'});}
    console.error('Need submission failed',error);res.status(503).json({error:'暫時無法保存需求，請稍後再試。'});
  }
});

function admin(req,res,next){
  const got=(req.get('authorization')||'').replace(/^Bearer /i,'');
  const a=Buffer.from(got),b=Buffer.from(adminToken);
  if(a.length!==b.length||!timingSafeEqual(a,b))return res.sendStatus(401);
  next();
}
app.get('/api/admin/needs',admin,async(req,res)=>{
  const limit=Math.max(1,Math.min(100,Number(req.query.limit)||50));
  const before=req.query.before?new Date(req.query.before):null;
  if(before&&Number.isNaN(before.getTime()))return res.status(400).json({error:'before 日期格式不正確。'});
  const list=await records.find(before?{createdAt:{$lt:before}}:{}, {projection:{_id:0}}).sort({createdAt:-1}).limit(limit).toArray();
  res.json({records:list});
});
app.get('/api/admin/needs/:id',admin,async(req,res)=>{
  const record=await records.findOne({requestId:req.params.id},{projection:{_id:0}});
  if(!record)return res.sendStatus(404);
  res.json(record);
});
app.post('/api/admin/needs/:id/resend',admin,async(req,res)=>{
  const record=await records.findOne({requestId:req.params.id});
  if(!record)return res.sendStatus(404);
  if(record.notification==='sent')return res.json({notification:'sent'});
  await sendNotice(record);
  await records.updateOne({requestId:req.params.id},{$set:{notification:'sent'}});
  res.json({notification:'sent'});
});
app.delete('/api/admin/needs/:id',admin,async(req,res)=>{
  const result=await records.deleteOne({requestId:req.params.id});
  res.sendStatus(result.deletedCount?204:404);
});
app.use((error,_req,res,_next)=>{console.error(error);res.status(error.status||500).json({error:error.status===413?'資料太大。':error.status===400?'資料格式不正確。':'服務暫時無法使用。'});});

const port=Number(process.env.PORT)||8787;
app.listen(port,()=>console.log(`Needs API listening on ${port}`));
