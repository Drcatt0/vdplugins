(function (exports, api, metro, common, plugin, lazy) {
  "use strict";
  
  // Lazy helpers similar to BunnyPlugins:
  const { factories: { createFilterDefinition }, lazy: { createLazyModule } } = metro;
  const byTypeDisplayName = createFilterDefinition(
    ([name], m) => m?.type?.displayName === name,
    ([name]) => `custom.byTypeDisplayName(${name})`
  );
  const findByTypeDisplayNameLazy = (displayName, expDefault = true) =>
    createLazyModule(expDefault ? byTypeDisplayName(displayName) : byTypeDisplayName.byRaw(displayName));
  
  // Get the ChatInputActions component by its display name.
  const ChatInputActions = findByTypeDisplayNameLazy("ChatInputActions");
  
  // Retrieve the current user and profile opener.
  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");
  
  let unpatches = [];
  
  // Helper: Build the Discord avatar URL.
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }
  
  // Plugin definition.
  const index = {
    onLoad: () => {
      // Patch the render function of ChatInputActions to inject our profile button.
      if (ChatInputActions && ChatInputActions.type) {
        unpatches.push(api.patcher.before("render", ChatInputActions.type, ([props]) => {
          if (!props || !Array.isArray(props.children)) return;
          const currentUser = UserStore.getCurrentUser();
          if (!currentUser) return;
          const avatarUrl = getUserAvatarUrl(currentUser, 40);
          if (!avatarUrl) return;
          
          // Create the profile button using React Native components.
          const ProfileButton = common.React.createElement(
            common.TouchableOpacity,
            {
              onPress: () => {
                if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
                  ProfileModule.openProfileSheet(currentUser.id);
                }
              },
              style: { marginRight: 8 },
              key: "profile-button"
            },
            common.React.createElement(common.Image, {
              source: { uri: avatarUrl },
              style: { width: 32, height: 32, borderRadius: 16 }
            })
          );
          
          // Inject the button if it hasn’t been added already.
          const hasProfileButton = props.children.some(child => child && child.key === "profile-button");
          if (!hasProfileButton) {
            props.children.unshift(ProfileButton);
          }
        }));
      }
    },
    onUnload: () => {
      unpatches.forEach(unpatch => unpatch());
    },
    settings: () => null
  };
  
  exports.default = index;
  Object.defineProperty(exports, "__esModule", { value: true });
})(exports, bunny.api, bunny.metro, bunny.metro.common, vendetta.plugin, bunny.utils.lazy);
