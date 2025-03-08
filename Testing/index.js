(function (plugin, v, m) {
    "use strict";

    const { React } = v.metro.common;
    const ProfileModule = m.findByProps("openProfileSheet");
    const UserStore = m.findByProps("getCurrentUser");
    const ChatInputActions = m.findByName("ChatInputActions");

    let unpatch;

    function injectProfileButton() {
        unpatch = v.patcher.after("default", ChatInputActions, (_, res) => {
            if (!res || !res.props || !res.props.children) return res;

            const currentUser = UserStore.getCurrentUser();
            if (!currentUser) return res;

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
    }

    plugin.onLoad = function () {
        injectProfileButton();
    };

    plugin.onUnload = function () {
        if (unpatch) unpatch();
    };

})(vendetta.plugin, vendetta, vendetta.metro);
