(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const H="https://api.deeplx.org/translate";var w={translate:async function(e,a="auto",i,s=!1){try{if(s)return{source_lang:a,text:e};const n=await(await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e,source_lang:a,target_lang:i})})).json();if(!n?.data?.[0]?.text)throw Error(`Failed to translate text from DeepL: ${n.message||"No response"}`);return{source_lang:a,text:n.data[0].text}}catch(n){throw Error(`Failed to fetch from DeepL: ${n.message}`)}}};const M=g.findByProps("openLazy","hideActionSheet"),P=d.Forms.FormRow,j=g.findByStoreName("MessageStore"),V=g.findByStoreName("ChannelStore"),z=t.stylesheet.createThemedStyleSheet({iconComponent:{width:24,height:24,tintColor:C.semanticColors.INTERACTIVE_NORMAL}});let T=[];function K(){return B.before("openLazy",M,function(e){let[a,i,s]=e;const n=s?.message;i!=="MessageLongPressActionSheet"||!n||a.then(function(A){const ae=B.after("default",A,function(ue,ie){t.React.useEffect(()=>()=>ae(),[]);const v=F.findInReactTree(ie,r=>r?.[0]?.type?.name==="ButtonRow");if(!v)return;const u=j.getMessage(n.channel_id,n.id);if(!u?.content&&!n.content)return;const S=u?.id??n.id,se=u?.content??n.content,I=T.find(r=>Object.keys(r)[0]===S),"Translate",oe=async()=>{try{const r=o.target_lang,l=!I,h=await w.translate(u.content,void 0,r,!l);t.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...u,content:`${l?h.text:I[S]} ${l?`\`[${r?.toLowerCase()}]\``:""}`,guild_id:V.getChannel(u.channel_id).guild_id},log_edit:!1}),l?T.unshift({[S]:se}):T=T.filter(le=>le!==I)}catch(r){E.showToast("Failed to translate message. Check Debug Logs.",c.getAssetIDByName("Small")),D.logger.error(r)}finally{return M.hideActionSheet()}};v.splice(0,0,t.React.createElement(P,{label:"Translate Message",icon:t.React.createElement(P.Icon,{source:c.getAssetIDByName("ic_locale_24px")}),onPress:oe}))})})})}const x={arabic:"AR",english:"EN",french:"FR",german:"DE",japanese:"JA",korean:"KO",russian:"RU",spanish:"ES",turkish:"TR"};const X=g.findByProps("sendBotMessage"),Y=Object.entries(x).map(([a,i])=>({name:a,displayName:a,value:i}));function q(){return G.registerCommand({name:"translate",displayName:"translate",description:"Translate text using DeepL API.",applicationId:"-1",type:1,inputType:0,options:[{name:"text",displayName:"text",description:"Text to translate",type:3,required:!0},{name:"language",displayName:"language",description:"Target language",type:3,choices:Y,required:!0}],async execute(e,a){const[i,s]=e;try{const n=await w.translate(i.value,null,s.value);return await new Promise(A=>k.showConfirmationAlert({title:"Send translated message?",content:t.React.createElement(d.Codeblock,null,n.text),confirmText:"Yes",onConfirm:()=>A({content:n.text}),cancelText:"No"}))}catch(n){return D.logger.error(n),X.sendBotMessage(a.channel.id,"Failed to translate message. Check logs.",c.getAssetIDByName("Small"))}}})}const o=L.storage;o.target_lang??="EN";let b=[];var ne={onLoad:function(){return b=[K(),q()]},onUnload:function(){for(const e of b)e()},settings:function(){return t.React.createElement(d.Forms.FormRow,{label:"Target Language",subLabel:o.target_lang,onPress:()=>o.target_lang="EN"})}};return f.default=ne,f.settings=o,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta,vendetta.commands,vendetta.ui.alerts,vendetta.storage,vendetta.ui.toasts);

