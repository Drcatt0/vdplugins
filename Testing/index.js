(function (exports, api, metro, common, plugin, lazy) {
  "use strict";

  const { React } = common;

  // Create a helper to search for a module by its display name.
  const { factories: { createFilterDefinition }, lazy: { createLazyModule } } = metro;
  const byTypeDisplayName = createFilterDefinition(
    ([name], m) => m?.type?.displayName === name,
    ([name]) => `custom.byTypeDisplayName(${name})`
  );
  const findByTypeDisplayNameLazy = (displayName, expDefault = true) =>
    createLazyModule(expDefault ? byTypeDisplayName(displayName) : byTypeDisplayName.byRaw(displayName));

  // Try to locate the ChatInputActions module (the container for chat bar buttons).
  const ChatInputActions = findByTypeDisplayNameLazy("ChatInputActions");
  // Fallback candidate if needed:
  // const ChatInputActions = findByTypeDisplayNameLazy("ChannelTextAreaButtons");

  // Get the current user and the built-in profile opener.
  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");

  let unpatches = [];

  // Helper: Build the Discord avatar URL.
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Patch the ChatInputActions render function to insert our profile button.
  function patchChatInputActions() {
    if (!ChatInputActions || !ChatInputActions.type) return;

    const unp = api.patcher.before("render", ChatInputActions.type, ([props]) => {
      // Make sure the component has children we can modify.
      if (!props || !props.children || !Array.isArray(props.children)) return;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return;
      const avatarUrl = getUserAvatarUrl(currentUser, 40);
      if (!avatarUrl) return;

      // Create a profile button using React Native's TouchableOpacity and Image.
      const ProfileButton = React.createElement(
        common.TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
              ProfileModule.openProfileSheet(currentUser.id);
            }
          },
          style: { marginRight: 8 }
        },
        React.createElement(common.Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );

      // Prevent duplicate injections by checking for an existing key.
      if (!props.children.some(child => child && child.key === "profile-button")) {
        props.children.unshift(React.cloneElement(ProfileButton, { key: "profile-button" }));
      }
    });

    unpatches.push(unp);
  }

  exports.default = {
    onLoad: () => {
      // Delay the patch slightly to ensure the chat UI has loaded.
      setTimeout(() => {
        patchChatInputActions();
      }, 3000);
    },
    onUnload: () => {
      unpatches.forEach(unp => unp());
    },
    settings: () => null,
  };

  Object.defineProperty(exports, "__esModule", { value: true });
})(exports, bunny.api, bunny.metro, bunny.metro.common, vendetta.plugin, bunny.utils.lazy);
