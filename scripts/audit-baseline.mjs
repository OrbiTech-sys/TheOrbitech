import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://localhost:3220';
const out = process.argv[3] || 'screenshots/before';
const routes = [['home','/'],['work','/work'],['services','/services'],['studio','/studio'],['contact','/contact'],['thanks','/contact/thanks'],['privacy','/privacy'],...['orbit-operations','property-management','project-3','n8n-email-marketing-workflow'].map(s=>[s,`/work/${s}`]),['404','/audit-not-found']];
await mkdir(out,{recursive:true});
const browser = await chromium.launch({channel:'chrome',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const reports=[];
try {
for(const width of [375,768,1280,1440]){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,isMobile:width===375,hasTouch:width===375,reducedMotion:'reduce'});
 for(const [name,path] of routes){
  const page=await context.newPage(); const errors=[],failed=[],httpErrors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(['error','warning'].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`)});
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()})});
  try{
   const response=await page.goto(base+path,{waitUntil:'networkidle',timeout:60000});
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,65));}window.scrollTo(0,0)});
   await page.waitForTimeout(400);
   const data=await page.evaluate(()=>{
    const visible=e=>e.getClientRects().length>0;
    const links=[...document.querySelectorAll('a')].map(e=>({text:e.textContent.trim(),href:e.getAttribute('href'),area:e.closest('header')?'header':e.closest('footer')?'footer':'main'}));
    const smallTargets=[...document.querySelectorAll('a,button,input,select,summary')].filter(visible).map(e=>({text:(e.textContent||e.getAttribute('aria-label')||e.id).trim().slice(0,80),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(e=>e.w<44||e.h<44);
    return {title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,description:document.querySelector('meta[name=description]')?.content,robots:document.querySelector('meta[name=robots]')?.content,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,height:document.documentElement.scrollHeight,headings:[...document.querySelectorAll('h1,h2,h3,h4')].map(e=>({level:e.tagName,text:e.textContent.trim()})),brokenImages:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.currentSrc),missingAlt:[...document.images].filter(e=>!e.hasAttribute('alt')).map(e=>e.src),links,smallTargets,placeholders:[...document.querySelectorAll('.pending')].map(e=>e.textContent),text:document.body.innerText,bodyFont:getComputedStyle(document.body).font,resources:performance.getEntriesByType('resource').map(e=>({name:e.name,bytes:e.transferSize,type:e.initiatorType}))};
   });
   await page.screenshot({path:`${out}/${name}-${width}.png`,fullPage:true});
   reports.push({name,path,width,status:response?.status(),errors,failed,httpErrors,...data});
   console.log(`${width} ${path}: ${response?.status()} overflow=${data.scrollWidth-data.clientWidth} broken=${data.brokenImages.length} errors=${errors.length}`);
  }catch(e){reports.push({name,path,width,error:String(e)});console.log('FAILED',path,String(e));}
  await writeFile(`${out}/baseline.json`,JSON.stringify(reports,null,2));await page.close();
 }
 await context.close();
}
}finally{await browser.close()}
