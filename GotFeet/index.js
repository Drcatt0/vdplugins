(function(p, A, U, h, B, C, N, $) {
    "use strict";

    function botMessageHandler(e) {
        const { metro: { findByProps, findByStoreName, common: { lodash: { merge } } } } = e,
            sendMessageProps = findByProps("_sendMessage"),
            { createBotMessage } = findByProps("createBotMessage"),
            botAvatars = findByProps("BOT_AVATARS"),
            { getChannelId } = findByStoreName("SelectedChannelStore");

        return function(message, customizations) {
            if (!message.channelId) message.channelId = getChannelId();
            if (!message.channelId) throw new Error("No channel id provided");

            let finalMessage = message;
            if (message.really) {
                if (typeof customizations === "object") finalMessage = merge(finalMessage, customizations);
                const args = [finalMessage, {}];
                args[0].tts ??= false;
                return sendMessageProps._sendMessage(message.channelId, ...args);
            }

            if (customizations !== true) finalMessage = createBotMessage(finalMessage);
            if (typeof customizations === "object") {
                finalMessage = merge(finalMessage, customizations);
                if (typeof customizations.author === "object") {
                    const author = customizations.author;
                    if (typeof author.avatarURL === "string") {
                        botAvatars.BOT_AVATARS[author.avatar ?? author.avatarURL] = author.avatarURL;
                        author.avatar ??= author.avatarURL;
                        delete author.avatarURL;
                    }
                }
            }

            sendMessageProps.receiveMessage(finalMessage.channel_id, finalMessage);
            return finalMessage;
        };
    }

    const EMBED_COLOR = () => parseInt("0xFFFFFF"),
        authorDetails = {
            author: {
                username: "Feet",
                avatar: "command",
                avatarURL: "https://cdn.discordapp.com/embed/avatars/1.png" // Example avatar URL
            }
        };

    let sendMessage;
    function botSendMessage() {
        if (window.sendMessage) return window.sendMessage(...arguments);
        if (!sendMessage) sendMessage = botMessageHandler(vendetta);
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
                                ...authorDetails,
                                interaction: {
                                    name: "/hello",
                                    user: h.findByStoreName("UserStore").getCurrentUser(),
                                },
                            };
                            botSendMessage({
                                loggingName: "FeetBot output message",
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
                alert("There was an error while loading the FeetBot\n" + e.stack);
            }
        },
    };

    return plugin;
})({}, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
