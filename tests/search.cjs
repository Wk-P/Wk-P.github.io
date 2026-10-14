const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const makeButton = tag => ({dataset:{tag}, attrs:{}, setAttribute(key,value){this.attrs[key]=value;}, addEventListener(event,fn){this.click=fn;}});
const buttons = ['All','Backend','Cloud'].map(makeButton);
const posts = [
  {dataset:{tags:'["Backend"]',search:'python api design'},hidden:false},
  {dataset:{tags:'["Cloud"]',search:'kubernetes resource monitoring'},hidden:false}
];
const input = {value:'',addEventListener(event,fn){this.change=fn;}};
const form = {querySelector(){return input;},addEventListener(event,fn){this.submit=fn;}};
const count = {}, empty = {};
const context = {
  URL, URLSearchParams,
  location:{href:'https://wk-p.github.io/?q=python',search:'?q=python'},
  history:{replaceState(a,b,url){this.url=String(url);}},
  window:{addEventListener(){}},
  document:{querySelector(sel){return {'[data-search]':form,'[data-count]':count,'[data-empty]':empty}[sel];},querySelectorAll(sel){return sel==='[data-tag]'?buttons:posts;}}
};
vm.runInNewContext(fs.readFileSync('assets/blog.js','utf8'),context);
assert.equal(count.textContent,'1 article');
assert.deepEqual(posts.map(p=>p.hidden),[false,true]);
input.value='';input.change();buttons[2].click();
assert.deepEqual(posts.map(p=>p.hidden),[true,false]);
assert.equal(buttons[2].attrs['aria-pressed'],'true');
assert.ok(context.history.url.includes('tag=Cloud'));
input.value='nonexistent';input.change();
assert.equal(count.textContent,'0 articles');assert.equal(empty.hidden,false);
input.value='RESOURCE';input.change();
assert.equal(count.textContent,'1 article');
console.log('PASS: URL search, tag selection, empty state, case-insensitive full-text matching.');
