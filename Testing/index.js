(function (plugin, vendetta, metro) {
  "use strict";

  const { React } = metro.common;
  const { Image, View, TouchableOpacity } = metro.common.ReactNative;
  const UserStore = metro.findByProps("getCurrentUser");
  // Use the built‐in profile opener, if available.
  const ProfileModule = metro.findByProps("openProfileSheet");

  let unpatches = [];

  // Helper: Get a user's avatar URL
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Helper: Open the user's profile
  function openUserProfile(userId) {
    if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
      ProfileModule.openProfileSheet(userId);
    }
  }

  // Try multiple candidate names to find the chat input area
  function findChatInputComponent() {
    const candidates = [
      "ChatInputActions",
      "ChannelTextAreaButtons",
      "MessageInput",
      "ChatBar"
    ];
    for (const name of candidates) {
      const comp = metro.findByName(name);
      if (comp) return comp;
    }
    return null;
  }

  // Strategy 1: Patch the chat input area to inject the avatar button
  function injectIntoChatInput() {
    const ChatInputComponent = findChatInputComponent();
    if (!ChatInputComponent) return false;

    const unp = vendetta.patcher.after("default", ChatInputComponent, (_, res) => {
      if (!res || !res.props || !Array.isArray(res.props.children)) return res;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return res;
      const avatarUrl = getUserAvatarUrl(currentUser);
      if (!avatarUrl) return res;

      // Create the avatar button using React Native components
      const AvatarButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => openUserProfile(currentUser.id),
          style: { marginRight: 8 }
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: {
            width: 32,
            height: 32,
            borderRadius: 16
          }
        })
      );

      // Insert the avatar button at the beginning of the action buttons array
      res.props.children.unshift(AvatarButton);
      return res;
    });

    unpatches.push(unp);
    return true;
  }

  // Strategy 2: If patching the chat input fails, create a floating button
  function createFloatingButton() {
    // Try to find a root-level component (AppShell)
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

      // Create a floating button using React Native components
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
          style: {
            width: 40,
            height: 40,
            borderRadius: 20
          }
        })
      );

      // Append the floating button to the app shell's children
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
    // Delay the injection to let the UI load (try 3 seconds)
    setTimeout(() => {
      if (!injectIntoChatInput()) {
        createFloatingButton();
      }
    }, 3000);
  };

  plugin.onUnload = function () {
    unpatches.forEach((u) => u());
  };
})(vendetta.plugin, vendetta, vendetta.metro);
