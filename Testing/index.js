(function (plugin, vendetta, metro, common) {
  "use strict";

  const { React } = metro.common;
  const { TouchableOpacity, Image } = metro.common.ReactNative;
  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");
  let unpatches = [];

  // Helper: Get the Discord avatar URL
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Strategy 1: Patch a chat input component to inject our profile button.
  function patchChatInput() {
    // Try common candidate names for the chat button container.
    const ChatInputActions =
      metro.findByName("ChatInputActions") ||
      metro.findByName("ChannelTextAreaButtons");
    if (!ChatInputActions || !ChatInputActions.type) return false;

    let unp = vendetta.patcher.before("render", ChatInputActions.type, ([props]) => {
      if (!props || !Array.isArray(props.children)) return;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return;
      const avatarUrl = getUserAvatarUrl(currentUser, 40);
      if (!avatarUrl) return;

      // Create a profile button using React Native components.
      const ProfileButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
              ProfileModule.openProfileSheet(currentUser.id);
            }
          },
          style: { marginRight: 8 },
          key: "profile-button"
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );

      // Inject the profile button at the beginning if it’s not already there.
      if (!props.children.some(child => child && child.key === "profile-button")) {
        props.children.unshift(ProfileButton);
      }
    });
    unpatches.push(unp);
    return true;
  }

  // Strategy 2: If no chat input was found, patch the AppShell to add a floating button.
  function patchAppShell() {
    const AppShell =
      metro.findByProps("AppShell") ||
      metro.findByName("AppShell") ||
      metro.findByProps("renderRouteContainer");
    if (!AppShell) return false;
    let unp = vendetta.patcher.after(
      "render",
      AppShell.default ? AppShell.default : AppShell,
      (_, res) => {
        if (!res || !res.props) return res;
        const currentUser = UserStore.getCurrentUser();
        if (!currentUser) return res;
        const avatarUrl = getUserAvatarUrl(currentUser, 40);
        if (!avatarUrl) return res;

        // Create a floating profile button.
        const floatingButton = React.createElement(
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
              alignItems: "center"
            }
          },
          React.createElement(Image, {
            source: { uri: avatarUrl },
            style: { width: 40, height: 40, borderRadius: 20 }
          })
        );

        if (Array.isArray(res.props.children)) {
          res.props.children.push(floatingButton);
        } else {
          res.props.children = [res.props.children, floatingButton];
        }
        return res;
      }
    );
    unpatches.push(unp);
    return true;
  }

  plugin.onLoad = () => {
    // Delay injection to allow the UI to load.
    setTimeout(() => {
      if (!patchChatInput()) {
        patchAppShell();
      }
    }, 3000);
  };

  plugin.onUnload = () => {
    unpatches.forEach(unp => unp());
  };
})(vendetta.plugin, vendetta, vendetta.metro, vendetta.metro.common);
