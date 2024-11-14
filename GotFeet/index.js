(function (p, A, U, h, B, C, N, $) {
    "use strict";

    function b(e) {
        const { metro: { findByProps: c, findByStoreName: a, common: { lodash: { merge: o } } } } = e,
            n = c("_sendMessage"),
            { createBotMessage: t } = c("createBotMessage"),
            r = c("BOT_AVATARS"),
            { getChannelId: u } = a("SelectedChannelStore");
        return function (l, s) {
            if (l.channelId ??= u(), [null, void 0].includes(l.channelId))
                throw new Error("No channel id to receive the message into (channelId)");
            let d = l;
            if (l.really) {
                typeof s == "object" && (d = o(d, s));
                const i = [d, {}];
                i[0].tts ??= !1;
                return n._sendMessage(l.channelId, ...i);
            }
            return s !== !0 && (d = t(d)), n.receiveMessage(d.channel_id, d), d;
        };
    }

    const EMBED_COLOR = () => parseInt("0xFFFFFF"), // Set a color for the embed
        authorMods = {
            author: {
                username: "HelloBot",
                avatar: "command",
                avatarURL: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
        };

    let sendMessage;
    function botSendMessage() {
        if (window.sendMessage) return window.sendMessage?.(...arguments);
        if (!sendMessage) sendMessage = b(vendetta);
        return sendMessage(...arguments);
    }

    var plugin = {
        meta: vendetta.plugin,
        patches: [],
        onUnload() {
            this.patches.forEach((up) => up());
            this.patches = [];
        },
        onLoad() {
            try {
                const helloCommand = {
                    get(args, ctx) {
                        try {
                            const messageMods = {
                                ...authorMods,
                                interaction: {
                                    name: "/hello",
                                    user: h.findByStoreName("UserStore").getCurrentUser(),
                                },
                            };
                            botSendMessage({
                                loggingName: "Hello output message",
                                channelId: ctx.channel.id,
                                embeds: [
                                    {
                                        color: EMBED_COLOR(),
                                        type: "rich",
                                        title: "Hello World!",
                                        description: "This is a test message from the bot.",
                                    },
                                ],
                            }, messageMods);
                        } catch (e) {
                            console.error(e);
                            alert("There was an error while executing /hello\n" + e.stack);
                        }
                    },
                };

                // Register the /hello command
                this.patches.push(U.registerCommand({
                    type: 1,
                    inputType: 1,
                    applicationId: "-1",
                    execute: helloCommand.get,
                    name: "hello",
                    description: "Sends a Hello World message",
                }));
            } catch (e) {
                console.error(e);
                alert("There was an error while loading the HelloBot\n" + e.stack);
            }
        },
    };

    return plugin;
})({}, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
