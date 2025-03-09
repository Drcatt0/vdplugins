(function (exports, api, metro, common, plugin, lazy) {
  "use strict";

  const { React } = common;
  // Lazy-load the chat input actions module by its display name.
  // (If this isn’t working on iOS, you may try other candidates such as "ChannelTextAreaButtons".)
const ChatInputActions = lazy.createLazyModule(() =>
  metro.findByTypeDisplayName("ChannelTextAreaButtons")
);

  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");

  let unpatches = [];

  // Helper: Get the user's avatar URL from Discord's CDN.
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Patch the chat input actions component to insert our profile button.
  function patchChatInputActions() {
    if (!ChatInputActions) return;
    unpatches.push(
      api.patcher.before("render", ChatInputActions.type, ([props]) => {
        if (!props || !props.children) return;
        const currentUser = UserStore.getCurrentUser();
        if (!currentUser) return;
        const avatarUrl = getUserAvatarUrl(currentUser);
        if (!avatarUrl) return;
        // Create a profile button using React Native components.
        const ProfileButton = React.createElement(
          common.TouchableOpacity,
          {
            onPress: () => {
              if (
                ProfileModule &&
                typeof ProfileModule.openProfileSheet === "function"
              ) {
                ProfileModule.openProfileSheet(currentUser.id);
              }
            },
            style: { marginRight: 8 },
          },
          React.createElement(common.Image, {
            source: { uri: avatarUrl },
            style: { width: 32, height: 32, borderRadius: 16 },
          })
        );
        // Insert our profile button at the start of the children array.
        if (Array.isArray(props.children)) {
          props.children.unshift(ProfileButton);
        }
      })
    );
  }

  exports.default = {
    onLoad: () => {
      // Delay patching to let the UI load.
      setTimeout(() => {
        patchChatInputActions();
      }, 3000);
    },
    onUnload: () => {
      unpatches.forEach((unpatch) => unpatch());
    },
    settings: () => null,
  };

  Object.defineProperty(exports, "__esModule", { value: true });
})(
  typeof exports === "undefined" ? (this.plugin = {}) : exports,
  bunny.api,
  bunny.metro,
  bunny.metro.common,
  vendetta.plugin,
  bunny.utils.lazy
);
