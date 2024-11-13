(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const H="https://api.deeplx.org/translate";var w={translate:async function(e,a="auto",i=undefined,s=false){try{if(s)return{source_lang:a,text:e};const n=await(await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e,source_lang:a,target_lang:i})})).json();if(!n?.data)throw Error(`Translation error: ${n.message||"Unknown error"}`);return{source_lang:a,text:n.data}}catch(n){console.error("DeepL fetch error:", n);throw Error("Failed to fetch from DeepL API")}}};const M=g.findByProps("openLazy","hideActionSheet"),P=d.Forms.FormRow,j=g.findByStoreName("MessageStore"),V=g.findByStoreName("ChannelStore"),z=t.stylesheet.createThemedStyleSheet({iconComponent:{width:24,height:24,tintColor:C.semanticColors.INTERACTIVE_NORMAL}});let T=[];function K(){return B.before("openLazy",M,function(e){let[a,i,s]=e;const n=s?.message;if(i!=="MessageLongPressActionSheet"||!n)return; a.then(function(A){const ae=B.after("default",A,function(ue,ie){t.React.useEffect(()=>()=>ae(),[]);const v=F.findInReactTree(ie,r=>r?.[0]?.type?.name==="ButtonRow");if(!v)return;const re=Math.max(v.findIndex(r=>r.props.message===t.i18n.Messages.MARK_UNREAD),0),u=j.getMessage(n.channel_id,n.id);if(!u?.content&&!n.content)return;const S=u?.id??n.id,se=u?.content??n.content,I=T.find(r=>Object.keys(r)[0]===S),"Translate",oe=async()=>{try{const r=o.target_lang,l=!I,h=await w.translate(u.content,void 0,r,!l);if(!h.text)throw Error("Empty translation");t.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...u,content:`${l?h.text:I[S]} ${l?`\`[${r?.toLowerCase()}]\``:""}`,guild_id:V.getChannel(u.channel_id).guild_id},log_edit:!1}),l?T.unshift({[S]:se}):T=T.filter(le=>le!==I)}catch(r){E.showToast("Failed to translate message. Check Debug Logs.",c.getAssetIDByName("Small")),D.logger.error(r)}finally{M.hideActionSheet()}};v.splice(re,0,t.React.createElement(P,{label:`${_} Message`,icon:t.React.createElement(P.Icon,{source:c.getAssetIDByName("ic_locale_24px"),IconComponent:()=>t.React.createElement(t.ReactNative.Image,{resizeMode:"cover",style:z.iconComponent,source:c.getAssetIDByName("ic_locale_24px")})}),onPress:oe}))})})})}var N;(function(e){e[e.BUILT_IN=0]="BUILT_IN",e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT",e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION",e[e.BOT=3]="BOT",e[e.PLACEHOLDER=4]="PLACEHOLDER"})(N||(N={}));var p;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER=6]="USER",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(p||(p={}));var m;(function(e){e[e.CHAT=1]="CHAT",e[e.USER=2]="USER",e[e.MESSAGE=3]="MESSAGE"})(m||(m={}));var x={arabic:"AR",bulgarian:"BG",czech:"CS",danish:"DA",german:"DE",greek:"EL",english:"EN",spanish:"ES",estonian:"ET",finnish:"FI",french:"FR",hungarian:"HU",indonesian:"ID",italian:"IT",japanese:"JA",korean:"KO",lithuanian:"LT",latvian:"LV",norwegian:"NO",dutch:"NL",polish:"PL",portuguese:"PT",romanian:"RO",russian:"RU",slovak:"SK",slovenian:"SL",swedish:"SV",turkish:"TR",ukrainian:"UK","chinese-simplified":"ZH"};const X=g.findByProps("sendBotMessage"),Y=Object.entries(x).map(e=>({name:e[0],displayName:e[0],value:e[1]}));function q(){return G.registerCommand({name:"translate",displayName:"translate",description:"Translate text using DeepL API.",applicationId:"-1",type:m.CHAT,inputType:N.BUILT_IN_TEXT,options:[{name:"text",displayName:"text",description:"Text to translate.",type:p.STRING,required:!0},{name:"language",displayName:"language",description:"Target language",type:p.STRING,choices:[...Y],required:!0}],async execute(e,a){const[i,s]=e;try{const n=await w.translate(i.value,null,s.value);if(!n.text)throw Error("Translation returned empty text");return await new Promise(A=>k.showConfirmationAlert({title:"Send translated message?",content:t.React.createElement(d.Codeblock,null,n.text),confirmText:"Send",onConfirm:()=>A({content:n.text}),cancelText:"Cancel"}))}catch(n){D.logger.error(n);return X.sendBotMessage(a.channel.id,"Failed to translate message. Check logs.",c.getAssetIDByName("Small"))}}})}const{FormRow:U}=d.Forms,{ScrollView:J}=t.ReactNative;function Z(){O.useProxy(o);const[e,a]=t.React.useState("");return t.React.createElement(J,{style:{flex:1}},t.React.createElement(d.Search,{style:{padding:15},placeholder:"Search Language",onChangeText:i=>a(i)}),Object.entries(x).filter(i=>i[0].includes(e)).map(i=>t.React.createElement(U,{label:i[0],trailing:()=>t.React.createElement(U.Arrow,null),onPress:()=>{o.target_lang=i[1];E.showToast(`Language set to ${i[0]}`,c.getAssetIDByName("check"))}})))}const{ScrollView:Q,Text:W}=t.ReactNative,{FormRow:R}=d.Forms,ee=t.stylesheet.createThemedStyleSheet({subheaderText:{color:C.semanticColors.HEADER_SECONDARY,textAlign:"center",margin:10,marginBottom:50,letterSpacing:.25,fontFamily:t.constants.Fonts.PRIMARY_BOLD,fontSize:14}});function te(){const a=t.NavigationNative.useNavigation();return O.useProxy(o),t.React.createElement(Q,null,t.React.createElement(R,{label:"Translate to",subLabel:o.target_lang.toLowerCase(),leading:t.React.createElement(R.Icon,{source:c.getAssetIDByName("ic_activity_24px")}),trailing:()=>t.React.createElement(R.Arrow,null),onPress:()=>a.push("VendettaCustomPage",{title:"Translate to",render:Z})}),t.React.createElement(W,{style:ee.subheaderText,onPress:()=>t.url.openURL("https://github.com/aeongdesu/vdplugins")},`Build: (${L.manifest.hash.substring(0,7)})`))}const o=L.storage;o.target_lang??="EN";let b=[];var ne={onLoad:()=>b=[K(),q()],onUnload:()=>b.forEach(e=>e()),settings:te};return f.default=ne,f.settings=o,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta,vendetta.commands,vendetta.ui.alerts,vendetta.storage,vendetta.ui.toasts);
