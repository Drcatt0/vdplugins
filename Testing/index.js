(function (plugin, vendetta, metro) {
  "use strict";

  const { React } = metro.common;
  const UserStore = metro.findByProps("getCurrentUser");
  // Use the standard profile opener if available.
  const ProfileModule = metro.findByProps("openProfileSheet");

  let unpatches = [];

  // Helper: Get a user's avatar URL
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Helper: Open the user profile (using ProfileModule)
  function openUserProfile(userId) {
    if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
      ProfileModule.openProfileSheet(userId);
    }
  }

  // Strategy 1: Inject the avatar button into ChatInputActions
  function injectIntoChatInputActions() {
    const ChatInputActions = metro.findByName("ChatInputActions");
    if (!ChatInputActions) return false;

    const unp = vendetta.patcher.after("default", ChatInputActions, (_, res) => {
      if (!res || !res.props || !Array.isArray(res.props.children)) return res;

      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return res;
      const avatarUrl = getUserAvatarUrl(currentUser);
      if (!avatarUrl) return res;

      // Create the avatar button element
      const AvatarButton = React.createElement("img", {
        src: avatarUrl,
        style: {
          width: 32,
          height: 32,
          borderRadius: 16,
          marginRight: 8,
          cursor: "pointer",
        },
        onClick: () => openUserProfile(currentUser.id),
      });

      // Insert the avatar button at the beginning of the children array
      res.props.children.unshift(AvatarButton);
      return res;
    });
    unpatches.push(unp);
    return true;
  }

  // Strategy 2: Create a floating button on the app shell
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

      // Create a floating button element
      const floatingButton = React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            bottom: 80,
            left: 10,
            zIndex: 9999,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#5865F2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          },
          onClick: () => openUserProfile(currentUser.id),
        },
        React.createElement("img", {
          src: avatarUrl,
          style: {
            width: 40,
            height: 40,
            borderRadius: 20,
            objectFit: "cover",
          },
        })
      );

      // Append the floating button to the children
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
    // Delay to let components load
    setTimeout(() => {
      // Try to inject into the chat bar first
      if (!injectIntoChatInputActions()) {
        // Otherwise, create a floating button
        createFloatingButton();
      }
    }, 3000);
  };

  plugin.onUnload = function () {
    unpatches.forEach((u) => u());
  };
})(vendetta.plugin, vendetta, vendetta.metro);
