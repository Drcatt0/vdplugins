(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const M=g.findByProps("openLazy","hideActionSheet"),P=((y=g.findByProps("ActionSheetRow"))===null||y===void 0?void 0:y.ActionSheetRow)??d.Forms.FormRow,z=t.stylesheet.createThemedStyleSheet({iconComponent:{width:24,height:24,tintColor:C.semanticColors.INTERACTIVE_NORMAL}});function K(){return B.before("openLazy",M,function(e){let[a,i,s]=e;const n=s?.message;i!=="MessageLongPressActionSheet"||!n||a.then(function(A){const ae=B.after("default",A,function(ue,ie){t.React.useEffect(function(){return function(){ae()}},[]);const v=F.findInReactTree(ie,function(r){return Array.isArray(r)});if(!v)return;const icon=c.getAssetIDByName("ic_search"),onPress=function(){E.showToast("SauceNAO selected",c.getAssetIDByName("check"));M.hideActionSheet();};v.push(t.React.createElement(P,{label:"SauceNAO",icon:t.React.createElement(P.Icon,{source:icon,IconComponent:function(){return t.React.createElement(t.ReactNative.Image,{resizeMode:"cover",style:z.iconComponent,source:icon})}}),onPress}));ie.props.children=v;});});});}var plugin={onLoad:function(){this.unpatch=K();},onUnload:function(){this.unpatch&&this.unpatch();}};return f.default=plugin,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta.utils,vendetta.ui.alerts);
