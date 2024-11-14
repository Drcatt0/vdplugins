(function(p, A, U, h, B, C, N, $) {
    "use strict";

    function sendMessageWrapper(e) {
        const { metro: { findByProps, findByStoreName, common: { lodash: { merge } } } } = e;
        const { _sendMessage } = findByProps("_sendMessage");
        const { createBotMessage } = findByProps("createBotMessage");
        const { BOT_AVATARS } = findByProps("BOT_AVATARS");
        const { getChannelId } = findByStoreName("SelectedChannelStore");

        return function(message, options) {
            if (!message.channelId) message.channelId = getChannelId();
            if (!message.channelId) throw new Error("No channel id to receive the message into (channelId)");

            let msg = message;

            if (message.really) {
                if (typeof options === "object") msg = merge(msg, options);
                const args = [msg, {}];
                args[0].tts = args[0].tts || false;

                for (const key of ["allowedMentions", "messageReference"]) {
                    if (key in args[0]) {
                        args[1][key] = args[0][key];
                        delete args[0][key];
                    }
                }
                
                const overwriteKey = "overwriteSendMessageArg2";
                if (overwriteKey in args[0]) {
                    args[1] = args[0][overwriteKey];
                    delete args[0][overwriteKey];
                }
                
                return _sendMessage(message.channelId, ...args);
            }

            if (options !== true) msg = createBotMessage(msg);

            if (typeof options === "object") {
                msg = merge(msg, options);

                if (typeof options.author === "object") {
                    const author = options.author;
                    if (typeof author.avatarURL === "string") {
                        BOT_AVATARS[author.avatar || author.avatarURL] = author.avatarURL;
                        author.avatar = author.avatar || author.avatarURL;
                        delete author.avatarURL;
                    }
                }
            }

            _sendMessage.receiveMessage(msg.channel_id, msg);
            return msg;
        };
    }

    const EMBED_COLOR = 0xFF4500; // Reddit orange color
    const authorMods = {
        author: {
            username: "RedditFetcher",
            avatar: "command",
            avatarURL: "https://www.redditinc.com/assets/images/site/reddit-logo.png"
        }
    };

    let sendMessage;
    function initializeSendMessage() {
        if (window.sendMessage) return window.sendMessage(...arguments);
        if (!sendMessage) sendMessage = sendMessageWrapper(vendetta);
        return sendMessage(...arguments);
    }

    function sendRedditEmbed(ctx, title, subreddit, author, imageUrl) {
        initializeSendMessage({
            loggingName: "Reddit image fetch",
            channelId: ctx.channel.id,
            embeds: [{
                color: EMBED_COLOR,
                type: "rich",
                title: title || `Random post from r/${subreddit}`,
                url: `https://reddit.com/r/${subreddit}`,
                description: `From r/${subreddit} by u/${author}`,
                image: { url: imageUrl },
                footer: { text: "Fetched by RedditFetcher" }
            }]
        }, authorMods);
    }

    const commandList = [];
    const loadCommand = function() {
        commandList.push($.registerCommand({
            name: "gotfeet",
            displayName: "gotfeet",
            description: "Fetches a random post from selected subreddits.",
            type: 1,
            inputType: 1,
            applicationId: "-1",
            async execute(_, ctx) {
                try {
                    const subreddits = ["feet", "feetishh", "feetinyourface", "feetqueens", "feettoesandsocks"];
                    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
                    const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
                    const data = await response.json();

                    const imagePosts = data.data.children.filter(post => post.data.post_hint === "image");
                    if (imagePosts.length > 0) {
                        const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
                        const { title, url, author } = randomPost.data;

                        sendRedditEmbed(ctx, title, subreddit, author, url);
                    } else {
                        initializeSendMessage({ content: `No images found in r/${subreddit}.` }, authorMods);
                    }
                } catch (error) {
                    console.error("Error fetching image:", error);
                    initializeSendMessage({ content: "Failed to retrieve image." }, authorMods);
                }
            }
        }));
    };

    p.onLoad = loadCommand;
    p.onUnload = () => { /* No specific unload actions necessary */ };

})(vendetta.plugin, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
