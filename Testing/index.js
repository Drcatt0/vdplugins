(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const SAUCENAO_URL="https://saucenao.com/search.php?url=%s",{openLazy,hideActionSheet}=g.findByProps("openLazy","hideActionSheet"),ActionSheetRow=d.Forms.FormRow??g.findByProps("ActionSheetRow"),{sendBotMessage}=g.findByProps("sendBotMessage"),{getChannelId}=g.findByStoreName("ChannelStore");function performSauceSearch(message){const imageUrl=message.attachments[0]?.url;if(!imageUrl){sendBotMessage(getChannelId(),{content:"No image found to search."});return}const sauceUrl=SAUCENAO_URL.replace("%s",encodeURIComponent(imageUrl));sendBotMessage(getChannelId(),{content:`[SauceNAO Search](${sauceUrl})`});hideActionSheet()}function setupPlugin(){return B.before("openLazy",openLazy,function(e){let[sheet,type,options]=e;const message=options?.message;if(type!=="MessageLongPressActionSheet"||!message?.attachments?.length)return;sheet.then(function(ActionSheet){const unpatch=B.after("default",ActionSheet,function(props,res){t.React.useEffect(()=>()=>unpatch(),[]);const buttonRow=Array.isArray(res.props.children)?res.props.children:[];buttonRow.push(t.React.createElement(ActionSheetRow,{label:"SauceNAO Search",onPress:()=>performSauceSearch(message)}));res.props.children=buttonRow})})})}function setupCommand(){G.registerCommand({name:"saucenao",displayName:"SauceNAO",description:"Perform a reverse image search on SauceNAO",options:[{name:"url",displayName:"Image URL",description:"URL of the image to search",type:3,required:!0}],execute:async(args,context)=>{const imageUrl=args[0].value;const sauceUrl=SAUCENAO_URL.replace("%s",encodeURIComponent(imageUrl));return{content:`[SauceNAO Search](${sauceUrl})`}}})}var plugin={onLoad:function(){this.unpatchAction=setupPlugin();setupCommand()},onUnload:function(){this.unpatchAction&&this.unpatchAction()}};return f.default=plugin,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta,vendetta.commands,vendetta.ui.alerts,vendetta.storage,vendetta.ui.toasts);
