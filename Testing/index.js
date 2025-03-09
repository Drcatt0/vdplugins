(function (plugin, vendetta, metro, common) {
  "use strict";

  const { React } = common;
  const { TouchableOpacity, Image } = common.ReactNative;
  const UserStore = metro.findByProps("getCurrentUser");
  const ProfileModule = metro.findByProps("openProfileSheet");
  let unpatches = [];

  // Helper: Build the Discord avatar URL.
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Try patching a module by its name.
  function patchCandidate(moduleName) {
    const mod = metro.findByName(moduleName);
    if (!mod || !mod.type) return false;
    const unp = vendetta.patcher.before("render", mod.type, ([props]) => {
      if (!props || !Array.isArray(props.children)) return;
      const user = UserStore.getCurrentUser();
      if (!user) return;
      const avatarUrl = getUserAvatarUrl(user, 40);
      if (!avatarUrl) return;
      // Create the profile button with a red border (for debugging).
      const button = React.createElement(
        TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule && typeof ProfileModule.openProfileSheet === "function")
              ProfileModule.openProfileSheet(user.id);
          },
          style: { marginRight: 8, borderWidth: 2, borderColor: "red" },
          key: "profile-button"
        },
        React.createElement(Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );
      // Only add if not already present.
      if (!props.children.some(child => child && child.key === "profile-button")) {
        props.children.unshift(button);
      }
    });
    unpatches.push(unp);
    return true;
  }

  // Try common candidate names for the chat input container.
  function patchChatBar() {
    const candidates = ["ChatInputActions", "ChannelTextAreaButtons"];
    let patched = false;
    for (const name of candidates) {
      if (patchCandidate(name)) {
        patched = true;
      }
    }
    return patched;
  }

  // Fallback: Patch the AppShell to add a floating button.
  function patchAppShell() {
    const AppShell =
      metro.findByProps("AppShell") ||
      metro.findByName("AppShell") ||
      metro.findByProps("renderRouteContainer");
    if (!AppShell) return false;
    const unp = vendetta.patcher.after(
      "render",
      AppShell.default ? AppShell.default : AppShell,
      (_, res) => {
        if (!res || !res.props) return res;
        const user = UserStore.getCurrentUser();
        if (!user) return res;
        const avatarUrl = getUserAvatarUrl(user, 40);
        if (!avatarUrl) return res;
        const floatButton = React.createElement(
          TouchableOpacity,
          {
            onPress: () => {
              if (ProfileModule && typeof ProfileModule.openProfileSheet === "function")
                ProfileModule.openProfileSheet(user.id);
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
            key: "float-profile-button"
          },
          React.createElement(Image, {
            source: { uri: avatarUrl },
            style: { width: 40, height: 40, borderRadius: 20 }
          })
        );
        if (Array.isArray(res.props.children)) {
          res.props.children.push(floatButton);
        } else {
          res.props.children = [res.props.children, floatButton];
        }
        return res;
      }
    );
    unpatches.push(unp);
    return true;
  }

  plugin.onLoad = () => {
    // Delay patching to allow the UI to load.
    setTimeout(() => {
      if (!patchChatBar()) {
        patchAppShell();
      }
    }, 3000);
  };

  plugin.onUnload = () => {
    unpatches.forEach(unp => unp());
  };
})(vendetta.plugin, vendetta, vendetta.metro, vendetta.metro.common);
