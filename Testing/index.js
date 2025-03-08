(function (plugin, v, m) {
    "use strict";

    const { React } = v.metro.common;
    const ProfileModule = m.findByProps("openProfileSheet");
    const UserStore = m.findByProps("getCurrentUser");
   const ChatInputActions = m.findByName("ChannelTextAreaButtons");
 // The component we are injecting into

    let unpatch;

    function injectDebugText() {
        if (!ChatInputActions) {
            return;
        }

        unpatch = v.patcher.after("default", ChatInputActions, (_, res) => {
            if (!res || !res.props || !res.props.children) {
                return res;
            }

            // Create a debug message
            const DebugText = React.createElement(
                "div",
                {
                    style: {
                        color: "red",
                        fontSize: 16,
                        fontWeight: "bold",
                        padding: 4,
                    }
                },
                "Hello from Debug!"
            );

            // Inject the debug message into the chat bar
            res.props.children.unshift(DebugText);
            return res;
        });
    }

    plugin.onLoad = function () {
        injectDebugText();
    };

    plugin.onUnload = function () {
        if (unpatch) unpatch();
    };

})(vendetta.plugin, vendetta, vendetta.metro);
