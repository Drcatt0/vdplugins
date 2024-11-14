(function(p, A, U, h, B, C, N, $) {
    "use strict";

    function b(e) {
        const { metro: { findByProps: c, findByStoreName: a, common: { lodash: { merge: o } } } } = e,
            n = c("_sendMessage"),
            { createBotMessage: t } = c("createBotMessage"),
            r = c("BOT_AVATARS"),
            { getChannelId: u } = a("SelectedChannelStore");
        return function(l, s) {
            if (l.channelId ??= u(), [null, void 0].includes(l.channelId)) throw new Error("No channel id to receive the message into (channelId)");
            let d = l;
            if (l.really) {
                typeof s == "object" && (d = o(d, s));
                const i = [d, {}];
                i[0].tts ??= !1;
                for (const m of ["allowedMentions", "messageReference"]) m in i[0] && (i[1][m] = i[0][m], delete i[0][m]);
                const k = "overwriteSendMessageArg2";
                return k in i[0] && (i[1] = i[0][k], delete i[0][k]), n._sendMessage(l.channelId, ...i);
            }
            return s !== !0 && (d = t(d)), typeof s == "object" && (d = o(d, s), typeof s.author == "object" && function() {
                const i = s.author;
                typeof i.avatarURL == "string" && (r.BOT_AVATARS[i.avatar ?? i.avatarURL] = i.avatarURL, i.avatar ??= i.avatarURL, delete i.avatarURL);
            }()), n.receiveMessage(d.channel_id, d), d;
        };
    }

    const { sendBotMessage: _ } = h.findByProps("sendBotMessage");
    const EMBED_COLOR = () => parseInt("FF4500", 16); // Reddit-themed orange
    const authorMods = {
        author: {
            username: "RedditFetcher",
            avatar: "command",
            avatarURL: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png",
        },
    };

    let y;
    function sendMessage() {
        return window.sendMessage ? window.sendMessage?.(...arguments) : (y || (y = b(vendetta)), y(...arguments));
    }

    const L = function() {
        $.registerCommand({
            name: "gotfeet",
            displayName: "gotfeet",
            description: "Fetches a random post from selected subreddits.",
            displayDescription: "Fetches a random post from selected subreddits.",
            type: 1,
            inputType: 1,
            applicationId: "-1",
            async execute(args, ctx) {
                try {
                    const subreddits = ["feet", "feetishh", "feetinyourface", "feetqueens", "feettoesandsocks"];
                    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
                    const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
                    const data = await response.json();
                    const posts = data.data.children;
                    const imagePosts = posts.filter(post => post.data.post_hint === "image");

                    if (imagePosts.length > 0) {
                        const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
                        const { title, url, author } = randomPost.data;

                        sendMessage({
                            loggingName: "RedditFetcher",
                            channelId: ctx.channel.id,
                            embeds: [{
                                color: EMBED_COLOR(),
                                type: "rich",
                                title: title || "Random post from r/" + subreddit,
                                url: `https://reddit.com${randomPost.data.permalink}`,
                                description: `From [r/${subreddit}](https://reddit.com/r/${subreddit}) by u/${author}`,
                                image: { url: url }
                            }]
                        }, authorMods);
                    } else {
                        sendMessage({ content: `No images found in r/${subreddit}.` });
                    }
                } catch (error) {
                    console.error("Error fetching image:", error);
                    sendMessage({ content: "Failed to retrieve image." });
                }
            }
        });
    };

    const O = function() {
        for (const e of A) e();
    };

    return f.onLoad = L, f.onUnload = O, f;
})({}, vendetta.commands, vendetta.metro, vendetta.metro.common);
