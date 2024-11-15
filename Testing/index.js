(function (c, p, y, d, u, r, w, b) {
    "use strict";

    const { ScrollView: v } = u.General,
        { FormSection: f, FormRadioRow: _, FormSwitchRow: F, FormIcon: S } = u.Forms,
        g = d.findByProps("sendMessage"),
        Settings = r.storage;

    function replaceTwitterLinks(content, type) {
        return content.replace(/http(s)?:\/\/(www\.)?(twitter\.com|x\.com)/gim, `https://${type}.com`);
    }

    function SettingsPage() {
        return w.useProxy(Settings),
            React.createElement(v, null,
                React.createElement(f, { title: "Plugin Settings", titleStyleType: "no_border" }),
                React.createElement(F, {
                    label: "Use vxtwitter.com instead of fxtwitter.com",
                    subLabel: "Switch between vxtwitter and fxtwitter.",
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

    const Patcher = [];

    function patchSendMessage() {
        const patch = g.before("sendMessage", function (_, args) {
            const content = args[1]?.content;
            if (!content) return;

            const twitterLinks = content.match(/http(s)?:\/\/(www\.)?(twitter\.com|x\.com)\/\w{4,15}\/status\/\d+/gim);
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
