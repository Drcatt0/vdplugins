(function (c, p, y, d, u, r, w, b) {
    "use strict";

    const { ScrollView: v } = u.General,
        { FormSection: f, FormSwitchRow: F } = u.Forms,
        g = d.findByProps("sendMessage"),
        Settings = r.storage;

    /**
     * Replace Twitter or X.com links with fxtwitter or vxtwitter.
     */
    function replaceTwitterLinks(content, type) {
        return content.replace(
            /https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/gim,
            `https://${type}.com`
        );
    }

    /**
     * Plugin settings page.
     */
    function SettingsPage() {
        return w.useProxy(Settings),
            React.createElement(v, null,
                React.createElement(f, { title: "Plugin Settings", titleStyleType: "no_border" }),
                React.createElement(F, {
                    label: "Use vxtwitter.com instead of fxtwitter.com",
                    subLabel: "Toggle between vxtwitter and fxtwitter for link replacement.",
                    value: Settings.getBoolean("_vxtwitter", false),
                    onValueChange: function (value) {
                        Settings.set("_vxtwitter", value);
                        Settings.set("_twitterType", value ? "vxtwitter" : "fxtwitter");
                        b.showToast({
                            content: `Switched to ${Settings.get("_twitterType", "fxtwitter")}.`,
                            duration: 2000,
                        });
                    },
                })
            );
    }

    /**
     * Patches for the plugin.
     */
    const Patcher = [];

    /**
     * Patch the `sendMessage` function to replace Twitter links.
     */
    function patchSendMessage() {
        const patch = g.before("sendMessage", function (_, args) {
            const content = args[1]?.content;
            if (!content) return;

            // Match Twitter/X.com links
            const twitterLinks = content.match(/https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/gim);
            if (!twitterLinks) return;

            const type = Settings.get("_twitterType", "fxtwitter");
            args[1].content = replaceTwitterLinks(content, type);
        });

        Patcher.push(patch);
    }

    return {
        onLoad() {
            try {
                if (!Settings.get("_twitterType", false)) {
                    Settings.set("_twitterType", "fxtwitter");
                }
                patchSendMessage();
            } catch (err) {
                console.error("[TwitterEmbed Error]", err);
            }
        },
        onUnload() {
            Patcher.forEach(unpatch => unpatch());
        },
        settings: SettingsPage,
    };
})({}, vendetta.commands, vendetta, vendetta.metro, vendetta.ui.components, vendetta.plugin, vendetta.storage, vendetta.ui.toasts);
