(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const SAUCENAO_URL="https://saucenao.com/search.php?url=%s";const Overlay=g.findByProps("showOverlay","hideOverlay"),ImagePreview=g.findByName("ImagePreview");function SauceNAOButton(url){return t.React.createElement("TouchableOpacity",{style:{position:"absolute",top:20,right:20,padding:10,backgroundColor:"#FFFFFFCC",borderRadius:5},onPress:()=>{g.findByProps("sendBotMessage").sendBotMessage(g.findByStoreName("ChannelStore").getChannelId(),{content:"[SauceNAO Search]("+SAUCENAO_URL.replace("%s",encodeURIComponent(url))+")"});Overlay.hideOverlay();}},t.React.createElement("Text",{style:{color:"#000",fontWeight:"bold"}},"SauceNAO"));}function injectSauceNAOButton(){B.after("default",ImagePreview,function(args, res){if (!args.url) return res;res.props.children=t.React.createElement(t.React.Fragment,null,res.props.children,SauceNAOButton(args.url));return res;});}var plugin={onLoad:function(){this.unpatch=injectSauceNAOButton();},onUnload:function(){this.unpatch&&this.unpatch();}};return f.default=plugin,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta,vendetta.commands,vendetta.ui.alerts,vendetta.storage,vendetta.ui.toasts);
