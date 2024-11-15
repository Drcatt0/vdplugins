(function (p, A, U, h, B, C, N, $) {
    "use strict";

    function botMessageHandler(e) {
        const { metro: { findByProps, findByStoreName, common: { lodash: { merge } } } } = e,
            sendMessageProps = findByProps("_sendMessage"),
            { createBotMessage } = findByProps("createBotMessage"),
            botAvatars = findByProps("BOT_AVATARS"),
            { getChannelId } = findByStoreName("SelectedChannelStore");

        return function (message, customizations) {
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
                avatarURL: "https://cdn.discordapp.com/embed/avatars/1.png"
            }
        };

    let sendMessage;
    function botSendMessage() {
        if (window.sendMessage) return window.sendMessage(...arguments);
        if (!sendMessage) sendMessage = botMessageHandler(vendetta);
        return sendMessage(...arguments);
    }

    async function fetchRandomRedditImage() {
        try {
            const subreddits = ["feet", "feetishh", "feetinyourface", "feetqueens", "feettoesandsocks"];
            const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
            const data = await response.json();
            const posts = data.data.children;
            const imagePosts = posts.filter(post => post.data.post_hint === "image");

            if (imagePosts.length > 0) {
                const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
                return {
                    title: `Random post from r/${subreddit}`,
                    url: randomPost.data.url,
                    description: randomPost.data.title,
                    image: randomPost.data.url
                };
            } else {
                return { error: `No images found in r/${subreddit}.` };
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            return { error: "Failed to retrieve image." };
        }
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
                const gotFeetCommand = {
                    async get(args, ctx) {
                        try {
                            const messageMods = {
                                ...authorDetails,
                                interaction: {
                                    name: "/gotfeet",
                                    user: h.findByStoreName("UserStore").getCurrentUser(),
                                },
                            };

                            const redditData = await fetchRandomRedditImage();

                            if (redditData.error) {
                                botSendMessage({
                                    loggingName: "FeetBot error message",
                                    channelId: ctx.channel.id,
                                    content: redditData.error
                                }, messageMods);
                            } else {
                                botSendMessage({
                                    loggingName: "FeetBot output message",
                                    channelId: ctx.channel.id,
                                    embeds: [
                                        {
                                            color: EMBED_COLOR(),
                                            type: "rich",
                                            title: redditData.title,
                                            description: redditData.description,
                                            image: { url: redditData.image },
                                            url: redditData.url
                                        },
                                    ],
                                }, messageMods);
                            }
                        } catch (e) {
                            console.error(e);
                            alert("There was an error while executing /gotfeet\n" + e.stack);
                        }
                    },
                };

                // Register the /gotfeet command
                this.patches.push(U.registerCommand({
                    type: 1,
                    inputType: 1,
                    applicationId: "-1",
                    execute: gotFeetCommand.get,
                    name: "gotfeet",
                    description: "Fetches a random post from selected subreddits.",
                }));
            } catch (e) {
                console.error(e);
                alert("There was an error while loading the FeetBot\n" + e.stack);
            }
        },
    };

    return plugin;
})({}, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
