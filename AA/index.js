(function(o,e,l,c,d,u,t){"use strict";const{FormRow:g}=l.Forms,h=c.findByName("Icon")??c.findByProps("Sizes","compare"),v=c.findByProps("openLazy","hideActionSheet"),{openURL:f}=c.findByProps("openURL","openDeeplink"),y=e.React.createElement(h,{source:u.getAssetIDByName("search")}),saucenaoURL="https://saucenao.com/search.php?url=%s",addSauceOption=d.before("openLazy",v,([a,r])=>{if(r==="MediaShareActionSheet"){a.then(F=>{const unpatch=d.after("default",F,(props,A)=>{e.React.useEffect(()=>void unpatch(),[]);const mediaItem=props[0]?.syncer?.sources?.[props[0].syncer.index?.value];if(mediaItem){const mediaURL=mediaItem?.sourceURI || mediaItem?.uri;console.log("Found media URL:", mediaURL);A.props.children.props.children.push(e.React.createElement(g,{leading:y,label:"SauceNAO",onPress:()=>f(saucenaoURL.replace("%s",encodeURIComponent(mediaURL)))}))}else{console.log("Media item not found.");}})})}});o.onUnload=addSauceOption,o})({},vendetta.metro.common,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets,vendetta.plugin);
