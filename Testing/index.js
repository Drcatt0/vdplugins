(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const H="https://saucenao.com";var w={translate:async function(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"auto",i=arguments.length>2?arguments[2]:void 0,s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;try{if(s)return{source_lang:a,text:e};const n=await(await fetch(H,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e,source_lang:a,target_lang:i})})).json();if(n.code!==200)throw Error(`Failed to translate text from DeepL: ${n.message}`);return{source_lang:a,text:n.data}}catch(n){throw Error(`Failed to fetch from DeepL: ${n}`)}}},y;const M=g.findByProps("openLazy","hideActionSheet"),P=((y=g.findByProps("ActionSheetRow"))===null||y===void 0?void 0:y.ActionSheetRow)??d.Forms.FormRow,j=g.findByStoreName("MessageStore"),V=g.findByStoreName("ChannelStore"),z=t.stylesheet.createThemedStyleSheet({iconComponent:{width:24,height:24,tintColor:C.semanticColors.INTERACTIVE_NORMAL}});let T=[];function K(){return B.before("openLazy",M,function(e){let[a,i,s]=e;const n=s?.message;i!=="MessageLongPressActionSheet"||!n||a.then(function(A){const ae=B.after("default",A,function(ue,ie){t.React.useEffect(function(){return function(){ae()}},[]);const v=F.findInReactTree(ie,function(r){var l,h;return(r==null||(h=r[0])===null||h===void 0||(l=h.type)===null||l===void 0?void 0:l.name)==="ButtonRow"});if(!v)return;const re=Math.max(v.findIndex(function(r){return r.props.message===t.i18n.Messages.MARK_UNREAD}),0),u=j.getMessage(n.channel_id,n.id);const imageAttachments = u?.attachments?.filter(att => att.content_type?.startsWith("image")); if (!imageAttachments || imageAttachments.length === 0) return; const S=u?.id??n.id,se=u?.content??n.content,I=T.find(function(r){return Object.keys(r)[0]===S},"cache object"),_="SauceNAO",icon=c.getAssetIDByName("ic_search"),oe=function(){if(imageAttachments.length === 1){const saucenaoUrl=`https://saucenao.com/search.php?url=${encodeURIComponent(imageAttachments[0].url)}`;t.url.openURL(saucenaoUrl);}else{const links = imageAttachments.map((att, index) => `> [Image ${index + 1}](https://saucenao.com/search.php?url=${encodeURIComponent(att.url)})`).join("\n");t.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...u,content:links,guild_id:V.getChannel(u.channel_id).guild_id},log_edit:!1});}M.hideActionSheet();};v.splice(re,0,t.React.createElement(P,{label:_,icon:t.React.createElement(P.Icon,{source:icon,IconComponent:function(){return t.React.createElement(t.ReactNative.Image,{resizeMode:"cover",style:z.iconComponent,source:icon})}}),onPress:oe}))})})})}

// Define available search engines
const searchEngines = {
    "SauceNAO": "https://saucenao.com",
    "Google": "https://images.google.com",
    "TinEye": "https://tineye.com",
};

const searchEngineChoices = Object.entries(searchEngines).map(([name, url]) => ({ name, url }));

// Page to select a search engine
function SearchEngineSettingsPage() {
    const [searchTerm, setSearchTerm] = t.React.useState("");
    return t.React.createElement(t.ReactNative.ScrollView, { style: { flex: 1 } },
        t.React.createElement(d.Forms.Search, {
            placeholder: "Search Engine",
            onChangeText: setSearchTerm,
        }),
        searchEngineChoices
            .filter(choice => choice.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(choice => t.React.createElement(d.Forms.FormRow, {
                key: choice.name, // Add a unique key to each row
                label: choice.name,
                trailing: () => t.React.createElement(d.Forms.FormRow.Arrow, null),
                onPress: () => {
                    O.set("selectedEngine", choice.url); // Save selected engine URL to storage
                    E.showToast(`Selected ${choice.name} as search engine`, c.getAssetIDByName("check"));
                },
            }))
    );
}

// Main settings page
function SettingsPage() {
    const navigation = t.NavigationNative.useNavigation();
    return t.React.createElement(t.ReactNative.ScrollView, { style: { flex: 1 } },
        t.React.createElement(d.Forms.FormRow, {
            label: "Select Search Engine",
            trailing: () => t.React.createElement(d.Forms.FormRow.Arrow, null),
            onPress: () => navigation.push("VendettaCustomPage", { title: "Select Search Engine", render: SearchEngineSettingsPage })
        }),
        t.React.createElement(t.ReactNative.Text, {
            style: { textAlign: "center", margin: 10 }
        }, "Configure your preferred reverse image search engine.")
    );
}

let b = [];
var ne = {
    onLoad: function() { return b = [K()] },
    onUnload: function() { for (const e of b) e() },
    settings: SettingsPage
};

return f.default = ne, Object.defineProperty(f, "__esModule", { value: !0 }), f
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta, vendetta.commands, vendetta.ui.alerts, vendetta.storage, vendetta.ui.toasts);
