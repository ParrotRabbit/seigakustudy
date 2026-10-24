import assert from 'node:assert/strict';
import test from 'node:test';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
process.env.OPENAI_API_KEY = 'test-key-is-not-real';
process.env.APP_PASSWORD = 'verylongtestpassword123';
const mod=await import('../api/ask.mjs');
const status=await import('../api/status.mjs');
const makeReq = (q,p='verylongtestpassword123') => new Request('https://test.example/api/ask',{method:'POST',headers:{'content-type':'application/json','x-study-password':p},body:JSON.stringify({mode:'grammar',question:q})});
test('status reports availability when the server has a key',async()=>{
 const r=status.GET(); assert.equal(r.status,200);assert.deepEqual(await r.json(),{ready:true,mode:'study-only'});
});
test('rejects incorrect password without calling external APIs',async()=>{
 const r=await mod.POST(makeReq('日语词汇','incorrect')); assert.equal(r.status,401);
});
test('replies to study questions after model classification and response',async()=>{
 const original=globalThis.fetch;let count=0;
 globalThis.fetch=async (_url,opts)=>{count++; const req=JSON.parse(opts.body); return Response.json({output:[{content:[{type:'output_text',text: req.instructions.includes('学习用途守门员')?'ALLOW':'「わけではない」表示部分否定。'}]}]});};
 try{const r=await mod.POST(makeReq('解释～わけではない'));const data=await r.json();assert.equal(r.status,200);assert.equal(data.blocked,false);assert.match(data.answer,/わけではない/);assert.equal(count,2);}finally{globalThis.fetch=original;}
});
test('blocks classified non-study questions',async()=>{
 const original=globalThis.fetch;let count=0;
 globalThis.fetch=async ()=>{count++;return Response.json({output:[{content:[{type:'output_text',text:'DENY'}]}]});};
 try{const r=await mod.POST(makeReq('请看星盘预测'));const data=await r.json();assert.equal(r.status,200);assert.equal(data.blocked,true);assert.equal(count,1);}finally{globalThis.fetch=original;}
});
