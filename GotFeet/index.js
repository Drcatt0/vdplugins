(function (p, A, U, h, B, C, N, $) {
    "use strict";

    function createSendMessageFunction(e) {
        const { metro: { findByProps, findByStoreName, common: { lodash: { merge } } } } = e;
        const { _sendMessage } = findByProps("_sendMessage");
        const { createBotMessage } = findByProps("createBotMessage");
        const { BOT_AVATARS } = findByProps("BOT_AVATARS");
        const { getChannelId } = findByStoreName("SelectedChannelStore");

        return function (msg, options) {
            if (!msg.channelId) msg.channelId = getChannelId();
            if (!msg.channelId) throw new Error("No channel id to receive the message into (channelId)");

            let message = msg;

            if (msg.really) {
                if (typeof options === "object") message = merge(message, options);
                const args = [message, {}];
                args[0].tts = args[0].tts || false;

                return _sendMessage(message.channelId, ...args);
            }

            if (options !== true) message = createBotMessage(message);
            _sendMessage.receiveMessage(message.channel_id, message);
            return message;
        };
    }

    const EMBED_COLOR = () => parseInt("0xFF4500", 16); // Set to Reddit orange
    const authorMods = {
        author: {
            username: "FeetBot",
            avatar: "command",
            avatarURL: "https://cdn.discordapp.com/embed/avatars/0.png" // Change URL as needed
        },
    };

    let sendMessage;
    function botSendMessage() {
        if (window.sendMessage) return window.sendMessage(...arguments);
        if (!sendMessage) sendMessage = createSendMessageFunction(vendetta);
        return sendMessage(...arguments);
    }

    var plugin = {
        meta: vendetta.plugin,
        patches: [],
        onUnload() {
            this.patches.forEach((unpatch) => unpatch());
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
                                        description: "This is a test message from FeetBot.",
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
                alert("There was an error while loading FeetBot\n" + e.stack);
            }
        },
    };

    return plugin;
})({}, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
