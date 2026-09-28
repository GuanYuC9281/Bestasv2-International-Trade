# Verification only: pip install CoolProp==8.0.0
import sys, json, math
from pathlib import Path
from CoolProp.HumidAirProp import HAPropsSI
from CoolProp.CoolProp import PropsSI
def psat(c):
    t=c+273.15;z=1-t/647.096
    return 22064*math.exp(647.096/t*(-7.85951783*z+1.84408259*z**1.5-11.7866497*z**3+22.6807411*z**3.5-15.9618719*z**4+1.80122502*z**7.5))
rows=[]
for p in [80,101.325,120,150,200]:
 for ti in [30,50,60,70,80,90,95,98]:
  for to in [15,25,40]:
   if to>=ti or psat(ti)>=.98*p:continue
   for rh in [30,60,100]:
    try:
     wi=HAPropsSI('W','T',ti+273.15,'P',p*1000,'R',rh/100)
     ws=HAPropsSI('W','T',to+273.15,'P',p*1000,'R',1)
     wo=min(wi,ws)
     hin=HAPropsSI('H','T',ti+273.15,'P',p*1000,'W',wi)/1000
     hout=HAPropsSI('H','T',to+273.15,'P',p*1000,'W',wo)/1000
     hl=PropsSI('H','T',to+273.15,'P',p*1000,'Water')/1000
     ref=(hin-hout-(wi-wo)*hl)
     idealwi=.621945764365*rh/100*psat(ti)/(p-rh/100*psat(ti))
     idealwo=min(idealwi,.621945764365*psat(to)/(p-psat(to)))
     approx=1.006*(ti-to)+idealwi*1.86*(ti-to)+(idealwi-idealwo)*(2501+(1.86-4.186)*to)
     rows.append(dict(reference_density=(1+wi)/HAPropsSI('V','T',ti+273.15,'P',p*1000,'W',wi),reference_specific_volume=HAPropsSI('V','T',ti+273.15,'P',p*1000,'W',wi),p=p,tin=ti,tout=to,rh=rh,reference_kJ_per_kgdry=ref,approx_kJ_per_kgdry=approx,error_percent=100*(approx/ref-1),condensate_reference=wi-wo,condensate_approx=idealwi-idealwo))
    except ValueError as e:print('Skipped',p,ti,to,rh,str(e)[:100])
Path(__file__).with_name('thermal-reference.json').write_text(json.dumps(rows),encoding='utf-8')
print(json.dumps({'cases':len(rows),'max_abs_error_percent':max(abs(r['error_percent']) for r in rows),'default':[r for r in rows if r['p']==101.325 and r['tin']==90 and r['tout']==40 and r['rh']==100],'worst':max(rows,key=lambda r:abs(r['error_percent']))}))
