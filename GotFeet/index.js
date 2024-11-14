(function (f, $, h, B) {
    "use strict";

    var N;
    (function (e) {
        e[(e.BUILT_IN = 0)] = "BUILT_IN";
        e[(e.BUILT_IN_TEXT = 1)] = "BUILT_IN_TEXT";
        e[(e.BUILT_IN_INTEGRATION = 2)] = "BUILT_IN_INTEGRATION";
        e[(e.BOT = 3)] = "BOT";
        e[(e.PLACEHOLDER = 4)] = "PLACEHOLDER";
    })(N || (N = {}));

    var c;
    (function (e) {
        e[(e.SUB_COMMAND = 1)] = "SUB_COMMAND";
        e[(e.SUB_COMMAND_GROUP = 2)] = "SUB_COMMAND_GROUP";
        e[(e.STRING = 3)] = "STRING";
        e[(e.INTEGER = 4)] = "INTEGER";
        e[(e.BOOLEAN = 5)] = "BOOLEAN";
        e[(e.USER = 6)] = "USER";
        e[(e.CHANNEL = 7)] = "CHANNEL";
        e[(e.ROLE = 8)] = "ROLE";
        e[(e.MENTIONABLE = 9)] = "MENTIONABLE";
        e[(e.NUMBER = 10)] = "NUMBER";
        e[(e.ATTACHMENT = 11)] = "ATTACHMENT";
    })(c || (c = {}));

    var g;
    (function (e) {
        e[(e.CHAT = 1)] = "CHAT";
        e[(e.USER = 2)] = "USER";
        e[(e.MESSAGE = 3)] = "MESSAGE";
    })(g || (g = {}));

    const { sendMessage } = h.findByProps("sendMessage");
    const { getCurrentUser } = h.findByStoreName("UserStore");
    const EMBED_COLOR = parseInt("3498db", 16); // Set a color for the embed

    let A = [];

    const L = function () {
        A.push(
            $.registerCommand({
                name: "gotfeet",
                displayName: "gotfeet",
                description: "Fetches a random post from selected subreddits.",
                displayDescription: "Fetches a random post from selected subreddits.",
                type: g.CHAT,
                inputType: N.BUILT_IN_TEXT,
                applicationId: "-1",
                options: [],
                async execute(_, context) {
                    try {
                        // Select a random subreddit
                        const subreddits = [
                            "feet",
                            "feetishh",
                            "feetinyourface",
                            "feetqueens",
                            "feettoesandsocks"
                        ];
                        const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

                        // Fetch a random post from the subreddit
                        const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
                        const data = await response.json();
                        const posts = data.data.children;
                        const imagePosts = posts.filter(post => post.data.post_hint === "image");

                        if (imagePosts.length > 0) {
                            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
                            const embed = {
                                color: EMBED_COLOR,
                                title: randomPost.data.title,
                                url: `https://reddit.com${randomPost.data.permalink}`,
                                image: { url: randomPost.data.url },
                                fields: [
                                    {
                                        name: "Subreddit",
                                        value: `r/${subreddit}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Author",
                                        value: `u/${randomPost.data.author}`,
                                        inline: true,
                                    },
                                ],
                            };

                            // Send the embed message
                            sendMessage({
                                channelId: context.channel.id,
                                content: "",
                                embeds: [embed],
                            });
                        } else {
                            sendMessage({
                                channelId: context.channel.id,
                                content: `No images found in r/${subreddit}.`,
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching image:", error);
                        sendMessage({
                            channelId: context.channel.id,
                            content: "Failed to retrieve image.",
                        });
                    }
                }
            })
        );
    };

    const O = function () {
        for (const e of A) e();
    };

    return (f.onLoad = L), (f.onUnload = O), f;
})({}, vendetta.commands, vendetta.metro, vendetta.metro.common);
