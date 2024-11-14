(function(f, $, h, B) {
    "use strict";
    var N;
    (function(e) {
        e[e.BUILT_IN = 0] = "BUILT_IN";
        e[e.BUILT_IN_TEXT = 1] = "BUILT_IN_TEXT";
        e[e.BUILT_IN_INTEGRATION = 2] = "BUILT_IN_INTEGRATION";
        e[e.BOT = 3] = "BOT";
        e[e.PLACEHOLDER = 4] = "PLACEHOLDER";
    })(N || (N = {}));
    
    var c;
    (function(e) {
        e[e.SUB_COMMAND = 1] = "SUB_COMMAND";
        e[e.SUB_COMMAND_GROUP = 2] = "SUB_COMMAND_GROUP";
        e[e.STRING = 3] = "STRING";
        e[e.INTEGER = 4] = "INTEGER";
        e[e.BOOLEAN = 5] = "BOOLEAN";
        e[e.USER = 6] = "USER";
        e[e.CHANNEL = 7] = "CHANNEL";
        e[e.ROLE = 8] = "ROLE";
        e[e.MENTIONABLE = 9] = "MENTIONABLE";
        e[e.NUMBER = 10] = "NUMBER";
        e[e.ATTACHMENT = 11] = "ATTACHMENT";
    })(c || (c = {}));
    
    var g;
    (function(e) {
        e[e.CHAT = 1] = "CHAT";
        e[e.USER = 2] = "USER";
        e[e.MESSAGE = 3] = "MESSAGE";
    })(g || (g = {}));
    
    const { sendBotMessage } = h.findByProps("sendBotMessage");
    let A = [];
    
    const L = function() {
        A.push($.registerCommand({
            name: "gotfeet",
            displayName: "gotfeet",
            description: "Fetches a random post from selected subreddits.",
            displayDescription: "Fetches a random post from selected subreddits.",
            type: g.CHAT,
            inputType: N.BUILT_IN_TEXT,
            applicationId: "-1",
            options: [],
            async execute(_, ctx) { // Passes the context with channel ID
                try {
                    const subreddits = ["feet", "feetishh", "feetinyourface", "feetqueens", "feettoesandsocks"];
                    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
                    const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
                    const data = await response.json();
                    const posts = data.data.children;
                    const imagePosts = posts.filter(post => post.data.post_hint === "image");
                    
                    if (imagePosts.length > 0) {
                        const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
                        const embedMessage = {
                            content: "",
                            embeds: [
                                {
                                    title: `View on Reddit - r/${subreddit}`,
                                    url: `https://www.reddit.com${randomPost.data.permalink}`,
                                    image: { url: randomPost.data.url },
                                    footer: {
                                        text: `Posted by u/${randomPost.data.author}`
                                    }
                                }
                            ]
                        };
                        sendBotMessage(ctx.channel.id, embedMessage); // Sends the embedded message
                    } else {
                        sendBotMessage(ctx.channel.id, `No images found in r/${subreddit}.`);
                    }
                } catch (error) {
                    console.error("Error fetching image:", error);
                    sendBotMessage(ctx.channel.id, "Failed to retrieve image.");
                }
            }
        }));
    };
    
    const O = function() {
        for (const e of A) e();
    };
    
    return f.onLoad = L, f.onUnload = O, f;
})({}, vendetta.commands, vendetta.metro, vendetta.metro.common);
