(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const H="https://api.deeplx.org/BY8mVtDIYSW1rPtp2_nohLP1sCyqS-k5CZXLhkfJT4A/translate";var w={translate:async function(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"auto",i=arguments.length>2?arguments[2]:void 0,s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;try{if(s)return{source_lang:a,text:e};const n=await(await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e,source_lang:a,target_lang:i})})).json();if(n.code!==200)throw Error(`Failed to translate text from DeepL: ${n.message}`);return{source_lang:a,text:n.data}}catch(n){throw Error(`Failed to fetch from DeepL: ${n}`)}}},y;const M=g.findByProps("openLazy","hideActionSheet"),P=((y=g.findByProps("ActionSheetRow"))===null||y===void 0?void 0:y.ActionSheetRow)??d.Forms.FormRow,j=g.findByStoreName("MessageStore"),V=g.findByStoreName("ChannelStore"),z=t.stylesheet.createThemedStyleSheet({iconComponent:{width:24,height:24,tintColor:C.semanticColors.INTERACTIVE_NORMAL}});let T=[];function K(){return B.before("openLazy",M,function(e){let[a,i,s]=e;const n=s?.message;i!=="MessageLongPressActionSheet"||!n||a.then(function(A){const ae=B.after("default",A,function(ue,ie){t.React.useEffect(function(){return function(){ae()}},[]);const v=F.findInReactTree(ie,function(r){var l,h;return(r==null||(h=r[0])===null||h===void 0||(l=h.type)===null||l===void 0?void 0:l.name)==="ButtonRow"});if(!v)return;const re=Math.max(v.findIndex(function(r){return r.props.message===t.i18n.Messages.MARK_UNREAD}),0),u=j.getMessage(n.channel_id,n.id);const S=u?.id??n.id,se=u?.content??n.content,I=T.find(function(r){return Object.keys(r)[0]===S},"cache object"),_="SauceNAO",icon=c.getAssetIDByName("ic_search"),oe=function(){t.url.openURL("https://www.google.com"); M.hideActionSheet();};v.splice(re,0,t.React.createElement(P,{label:`${_} Message`,icon:t.React.createElement(P.Icon,{source:icon,IconComponent:function(){return t.React.createElement(t.ReactNative.Image,{resizeMode:"cover",style:z.iconComponent,source:icon})}}),onPress:oe}))})})})}let b=[];var ne={onLoad:function(){return b=[K()]},onUnload:function(){for(const e of b)e()}};return f.default=ne,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta,vendetta.commands,vendetta.ui.alerts);
