(function (plugin, v, m) {
    "use strict";

    console.log("[Testing Plugin] Plugin loaded and running!");

    const { React } = v.metro.common;
    const ProfileModule = m.findByProps("openProfileSheet");
    const UserStore = m.findByProps("getCurrentUser");
    const ChatInputActions = m.findByName("ChatInputActions");

    let unpatch;

    function injectProfileButton() {
        console.log("[Testing Plugin] Attempting to inject profile button...");

        if (!ChatInputActions) {
            console.error("[Testing Plugin] ChatInputActions component not found!");
            return;
        }

        unpatch = v.patcher.after("default", ChatInputActions, (_, res) => {
            console.log("[Testing Plugin] ChatInputActions found, modifying...");

            if (!res || !res.props || !res.props.children) {
                console.error("[Testing Plugin] ChatInputActions has no children!");
                return res;
            }

            const currentUser = UserStore.getCurrentUser();
            if (!currentUser) {
                console.error("[Testing Plugin] Unable to get current user!");
                return res;
            }

            console.log("[Testing Plugin] Injecting avatar button...");

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
            console.log("[Testing Plugin] Profile button added!");
            return res;
        });

        console.log("[Testing Plugin] Injection complete.");
    }

    plugin.onLoad = function () {
        console.log("[Testing Plugin] Plugin onLoad triggered!");
        injectProfileButton();
    };

    plugin.onUnload = function () {
        console.log("[Testing Plugin] Plugin onUnload triggered!");
        if (unpatch) unpatch();
    };

})(vendetta.plugin, vendetta, vendetta.metro);
