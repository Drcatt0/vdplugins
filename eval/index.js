(function(p,N,i,T,h){"use strict";var d;(function(e){e[e.BUILT_IN=0]="BUILT_IN",e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT",e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION",e[e.BOT=3]="BOT",e[e.PLACEHOLDER=4]="PLACEHOLDER"})(d||(d={}));var o;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER=6]="USER",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(o||(o={}));var l;(function(e){e[e.CHAT=1]="CHAT",e[e.USER=2]="USER",e[e.MESSAGE=3]="MESSAGE"})(l||(l={}));const u=function(e){return h.registerCommand({displayName:e.name,displayDescription:e.description,applicationId:"-1",type:l.CHAT,inputType:d.BUILT_IN_TEXT,options:e.options??[],...e})},c=N.findByProps("sendBotMessage"),y=N.findByProps("inspect"),m=async function(){}.constructor,A="\u200B",f=function(e){return"```js\n"+e.replaceAll("`","`"+A)+"\n```"},r=[];i.storage.scripts??=[];const B=async function(){if(i.storage.scripts.length>0)for(const e of i.storage.scripts){const t=e.code,n=e.async??!1;try{const a=y.inspect(n?await m(t)():eval?.(t));T.logger.log(a)}catch(a){T.logger.error(a)}}};r.push(u({name:"eval",description:"Evaluate JavaScript code.",options:[{name:"code",displayName:"code",type:o.STRING,description:"The code to evaluate.",displayDescription:"The code to evaluate.",required:!0},{name:"async",displayName:"async",type:o.BOOLEAN,description:"Whether to support 'await' in code. Must explicitly return for result (default: false)",displayDescription:"Whether to support 'await' in code. Must explicitly return for result (default: false)"}],async execute(e,t){let[n,a]=e;try{const s=y.inspect(a?.value?await m(n.value)():eval?.(n.value)),O=s.length>2e3?s.slice(0,2e3)+"...":s;c.sendBotMessage(t.channel.id,f(O))}catch(s){c.sendBotMessage(t.channel.id,f(s?.stack??s))}}})),r.push(u({name:"eval save",description:"loads script at startup",options:[{name:"code",displayName:"code",type:o.STRING,description:"The code to save.",displayDescription:"The code to save.",required:!0},{name:"async",displayName:"async",type:o.BOOLEAN,description:"Whether to support 'await' in code. Must explicitly return for result (default: false)",displayDescription:"Whether to support 'await' in code. Must explicitly return for result (default: false)"}],async execute(e,t){let[n,a]=e;return i.storage.scripts.push({name:M(6),code:n.value,async:a?.value}),c.sendBotMessage(t.channel.id,"saved")}}));const I=i.storage.scripts.map(function(e){return{name:e.name,displayName:e.name,value:e.name}});r.push(u({name:"eval delete",description:"wow",options:[{name:"script",displayName:"script",type:o.STRING,description:"guh",displayDescription:"guh",choices:[...I],required:!0}],async execute(e,t){let[n]=e;return i.storage.scripts.pop(n.value),c.sendBotMessage(t.channel.id,"deleted")}}));const v=function(){for(const e of r)e()},M=function(e){let t="";const n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=n.length;let s=0;for(;s<e;)t+=n.charAt(Math.floor(Math.random()*a)),s+=1;return t};return p.onLoad=B,p.onUnload=v,p})({},vendetta.metro,vendetta.plugin,vendetta,vendetta.commands);
