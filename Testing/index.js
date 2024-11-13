(function(o,e,l,c,d,u,t,p){"use strict";const{FormRow:g}=l.Forms,h=c.findByName("Icon")??c.findByProps("Sizes","compare"),v=c.findByProps("openLazy","hideActionSheet"),{openURL:f}=c.findByProps("openURL","openDeeplink"),y=e.React.createElement(h,{source:u.getAssetIDByName("search")}),SAUCENAO_URL="https://saucenao.com/search.php?url=%s",addReverseImageSearch=()=>{const actionSheetHandler=d.before("openLazy",v,([a,r])=>{r==="MessageLongPressActionSheet"&&a.then(sheet=>{const unpatch=d.after("default",sheet,([{message}],res)=>{e.React.useEffect(()=>void unpatch(),[]);const imageAttachments=(message?.attachments||[]).filter(file=>file.content_type&&file.content_type.startsWith("image"));if(imageAttachments.length===0)return;const links=imageAttachments.map((file,i)=>`> image ${i+1}\n> ${SAUCENAO_URL.replace("%s",encodeURIComponent(file.url))}`).join("\n\n");res.props.children.push(e.React.createElement(g,{leading:y,label:"SauceNAO Reverse Image Search",onPress:()=>{f(SAUCENAO_URL.replace("%s",encodeURIComponent(imageAttachments[0].url)))}}))})})});return actionSheetHandler},plugin={onLoad:function(){this.unpatch=addReverseImageSearch()},onUnload:function(){this.unpatch&&this.unpatch()}};return o.default=plugin,Object.defineProperty(o,"__esModule",{value:!0}),o})({},vendetta.plugin,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets,vendetta.utils,vendetta.storage);
