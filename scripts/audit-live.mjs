import {writeFile} from 'node:fs/promises';
const routes=['/','/work','/services','/studio','/contact','/contact/thanks','/privacy','/work/orbit-operations','/work/property-management','/work/project-3','/work/n8n-email-marketing-workflow','/sitemap.xml','/robots.txt'];
const out=[];
for(const path of routes){try{const r=await fetch('https://theorbitech.vercel.app'+path);const s=await r.text();out.push({path,status:r.status,title:s.match(/<title>(.*?)<\/title>/)?.[1],canonical:s.match(/rel="canonical" href="([^"]+)/)?.[1],placeholderCount:(s.match(/data-placeholder/g)||[]).length,bytes:s.length});}catch(e){out.push({path,error:String(e)})}}
for(const url of ['https://orbit-operations.vercel.app/','https://propertymanagementsystem-six.vercel.app/']){try{const r=await fetch(url);out.push({external:url,status:r.status,finalUrl:r.url})}catch(e){out.push({external:url,error:String(e)})}}
await writeFile('audit/before/live-routes.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out));
