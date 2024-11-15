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
                username: "FeetBot",
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
                const gotFeetCommand = {
                    async get(args, ctx) {
                        try {
                            const subreddits = ["feet", "feetishh", "feetinyourface", "feetqueens", "feettoesandsocks"];
                            const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
                            const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
                            const data = await response.json();
                            const posts = data.data.children;
                            const imagePosts = posts.filter(post => post.data.post_hint === "image");

                            if (imagePosts.length > 0) {
                                const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
                                const imageUrl = randomPost.data.url;
                                const postTitle = randomPost.data.title;
                                const postUrl = `https://reddit.com${randomPost.data.permalink}`;

                                botSendMessage({
                                    loggingName: "FeetBot post",
                                    channelId: ctx.channel.id,
                                    embeds: [
                                        {
                                            color: EMBED_COLOR(),
                                            type: "rich",
                                            title: `Random post from r/${subreddit}`,
                                            description: postTitle,
                                            url: postUrl,
                                            thumbnail: { // Use thumbnail instead of image
                                                url: imageUrl
                                            },
                                            footer: {
                                                text: "Direct Link to Image",
                                                icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
                                            }
                                        }
                                    ],
                                }, authorMods);
                            } else {
                                botSendMessage({
                                    loggingName: "FeetBot no images",
                                    channelId: ctx.channel.id,
                                    content: `No images found in r/${subreddit}.`,
                                }, authorMods);
                            }
                        } catch (error) {
                            console.error("Error fetching image:", error);
                            botSendMessage({
                                loggingName: "FeetBot error",
                                channelId: ctx.channel.id,
                                content: "Failed to retrieve image.",
                            }, authorMods);
                        }
                    }
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
                alert("There was an error while loading FeetBot\n" + e.stack);
            }
        },
    };

    return plugin;
})({}, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
