(function(p,r,s,e,u){"use strict";const PresenceStore=s.findByStoreName("PresenceStore"),SessionsStore=s.findByStoreName("SessionsStore"),{View:G,Image:I}=e.ReactNative,{getAssetIDByName:H}=u,PlatformIcons={desktop:H("ic_monitor_24px"),web:H("ic_globe_24px"),mobile:H("ic_mobile_device")};function PlatformIndicator({userId:i}){const sessions=SessionsStore.getSessions(),userSession=sessions[i];if(!userSession)return null;const platforms=Object.keys(userSession).map(p=>p.client);return e.createElement(G,{style:{flexDirection:"row"}},platforms.map(platform=>e.createElement(I,{key:platform,source:PlatformIcons[platform],style:{width:16,height:16,marginHorizontal:2}})))}const SimplePlatformPlugin=()=>{return{onLoad(){console.log("Platform Indicators loaded.")},onUnload(){console.log("Platform Indicators unloaded.")}}};p.default=SimplePlatformPlugin()})(typeof exports==="undefined"?{}:exports,vendetta.patcher,vendetta.metro,vendetta.ui,vendetta.ui.assets);
