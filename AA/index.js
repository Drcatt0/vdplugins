(function(f,e,l,c,d,u,t){"use strict";const{FormRow:h}=l.Forms,actionSheet=c.findByProps("openLazy","hideActionSheet"),{openURL:a}=c.findByProps("openURL","openDeeplink"),SauceNAO_URL="https://saucenao.com/search.php?url=%s";const insertSauceNAOOption=d.before("openLazy",actionSheet,([args,actionSheetId])=>{if(actionSheetId==="MediaShareActionSheet"){args[0].then(sheet=>{const unpatch=d.after("default",sheet,(props,res)=>{unpatch();const mediaURL=props?.[0]?.message?.attachments?.[0]?.url;if(mediaURL){const option=e.React.createElement(h,{label:"Search on SauceNAO",onPress:()=>a(SauceNAO_URL.replace("%s",encodeURIComponent(mediaURL)))});res.props.children.push(option)}return res})})}});f.onUnload=()=>{insertSauceNAOOption()};})({},vendetta.metro.common,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets,vendetta.plugin);
