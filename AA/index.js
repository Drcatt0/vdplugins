(function(f,e,l,c,d,u,t){"use strict";const{FormRow:h}=l.Forms,actionSheet=c.findByProps("openLazy","hideActionSheet"),{openURL:a}=c.findByProps("openURL","openDeeplink"),SauceNAO_URL="https://saucenao.com/search.php?url=%s";const insertSauceNAOOption=d.before("openLazy",actionSheet,([args,actionSheetId])=>{if(actionSheetId==="MediaShareActionSheet"){args[0].then(sheet=>{const unpatch=d.after("default",sheet,(props,res)=>{d.after("default",res.type,(typeArgs,returnElement)=>{unpatch();const mediaURL=props?.[0]?.message?.attachments?.[0]?.url;if(mediaURL){returnElement.props.children.push(e.React.createElement(h,{label:"SauceNAO",onPress:()=>a(SauceNAO_URL.replace("%s",encodeURIComponent(mediaURL)))}))}return returnElement})})})}});f.onUnload=()=>{insertSauceNAOOption()};})({},vendetta.metro.common,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets,vendetta.plugin);
