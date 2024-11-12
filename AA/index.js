(function(f,$,h){"use strict";var N;(function(e){e[e.BUILT_IN=0]="BUILT_IN";e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT";e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION";e[e.BOT=3]="BOT";e[e.PLACEHOLDER=4]="PLACEHOLDER"})(N||(N={}));var c;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND";e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP";e[e.STRING=3]="STRING";e[e.INTEGER=4]="INTEGER";e[e.BOOLEAN=5]="BOOLEAN";e[e.USER=6]="USER";e[e.CHANNEL=7]="CHANNEL";e[e.ROLE=8]="ROLE";e[e.MENTIONABLE=9]="MENTIONABLE";e[e.NUMBER=10]="NUMBER";e[e.ATTACHMENT=11]="ATTACHMENT"})(c||(c={}));var g;(function(e){e[e.CHAT=1]="CHAT";e[e.USER=2]="USER";e[e.MESSAGE=3]="MESSAGE"})(g||(g={}));const SauceNAO_URL="https://saucenao.com/search.php?url=%s";const{sendBotMessage:_}=h.findByProps("sendBotMessage");let A=[];const L=function(){A.push($.registerCommand({name:"ris",displayName:"Reverse Image Search",description:"Get SauceNAO link for the specified image URL",displayDescription:"Get SauceNAO link for the specified image URL",type:g.CHAT,inputType:N.BUILT_IN_TEXT,applicationId:"-1",options:[{name:"url",displayName:"Image URL",description:"URL of the image to search on SauceNAO",type:c.STRING,required:!0}],async execute(cmd){try{const imageUrl=cmd.args[0].value;if(!imageUrl){return{content:"Please provide a valid image URL."}}const sauceUrl=SauceNAO_URL.replace("%s",encodeURIComponent(imageUrl));return{content:`[Search on SauceNAO](${sauceUrl})`}}catch(error){console.error("RIS Plugin Error:",error);return{content:"Failed to create SauceNAO link."}}}}))},O=function(){for(const e of A)e()};return f.onLoad=L,f.onUnload=O,f})({},vendetta.commands,vendetta.metro);
