(function (plugin, vendetta, metro, common) {
  "use strict";
  
  const { React } = common;
  const { View, Text } = common.ReactNative;
  const unpatches = [];
  
  // We'll try patching a likely candidate component.
  // First, try to locate "ChatInput" (often present as the text input container).
  const ChatInput = metro.findByName("ChatInput");
  
  if (ChatInput && ChatInput.type) {
    unpatches.push(vendetta.patcher.before("render", ChatInput.type, ([props]) => {
      if (!props || !props.children || !Array.isArray(props.children)) return;
      
      // Create a big red box with "TEST" text for debugging.
      const TestBox = React.createElement(
        View,
        {
          style: {
            width: 100,
            height: 100,
            backgroundColor: "red",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999,
            justifyContent: "center",
            alignItems: "center"
          },
          key: "test-box"
        },
        React.createElement(Text, { style: { color: "white", fontSize: 20 } }, "TEST")
      );
      
      // Insert the test box at the start of the children array.
      props.children.unshift(TestBox);
    }));
  } else {
    // Fallback: patch the AppShell if ChatInput isn't found.
    const AppShell =
      metro.findByProps("AppShell") ||
      metro.findByName("AppShell") ||
      metro.findByProps("renderRouteContainer");
    if (AppShell) {
      unpatches.push(vendetta.patcher.after("render", AppShell.default ? AppShell.default : AppShell, (_, res) => {
        if (!res || !res.props) return res;
        const TestBox = React.createElement(
          View,
          {
            style: {
              width: 100,
              height: 100,
              backgroundColor: "red",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 9999,
              justifyContent: "center",
              alignItems: "center"
            },
            key: "test-box"
          },
          React.createElement(Text, { style: { color: "white", fontSize: 20 } }, "TEST")
        );
        if (Array.isArray(res.props.children)) {
          res.props.children.unshift(TestBox);
        } else {
          res.props.children = [TestBox];
        }
        return res;
      }));
    }
  }
  
  plugin.onLoad = () => {
    console.log("[Debug Plugin] Loaded.");
  };
  
  plugin.onUnload = () => {
    unpatches.forEach(u => u());
    console.log("[Debug Plugin] Unloaded.");
  };
})(vendetta.plugin, vendetta, vendetta.metro, vendetta.metro.common);
