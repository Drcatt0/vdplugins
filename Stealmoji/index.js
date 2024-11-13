(function(f,$,h){"use strict";var N;(function(e){e[e.BUILT_IN=0]="BUILT_IN",e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT",e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION",e[e.BOT=3]="BOT",e[e.PLACEHOLDER=4]="PLACEHOLDER"})(N||(N={}));var c;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER=6]="USER",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(c||(c={}));var g;(function(e){e[e.CHAT=1]="CHAT",e[e.USER=2]="USER",e[e.MESSAGE=3]="MESSAGE"})(g||(g={}));const EmojiStore=h.findByStoreName("EmojiStore");let A=[];const L=function(){A.push($.registerCommand({name:"stealmoji",displayName:"stealmoji",description:"Get URLs for server emojis",displayDescription:"Get URLs for server emojis",type:g.CHAT,inputType:N.BUILT_IN_TEXT,applicationId:"-1",options:[{name:"emojis",description:"Enter emojis",type:c.STRING,required:!0}],async execute(args){try{const emojis=args[0].value.match(/<a?:\w+:(\d+)>/g);if(!emojis)return{content:"No valid emojis found."};let result="";for(const emoji of emojis){const id=emoji.match(/\d+/)[0];const animated=emoji.startsWith("<a:");const url=`<https://cdn.discordapp.com/emojis/${id}.${animated?"gif":"png"}>`;result+=`${emoji}\n> ${url}\n\n`;}return{content:result.trim()}}catch(error){console.error("Error fetching emoji links:",error);return{content:"Failed to retrieve emoji links."}}}}))},O=function(){for(const e of A)e()};return f.onLoad=L,f.onUnload=O,f})({},vendetta.commands,vendetta.metro,vendetta.metro.common);
