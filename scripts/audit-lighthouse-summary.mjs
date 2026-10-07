import {readdir,readFile,writeFile} from 'node:fs/promises';
const out=[];
for(const f of (await readdir('audit/before/lighthouse')).filter(f=>f.endsWith('.json'))){
 const r=JSON.parse(await readFile('audit/before/lighthouse/'+f,'utf8'));
 out.push({file:f,url:r.finalDisplayedUrl,version:r.lighthouseVersion,date:r.fetchTime,settings:r.configSettings,scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','first-contentful-paint','speed-index'].map(k=>[k,{value:r.audits[k]?.numericValue,display:r.audits[k]?.displayValue}])),failures:Object.entries(r.audits).filter(([,v])=>v.score!==null&&v.score<1).map(([k,v])=>({id:k,title:v.title,value:v.displayValue,items:v.details?.items?.slice(0,3)}))});
}
await writeFile('audit/before/lighthouse-summary.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(out.map(({file,scores,metrics,failures})=>({file,scores,metrics,failures:failures.map(({id,value})=>({id,value}))})),null,2));
