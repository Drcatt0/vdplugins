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
        $.BOT_AVATARS.FeetBot = "https://cdn.discordapp.com/embed/avatars/0.png"; // FeetBot's avatar URL

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
        description: "Fetches a random post from r/feet.",
        displayDescription: "Fetches a random post from r/feet.",
        options: [
            {
                name: "sort",
                displayName: "sort",
                description: "Changes the way Reddit sorts.",
                displayDescription: "Changes the way Reddit sorts",
                required: false,
                type: 3,
            },
            {
                name: "silent",
                displayName: "silent",
                description: "Makes it so only you can see the message.",
                displayDescription: "Makes it so only you can see the message.",
                required: false,
                type: 5,
            }
        ],
        applicationId: "-1",
        inputType: 1,
        type: 1,
        execute: async function (args, ctx) {
            try {
                const sort = args.find(o => o.name === "sort")?.value ?? r.storage.sortdefs;
                const silent = args.find(o => o.name === "silent")?.value;

                if (!["best", "hot", "new", "rising", "top", "controversial"].includes(sort)) {
                    sendEmbedMessage(ctx.channel.id, "Incorrect sorting type. Valid options are `best`, `hot`, `new`, `rising`, `top`, `controversial`.", []);
                    return;
                }

                let response = await fetch(`https://www.reddit.com/r/feet/${sort}.json?limit=100`).then(o => o.json());
                let post = response.data?.children?.[Math.floor(Math.random() * response.data?.children?.length)]?.data;

                if (!post) {
                    sendEmbedMessage(ctx.channel.id, "No posts found in r/feet.", []);
                    return;
                }

                let authorResponse = await fetch(`https://www.reddit.com/u/${post?.author}/about.json`).then(o => o.json());
                let authorIconUrl = authorResponse?.data?.icon_img?.split("?")[0];

                if (silent ?? true) {
                    sendEmbedMessage(ctx.channel.id, "", [
                        {
                            type: "rich",
                            title: post?.title,
                            url: `https://reddit.com${post?.permalink}`,
                            author: {
                                name: `u/${post?.author} • r/${post?.subreddit}`,
                                icon_url: authorIconUrl,
                            },
                            image: {
                                url: post?.url_overridden_by_dest?.replace(/.gifv$/g, ".gif") ?? post?.url?.replace(/.gifv$/g, ".gif"),
                            },
                            color: 0xf4b8e4,
                        }
                    ]);
                } else {
                    g.sendMessage(ctx.channel.id, { content: post?.url_overridden_by_dest ?? post?.url });
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
