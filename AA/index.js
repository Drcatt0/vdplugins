(function(f,e,l,c,d,u){"use strict";const{FormRow:h}=l.Forms,actionSheet=c.findByProps("openLazy","hideActionSheet"),{openURL:a}=c.findByProps("openURL","openDeeplink"),SauceNAO_URL="https://saucenao.com/search.php?url=%s";const patchSauceNAO=d.before("openLazy",actionSheet,([args,actionSheetId])=>{if(actionSheetId==="MediaShareActionSheet"){args[0].then(sheet=>{const unpatch=d.after("default",sheet,(props,res)=>{try{const mediaURL=props?.[0]?.attachments?.[0]?.url;if(mediaURL){res.props.children.push(e.React.createElement(h,{label:"Search on SauceNAO",onPress:()=>{a(SauceNAO_URL.replace("%s",encodeURIComponent(mediaURL)));u.hideActionSheet()}}))}unpatch()}catch(err){console.error("SauceNAO Plugin Error:",err)}})})}});f.onUnload=()=>{patchSauceNAO()};})({},vendetta.metro.common,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets);
