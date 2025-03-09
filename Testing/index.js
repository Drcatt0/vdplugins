(function (plugin, vendetta, metro) {
  "use strict";

  const { React } = metro.common;
  const { TouchableOpacity, Image } = metro.common.ReactNative;
  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");
  let unpatches = [];

  // Helper to construct the user's avatar URL
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Helper to open the profile (using the built-in profile sheet function)
  function openUserProfile(userId) {
    if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
      ProfileModule.openProfileSheet(userId);
    }
  }

  // Strategy 1: Patch the chat input container.
  // This tries to find a module by the props "onSend" and "onChangeText" (often present in the input container).
  function injectIntoChatInputContainer() {
    const ChatInputContainer = metro.findByProps("onSend", "onChangeText");
    if (!ChatInputContainer) return false;

    const unp = vendetta.patcher.after("default", ChatInputContainer, (_, res) => {
      if (!res || !res.props || !Array.isArray(res.props.children)) return res;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return res;
      const avatarUrl = getUserAvatarUrl(currentUser);
      if (!avatarUrl) return res;

      // Create an avatar button using TouchableOpacity and Image
      const AvatarButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => openUserProfile(currentUser.id),
          style: { marginRight: 8 }
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );

      // Insert the button at the beginning of the children array
      res.props.children.unshift(AvatarButton);
      return res;
    });
    unpatches.push(unp);
    return true;
  }

  // Strategy 2: Fallback – Create a floating button.
  // This patches the AppShell (or similar root component) to add a button at a fixed position.
  function createFloatingButton() {
    const AppShell =
      metro.findByProps("AppShell") ||
      metro.findByDisplayName("AppShell") ||
      metro.findByProps("renderRouteContainer");
    if (!AppShell) return false;

    const unp = vendetta.patcher.after("default", AppShell, (_, res) => {
      if (!res || !res.props) return res;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return res;
      const avatarUrl = getUserAvatarUrl(currentUser);
      if (!avatarUrl) return res;

      // Create a floating button
      const floatingButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => openUserProfile(currentUser.id),
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
    });
    unpatches.push(unp);
    return true;
  }

  plugin.onLoad = function () {
    // Wait a few seconds to allow UI components to load
    setTimeout(() => {
      if (!injectIntoChatInputContainer()) {
        createFloatingButton();
      }
    }, 3000);
  };

  plugin.onUnload = function () {
    unpatches.forEach((u) => u());
  };
})(vendetta.plugin, vendetta, vendetta.metro);
