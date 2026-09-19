import { next, rewrite } from '@vercel/functions';

const VIETNAM_HOSTS = new Set(['bestasv.vn', 'www.bestasv.vn']);

function hostName(request) {
  return (request.headers.get('host') || '').split(':')[0].toLowerCase();
}

function isVietnamPath(pathname) {
  return pathname === '/vn' || pathname === '/vn/' || pathname.startsWith('/vn/');
}

function hiddenVietnamPath(pathname) {
  const suffix = pathname.slice('/vn'.length);
  return `/__vn/vn${suffix || '/'}`;
}

export default function proxy(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/__vn/')) {
    return next({
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  if (VIETNAM_HOSTS.has(hostName(request)) && isVietnamPath(url.pathname)) {
    const destination = new URL(request.url);
    destination.pathname = hiddenVietnamPath(url.pathname);
    return rewrite(destination);
  }

  return next();
}
