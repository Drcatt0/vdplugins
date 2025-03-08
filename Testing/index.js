(function (plugin, v, m) {
    "use strict";

    const { React } = v.metro.common;
    const ProfileModule = m.findByProps("openProfileSheet");
    const UserStore = m.findByProps("getCurrentUser");
    const ChatInputActions = m.findByName("ChatInputActions");

    let unpatch;

    function injectProfileButton() {
        console.log("[ProfileButton] Injecting into ChatInputActions...");
        
        if (!ChatInputActions) {
            console.error("[ProfileButton] ChatInputActions not found!");
            return;
        }

        unpatch = v.patcher.after("default", ChatInputActions, (_, res) => {
            if (!res || !res.props || !res.props.children) {
                console.error("[ProfileButton] ChatInputActions has no children!");
                return res;
            }

            const currentUser = UserStore.getCurrentUser();
            if (!currentUser) {
                console.error("[ProfileButton] Unable to get current user!");
                return res;
            }

            console.log("[ProfileButton] Adding avatar button...");

            const avatarUrl = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png?size=32`;

            // Create the avatar button
            const AvatarButton = React.createElement(
                "img",
                {
                    src: avatarUrl,
                    style: {
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        marginRight: 8,
                        cursor: "pointer",
                    },
                    onClick: () => ProfileModule.openProfileSheet(currentUser.id),
                }
            );

            // Inject the button at the **start** of the action buttons
            res.props.children.unshift(AvatarButton);
            return res;
        });

        console.log("[ProfileButton] Injection complete.");
    }

    plugin.onLoad = function () {
        injectProfileButton();
    };

    plugin.onUnload = function () {
        if (unpatch) unpatch();
    };

})(vendetta.plugin, vendetta, vendetta.metro);
