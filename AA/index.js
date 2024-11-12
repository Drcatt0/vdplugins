(function(f,e,h){"use strict";const{FormRow:g,FormSwitch:I,showToast:_}=e.ui,l=h.findByProps("openLazy","hideActionSheet"),{clipboard:t}=h.findByProps("setString"),emojiStore=h.findByProps("getById");let enabled=!0;const copyEmojiLink=(emoji)=>{if(!emoji)return;const emojiUrl=emoji.url||`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated?"gif":"png"}`;t.setString(emojiUrl);_("Emoji URL copied to clipboard!",e.getAssetIDByName("ic_check_24px"))},pluginConfig={onLoad(){const patch=h.patcher.after("render",l,(props,res)=>{const emoji=res.props.children?.props?.emoji;if(enabled&&emoji){res.props.onClick=()=>copyEmojiLink(emoji)}return res});f.onUnload=()=>{patch()}}};f.settings=()=>e.React.createElement(e.ReactNative.View,null,e.React.createElement(FormRow,{label:"Enable Emoji Link Copying",trailing:e.React.createElement(FormSwitch,{value:enabled,onValueChange:s=>{enabled=s}})})),f.onUnload=pluginConfig.onLoad})();```
