import {chromium} from '@playwright/test';
import sharp from 'sharp';
const b=await chromium.launch({channel:'chrome',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:375,height:900},isMobile:true,hasTouch:true,reducedMotion:'reduce',deviceScaleFactor:1});
for(const [name,path] of [['home','/'],['services','/services']]){
 await p.goto('http://localhost:3220'+path,{waitUntil:'networkidle'});
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100))}window.scrollTo(0,0)});
 await p.waitForTimeout(500);
 const height=await p.evaluate(()=>document.documentElement.scrollHeight),tiles=[];
 for(let y=0;y<height;y+=3500){tiles.push({input:await p.screenshot({clip:{x:0,y,width:375,height:Math.min(3500,height-y)},captureBeyondViewport:true,fullPage:true}),left:0,top:y})}
 await sharp({create:{width:375,height,channels:4,background:'#f6f3ed'}}).composite(tiles).png().toFile(`screenshots/before/${name}-375.png`);
 console.log(name,height);
}
await b.close();

