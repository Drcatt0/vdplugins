(function(f,e,h){"use strict";const{FormRow:g,FormSwitch:I,showToast:_}=e.ui,l=h.findByProps("openLazy","hideActionSheet"),{clipboard:t}=h.findByProps("setString"),emojiStore=h.findByProps("getById");let enabled=!0;const copyEmojiLink=(emoji)=>{if(!emoji)return;const emojiUrl=emoji.url||`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated?"gif":"png"}`;t.setString(emojiUrl);_("Emoji URL copied to clipboard!",e.getAssetIDByName("ic_check_24px"))},pluginConfig={onLoad(){const patch=h.patcher.after("render",l,(props,res)=>{const emoji=res.props.children?.props?.emoji;if(enabled&&emoji){res.props.onClick=()=>copyEmojiLink(emoji)}return res});f.onUnload=()=>{patch()}}};f.settings=()=>e.React.createElement(e.ReactNative.View,null,e.React.createElement(FormRow,{label:"Enable Emoji Link Copying",trailing:e.React.createElement(FormSwitch,{value:enabled,onValueChange:s=>{enabled=s}})})),f.onUnload=pluginConfig.onLoad})();```

### Explanation

- **Click Event on Emoji**: The plugin checks if there’s an emoji in the rendered content and attaches an `onClick` event to it.
- **Copy to Clipboard**: When you click the emoji, its URL is generated and copied to your clipboard.
- **Settings**: A simple toggle switch in the settings to enable or disable this feature.

### Notes

1. **URL Generation**: The plugin constructs the URL using the emoji ID and type (static or animated).
2. **Feedback**: Displays a toast message confirming the emoji link has been copied.
3. **Toggle Option**: Allows you to disable this feature if you no longer need it.

### Usage

1. Enable the plugin from settings if it’s not already enabled.
2. Click on an emoji in a message or anywhere in the chat.
3. The URL for the emoji will be copied to your clipboard, with a confirmation toast message.

Let me know if you’d like any changes or additional features in this plugin!
