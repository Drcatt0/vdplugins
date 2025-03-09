(function (exports, api, metro, common, plugin, lazy) {
  "use strict";

  const { React } = metro.common;
  const { TouchableOpacity, Image } = metro.common.ReactNative;
  
  // Lazy helper – similar to BunnyPlugins – to find modules by display name.
  const { factories: { createFilterDefinition }, lazy: { createLazyModule } } = metro;
  const byTypeDisplayName = createFilterDefinition(
    ([name], m) => m && m.type && m.type.displayName === name,
    ([name]) => `custom.byTypeDisplayName(${name})`
  );
  const findByTypeDisplayNameLazy = (displayName, expDefault = true) =>
    createLazyModule(expDefault ? byTypeDisplayName(displayName) : byTypeDisplayName.byRaw(displayName));

  // Try to retrieve the chatbar actions container.
  const ChatInputActions = findByTypeDisplayNameLazy("ChatInputActions");
  // Fallback candidate if needed:
  // const ChatInputActions = findByTypeDisplayNameLazy("ChannelTextAreaButtons");

  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");

  let unpatches = [];

  // Helper: Build the Discord avatar URL.
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Strategy 1: Patch the chat input container to inject our profile button.
  function patchChatInput() {
    if (!ChatInputActions || !ChatInputActions.type) return false;
    unpatches.push(api.patcher.before("render", ChatInputActions.type, ([props]) => {
      if (!props || !Array.isArray(props.children)) return;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return;
      const avatarUrl = getUserAvatarUrl(currentUser, 40);
      if (!avatarUrl) return;
      
      // Create a profile button with an extra red border for visibility.
      const ProfileButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
              ProfileModule.openProfileSheet(currentUser.id);
            }
          },
          style: { marginRight: 8, borderWidth: 2, borderColor: "red" },
          key: "profile-button"
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );

      // Inject the profile button if it isn't already present.
      if (!props.children.some(child => child && child.key === "profile-button")) {
        props.children.unshift(ProfileButton);
      }
    }));
    return true;
  }

  // Strategy 2: Fallback – patch the AppShell to add a floating button.
  function patchAppShell() {
    const AppShell =
      metro.findByProps("AppShell") ||
      metro.findByName("AppShell") ||
      metro.findByProps("renderRouteContainer");
    if (!AppShell) return false;
    unpatches.push(api.patcher.after("render", AppShell.default ? AppShell.default : AppShell, (_, res) => {
      if (!res || !res.props) return res;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return res;
      const avatarUrl = getUserAvatarUrl(currentUser, 40);
      if (!avatarUrl) return res;
      
      const FloatingButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
              ProfileModule.openProfileSheet(currentUser.id);
            }
          },
          style: {
            position: "absolute",
            bottom: 80,
            left: 10,
            zIndex: 9999,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#5865F2",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "red"
          },
          key: "floating-profile-button"
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: { width: 40, height: 40, borderRadius: 20 }
        })
      );
      
      if (Array.isArray(res.props.children)) {
        res.props.children.push(FloatingButton);
      } else {
        res.props.children = [res.props.children, FloatingButton];
      }
      return res;
    }));
    return true;
  }

  // On load, try to patch the chat input container first.
  exports.default = {
    onLoad: () => {
      setTimeout(() => {
        if (!patchChatInput()) {
          patchAppShell();
        }
      }, 3000);
    },
    onUnload: () => {
      unpatches.forEach(unp => unp());
    },
    settings: () => null
  };

  Object.defineProperty(exports, "__esModule", { value: true });
})(exports, bunny.api, bunny.metro, bunny.metro.common, vendetta.plugin, bunny.utils.lazy);
