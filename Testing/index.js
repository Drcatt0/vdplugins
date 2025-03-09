(function(plugin, vendetta, metro, common) {
  "use strict";

  const { React } = metro.common;
  const { TouchableOpacity, Image } = metro.common.ReactNative;
  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");
  let unpatches = [];

  // Helper: Build Discord avatar URL.
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Try to inject our profile button into a component by its name.
  function injectProfileButtonInto(componentName) {
    const comp = metro.findByName(componentName);
    if (!comp || !comp.type) return false;
    let unp = vendetta.patcher.after("render", comp.type, (_, res) => {
      if (!res || !res.props || !Array.isArray(res.props.children)) return res;
      const currentUser = UserStore.getCurrentUser();
      if (!currentUser) return res;
      const avatarUrl = getUserAvatarUrl(currentUser, 40);
      if (!avatarUrl) return res;
      // Create a profile button using TouchableOpacity and Image.
      const ProfileButton = React.createElement(
        TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule && typeof ProfileModule.openProfileSheet === "function") {
              ProfileModule.openProfileSheet(currentUser.id);
            }
          },
          style: { marginRight: 8 }
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );
      // Only inject if not already present.
      if (!res.props.children.some(child => child && child.key === "profile-button")) {
        res.props.children.unshift(React.cloneElement(ProfileButton, { key: "profile-button" }));
      }
      return res;
    });
    unpatches.push(unp);
    return true;
  }

  // Try several candidate component names in case one of them is the chat input.
  function tryInjectIntoCandidates() {
    const candidateNames = ["ChatInputActions", "ChannelTextAreaButtons", "MessageInput", "ChatInputContainer"];
    let injected = false;
    candidateNames.forEach(name => {
      if (injectProfileButtonInto(name)) {
        injected = true;
      }
    });
    return injected;
  }

  // Fallback: Patch the app shell to add a floating button.
  function injectFloatingButton() {
    const AppShell =
      metro.findByProps("AppShell") ||
      metro.findByDisplayName("AppShell") ||
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
        // Create a floating button.
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

  plugin.onLoad = function() {
    // Wait a few seconds to ensure the UI has loaded.
    setTimeout(() => {
      if (!tryInjectIntoCandidates()) {
        injectFloatingButton();
      }
    }, 3000);
  };

  plugin.onUnload = function() {
    unpatches.forEach(unp => unp());
  };

})(vendetta.plugin, vendetta, vendetta.metro, vendetta.metro.common);
