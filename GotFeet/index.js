(function (c, p, y, d, u, r, w, b) {
    "use strict";

    const g = d.findByProps("sendMessage", "receiveMessage"),
        A = d.findByProps("getLastSelectedChannelId"),
        N = d.findByProps("createBotMessage"),
        $ = d.findByProps("BOT_AVATARS");

    function sendEmbedMessage(channelId, content, embeds) {
        const a = channelId ?? A?.getChannelId?.();
        const botMessage = N.createBotMessage({ channelId: a, content: "", embeds: embeds });
        
        botMessage.author.username = "FeetBot";
        botMessage.author.avatar = "FeetBot";
        $.BOT_AVATARS.FeetBot = "https://cdn.discordapp.com/embed/avatars/0.png";  // Use an avatar URL for FeetBot

        if (typeof content === "string") {
            botMessage.content = content;
        } else {
            Object.assign(botMessage, content);
        }

        g.receiveMessage(a, botMessage);
    }

    let commands = [];

    commands.push(p.registerCommand({
        name: "gotfeet",
        displayName: "gotfeet",
        description: "Fetches a random post from selected subreddits.",
        displayDescription: "Fetches a random post from selected subreddits.",
        options: [],
        applicationId: "-1",
        inputType: 1,
        type: 1,
        execute: async function (args, ctx) {
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
                    const authorName = `u/${randomPost.data.author} • r/${subreddit}`;
                    const authorIcon = `https://www.reddit.com/user/${randomPost.data.author}/about.json`.replace(/[^a-zA-Z0-9]+/g, '_'); // Placeholder for author icon

                    sendEmbedMessage(ctx.channel.id, "", [
                        {
                            type: "rich",
                            title: `Random post from r/${subreddit}`,
                            description: postTitle,
                            url: postUrl,
                            author: {
                                name: authorName,
                                icon_url: authorIcon,
                            },
                            image: {
                                url: imageUrl,
                            },
                            color: 0xf4b8e4,
                        }
                    ]);
                } else {
                    sendEmbedMessage(ctx.channel.id, "No images found in r/" + subreddit + ".", []);
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                sendEmbedMessage(ctx.channel.id, "Failed to retrieve image.", []);
            }
        }
    }));

    return {
        onLoad() {
            commands.forEach(cmd => cmd());
        },
        onUnload() {
            commands.forEach(cmd => cmd());
        }
    };
})(vendetta.commands, vendetta, vendetta, vendetta.metro, vendetta.ui.components, vendetta.plugin, vendetta.storage, vendetta.ui.assets);
