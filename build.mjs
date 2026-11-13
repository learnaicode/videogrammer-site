import {cpSync,rmSync,mkdirSync,readdirSync} from 'fs';
rmSync('dist',{recursive:true,force:true});mkdirSync('dist');
for(const f of readdirSync('.'))if(f.endsWith('.html')||f==='robots.txt')cpSync(f,'dist/'+f);
cpSync('assets','dist/assets',{recursive:true});cpSync('data','dist/data',{recursive:true});
console.log('built dist');
