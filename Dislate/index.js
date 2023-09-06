(function(b,h,a,f,E,g,d,B,P,j,z,F){"use strict";var A={string:function(e,n){return e.split(n?/(?=[A-Z])/:"_").map(function(t){return t[0].toUpperCase()+t.slice(1)}).join(" ")}};async function G(e,n){let{fromLanguage:t,toLanguage:l}=n;const s="https://translate.googleapis.com/translate_a/single?"+new URLSearchParams({client:"gtx",sl:t,tl:l,dt:"t",dj:"1",source:"input",q:e}),r=await fetch(s);if(!r.ok)throw new Error("Failed to translate");const{src:i,sentences:T}=await r.json();return{src:i,text:T.map(function(_){return _?.trans}).filter(Boolean).join("")}}async function $(e,n,t,l){let{fromLanguage:s="detect",toLanguage:r="english"}=n;const i=await G(e,{fromLanguage:t[s],toLanguage:t[r]});return l?e:i.text}var x={translate:$};g.storage.DislateLangFrom??="detect",g.storage.DislateLangTo??="english",g.storage.DislateLangAbbr??=!1;let o=g.storage;var H=h.findByProps("sendBotMessage"),m=["detect","amharic","arabic","aymara","assamese","akan","azerbaijani","belarusian","bulgarian","bambara","bengali","corsican","czech","bosnian","danish","catalan","valencian","german","ewe","divehi","dhivehi","maldivian","english","greek","estonian","esperanto","basque","spanish","castilian","finnish","french","persian","irish","galician","guarani","western_frisian","gujarati","gaelic","scottish_gaelic","hausa","croatian","hebrew","hindi","haitian","haitian_creole","armenian","indonesian","hungarian","igbo","icelandic","italian","georgian","javanese","japanese","korean","kazakh","kannada","afrikaans","central_khmer","welsh","kurdish","kirghiz","kyrgyz","latin","luxembourgish","letzeburgesch","ganda","lao","latvian","lingala","lithuanian","malagasy","macedonian","malayalam","maori","marathi","norwegian_bokm\xE5l","mongolian","burmese","maltese","nepali","malay","dutch","flemish","chichewa","chewa","nyanja","norwegian","oromo","oriya","panjabi","punjabi","polish","quechua","pushto","pashto","russian","sanskrit","romanian","moldavian","moldovan","slovenian","kinyarwanda","slovak","sinhala","sinhalese","samoan","shona","somali","serbian","albanian","swahili","southern_sotho","swedish","sundanese","tamil","tajik","telugu","tagalog","turkmen","tigrinya","thai","tsonga","sindhi","portuguese","twi","turkish","tatar","urdu","ukrainian","uighur","uyghur","uzbek","vietnamese","yiddish","xhosa","chinese_traditional","chinese_simplified","zulu","yoruba"],C=["auto","am","ar","ay","as","ak","az","be","bg","bm","bn","co","cs","bs","da","ca","ca","de","ee","dv","dv","dv","en","el","et","eo","eu","es","es","fi","fr","fa","ga","gl","gn","fy","gu","gd","gd","ha","hr","he","hi","ht","ht","hy","id","hu","ig","is","it","ka","jv","ja","ko","kk","kn","af","km","cy","ku","ky","ky","la","lb","lb","lg","lo","lv","ln","lt","mg","mk","ml","mi","mr","nb","mn","my","mt","ne","ms","nl","nl","ny","ny","ny","no","om","or","pa","pa","pl","qu","ps","ps","ru","sa","ro","ro","ro","sl","rw","sk","si","si","sm","sn","so","sr","sq","sw","st","sv","su","ta","tg","te","tl","tk","ti","th","ts","sd","pt","tw","tr","tt","ur","uk","ug","ug","uz","vi","yi","xh","zh-tw","zh-cn","zu","yo"];const{FormRow:O}=d.Forms,{ScrollView:q}=a.ReactNative;function V(){const[e,n]=a.React.useState("");return a.React.createElement(q,{style:{flex:1}},a.React.createElement(d.Search,{style:{padding:15},placeholder:"Search Language",onChangeText:function(t){n(t)}}),Object.values(m).filter(function(t){return t!=="detect"}).filter(function(t){return t.includes(e)}).map(function(t,l){return a.React.createElement(O,{label:t,trailing:function(){return a.React.createElement(O.Arrow,null)},onPress:function(){o.DislateLangTo!=t&&(o.DislateLangTo=t,j.showToast(`Saved ToLang to ${o.DislateLangTo}`,f.getAssetIDByName("check")))}})}))}const{ScrollView:X,Text:Y}=a.ReactNative,{FormRow:N}=d.Forms,K=a.stylesheet.createThemedStyleSheet({subheaderText:{color:P.semanticColors.HEADER_SECONDARY,textAlign:"center",margin:10,marginBottom:50,letterSpacing:.25,fontFamily:a.constants.Fonts.PRIMARY_BOLD,fontSize:14}});function J(){const e=a.NavigationNative.useNavigation();return a.React.createElement(X,null,a.React.createElement(N,{label:"Translate to",subLabel:o.DislateLangTo,leading:a.React.createElement(N.Icon,{source:f.getAssetIDByName("ic_activity_24px")}),trailing:function(){return a.React.createElement(N.Arrow,null)},onPress:function(){return e.push("VendettaCustomPage",{title:"Translate to",render:V})}}),a.React.createElement(Y,{style:K.subheaderText,onPress:function(){return a.url.openURL("https://github.com/aeongdesu/vdplugins")}},`Build: (${g.manifest.hash.substring(0,7)})`))}var R;(function(e){e[e.BUILT_IN=0]="BUILT_IN",e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT",e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION",e[e.BOT=3]="BOT",e[e.PLACEHOLDER=4]="PLACEHOLDER"})(R||(R={}));var p;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER=6]="USER",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(p||(p={}));var L;(function(e){e[e.CHAT=1]="CHAT",e[e.USER=2]="USER",e[e.MESSAGE=3]="MESSAGE"})(L||(L={}));const Q=m.filter(function(e){return e!=="detect"}).map(function(e){return{name:A.string(e),displayName:A.string(e),value:e}});var Z=z.registerCommand({id:"translate",name:"translate",displayName:"translate",description:"Send a message using Dislate in any language chosen, using the Google Translate API.",displayDescription:"Send a message using Dislate in any language chosen, using the Google Translate API.",type:L.CHAT,inputType:R.BUILT_IN_TEXT,options:[{name:"text",displayName:"text",description:"The text/message for Dislate to translate. Please note some formatting of mentions and emojis may break due to the API.",displayDescription:"The text/message for Dislate to translate. Please note some formatting of mentions and emojis may break due to the API.",type:p.STRING,required:!0},{name:"language",displayName:"language",description:'The language that Dislate will translate the text into. This can be any language from the list, except "Detect".',displayDescription:'The language that Dislate will translate the text into. This can be any language from the list, except "Detect".',type:p.STRING,choices:[...Q],required:!0}],async execute(e,n){const t=e.find(function(i){return i.name==="text"}).value,l=e.find(function(i){return i.name==="language"}).value,s=Object.assign({},...m.map(function(i,T){return{[i]:C[T]}})),r=await x.translate(t,{fromLanguage:o.DislateLangFrom,toLanguage:l},s);return r?await new Promise(function(i){return F.showConfirmationAlert({title:"Are you sure you want to send it?",content:React.createElement(React.Fragment,null,React.createElement(d.Codeblock,null,r)),confirmText:"Yep, send it!",onConfirm:function(){return i({content:r})},cancelText:"Nope, don't send it"})}):H.sendBotMessage(n.channel.id,`Failed to translate: ${t}`)}});const W=[Z],M=h.findByProps("openLazy","hideActionSheet"),ee=h.findByStoreName("MessageStore"),te=h.findByStoreName("ChannelStore"),{FormRow:ae,FormIcon:ne}=d.Forms,U=Object.assign({},...m.map(function(e,n){return{[e]:C[n]}}));let y=[{invalid_id:"rosie and sapphire sucks"}],ie=[];var se={onLoad:function(){B.before("openLazy",M,function(e){let[n,t,l]=e;const s=l?.message;t!=="MessageLongPressActionSheet"||!s||n.then(function(r){const i=B.after("default",r,function(T,_){a.React.useEffect(function(){return function(){i()}},[]);const k=E.findInReactTree(_,function(c){return c?.[0]?.type?.name==="ButtonRow"});if(!k)return;const re=Math.max(k.findIndex(function(c){return c.props.message===a.i18n.Messages.MARK_UNREAD}),0),u=ee.getMessage(s.channel_id,s.id);if(!u?.content&&!s.content)return;const w=u.id??s.id,oe=u.content??s.content,D=y.find(function(c){return Object.keys(c)[0]===w},"cache object");let I=D?"Revert":"Translate";const le=async function(c){const ce=c??o.DislateLangFrom,S=o.DislateLangTo,v=I==="Translate",ue=await x.translate(u.content,{fromLanguage:ce,toLanguage:S},U,!v);a.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...u,content:`${v?ue:D[w]} ${v?`\`[${o.DislateLangAbbr?U[S].toUpperCase():A.string(S)}]\``:""}`,guild_id:te.getChannel(u.channel_id).guild_id},log_edit:!1}),v?y.unshift({[w]:oe}):y=y.filter(function(ge){return ge!==D},"cached data override")};k.splice(re,0,a.React.createElement(ae,{label:`${I} Message`,leading:a.React.createElement(ne,{style:{opacity:1},source:I==="Translate"?f.getAssetIDByName("ic_locale_24px"):f.getAssetIDByName("ic_highlight")}),onPress:async function(){await le(),M.hideActionSheet()}}))})})})},onUnload:function(){for(const e of W)e();for(const e of ie)e()},settings:J};return b.default=se,Object.defineProperty(b,"__esModule",{value:!0}),b})({},vendetta.metro,vendetta.metro.common,vendetta.ui.assets,vendetta.utils,vendetta.plugin,vendetta.ui.components,vendetta.patcher,vendetta.ui,vendetta.ui.toasts,vendetta.commands,vendetta.ui.alerts);
