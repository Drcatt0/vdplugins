(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const H="https://api.deeplx.org/BY8mVtDIYSW1rPtp2_nohLP1sCyqS-k5CZXLhkfJT4A/translate";var w={translate:async function(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"auto",i=arguments.length>2?arguments[2]:void 0,s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;try{if(s)return{source_lang:a,text:e};const n=await(await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e,source_lang:a,target_lang:i})})).json();if(n.code!==200)throw Error(`Failed to translate text from DeepL: ${n.message}`);return{source_lang:a,text:n.data}}catch(n){throw Error(`Failed to fetch from DeepL: ${n}`)}}},y;const M=g.findByProps("openLazy","hideActionSheet"),P=((y=g.findByProps("ActionSheetRow"))===null||y===void 0?void 0:y.ActionSheetRow)??d.Forms.FormRow,j=g.findByStoreName("MessageStore"),V=g.findByStoreName("ChannelStore"),z=t.stylesheet.createThemedStyleSheet({iconComponent:{width:24,height:24,tintColor:C.semanticColors.INTERACTIVE_NORMAL}});let T=[];function K(){return B.before("openLazy",M,function(e){let[a,i,s]=e;const n=s?.message;i!=="MessageLongPressActionSheet"||!n||a.then(function(A){const ae=B.after("default",A,function(ue,ie){t.React.useEffect(function(){return function(){ae()}},[]);const v=F.findInReactTree(ie,function(r){var l,h;return(r==null||(h=r[0])===null||h===void 0||(l=h.type)===null||l===void 0?void 0:l.name)==="ButtonRow"});if(!v)return;const re=Math.max(v.findIndex(function(r){return r.props.message===t.i18n.Messages.MARK_UNREAD}),0),u=j.getMessage(n.channel_id,n.id);if(!u?.content&&!n.content)return;const S=u?.id??n.id,se=u?.content??n.content,I=T.find(function(r){return Object.keys(r)[0]===S},"cache object"),_="SauceNAO",icon=c.getAssetIDByName("ic_search"),oe=async function(){try{const r=o.target_lang,l=_==="SauceNAO",h=await w.translate(u.content,void 0,r,!l);t.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...u,content:`${l?h.text:I[S]} ${l?`\`[${r?.toLowerCase()}]\``:""}`,guild_id:V.getChannel(u.channel_id).guild_id},log_edit:!1}),l?T.unshift({[S]:se}):T=T.filter(function(le){return le!==I},"cached data override")}catch(r){E.showToast("Failed to translate message. Please check Debug Logs for more info.",c.getAssetIDByName("Small")),D.logger.error(r)}finally{return M.hideActionSheet()}};v.splice(re,0,t.React.createElement(P,{label:`${_} Message`,icon:t.React.createElement(P.Icon,{source:icon,IconComponent:function(){return t.React.createElement(t.ReactNative.Image,{resizeMode:"cover",style:z.iconComponent,source:icon})}}),onPress:oe}))})})})}var N;(function(e){e[e.BUILT_IN=0]="BUILT_IN",e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT",e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION",e[e.BOT=3]="BOT",e[e.PLACEHOLDER=4]="PLACEHOLDER"})(N||(N={}));var p;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER=6]="USER",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(p||(p={}));var m;(function(e){e[e.CHAT=1]="CHAT",e[e.USER=2]="USER",e[e.MESSAGE=3]="MESSAGE"})(m||(m={}));var x={arabic:"AR",bulgarian:"BG",czech:"CS",danish:"DA",german:"DE",greek:"EL",english:"EN",spanish:"ES",estonian:"ET",finnish:"FI",french:"FR",hungarian:"HU",indonesian:"ID",italian:"IT",japanese:"JA",korean:"KO",lithuanian:"LT",latvian:"LV",norwegian:"NO",dutch:"NL",polish:"PL",portuguese:"PT",romanian:"RO",russian:"RU",slovak:"SK",slovenian:"SL",swedish:"SV",turkish:"TR",ukrainian:"UK","chinese-simplified":"ZH"};const X=g.findByProps("sendBotMessage"),Y=Object.entries(x).map(function(e){let[a,i]=e;return{name:a,displayName:a,value:i}});function q(){return G.registerCommand({name:"translate",displayName:"translate",description:"Send a message using Dislate in any language chosen, using the DeepL Translate API.",displayDescription:"Send a message using Dislate in any language chosen, using the DeepL Translate API.",applicationId:"-1",type:m.CHAT,inputType:N.BUILT_IN_TEXT,options:[{name:"text",displayName:"text",description:"The text/message for Dislate to translate. Please note some formatting of mentions and emojis may break due to the API.",displayDescription:"The text/message for Dislate to translate. Please note some formatting of mentions and emojis may break due to the API.",type:p.STRING,required:!0},{name:"language",displayName:"language",description:"The language that Dislate will translate the text into. This can be any language from the list.",displayDescription:"The language that Dislate will translate the text into. This can be any language from the list.",type:p.STRING,choices:[...Y],required:!0}],async execute(e,a){const[i,s]=e;try{const n=await w.translate(i.value,null,s.value);return await new Promise(function(A){return k.showConfirmationAlert({title:"Are you sure you want to send it?",content:React.createElement(d.Codeblock,null,n.text),confirmText:"Yep, send it!",onConfirm:function(){return A({content:n.text})},cancelText:"Nope, don't send it"})})}catch(n){return D.logger.error(n),X.sendBotMessage(a.channel.id,"Failed to translate message. Please check Debug Logs for more info.",c.getAssetIDByName("Small"))}}})}const{FormRow:U}=d.Forms,{ScrollView:J}=t.ReactNative;function Z(){O.useProxy(o);const[e,a]=t.React.useState("");return t.React.createElement(J,{style:{flex:1}},t.React.createElement(d.Search,{style:{padding:15},placeholder:"Search Language",onChangeText:function(i){a(i)}}),Object.entries(x).filter(function(i){let[s,n]=i;return s.includes(e)}).map(function(i){let[s,n]=i;return t.React.createElement(U,{label:s,trailing:function(){return t.React.createElement(U.Arrow,null)},onPress:function(){o.target_lang!=n&&(o.target_lang=n,E.showToast(`Saved ToLang to ${s}`,c.getAssetIDByName("check")))}})}))}const{ScrollView:Q,Text:W}=t.ReactNative,{FormRow:R}=d.Forms,ee=t.stylesheet.createThemedStyleSheet({subheaderText:{color:C.semanticColors.HEADER_SECONDARY,textAlign:"center",margin:10,marginBottom:50,letterSpacing:.25,fontFamily:t.constants.Fonts.PRIMARY_BOLD,fontSize:14}});function te(){var e;const a=t.NavigationNative.useNavigation();return O.useProxy(o),t.React.createElement(Q,null,t.React.createElement(R,{label:"Translate to",subLabel:(e=o.target_lang)===null||e===void 0?void 0:e.toLowerCase(),leading:t.React.createElement(R.Icon,{source:c.getAssetIDByName("ic_activity_24px")}),trailing:function(){return t.React.createElement(R.Arrow,null)},onPress:function(){return a.push("VendettaCustomPage",{title:"Translate to",render:Z})}}),t.React.createElement(W,{style:ee.subheaderText,onPress:function(){return t.url.openURL("https://github.com/aeongdesu/vdplugins")}},`Build: (${L.manifest.hash.substring(0,7)})`))}const o=L.storage;o.target_lang??(o.target_lang="EN");let b=[];var ne={onLoad:function(){return b=[K(),q()]},onUnload:function(){for(const e of b)e()},settings:te};return f.default=ne,f.settings=o,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta,vendetta.commands,vendetta.ui.alerts);
