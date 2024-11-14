import * as common from "../../common";
import { semanticColors } from "@vendetta/ui";
import { registerCommand } from "@vendetta/commands";
import { findByStoreName, findByProps } from "@vendetta/metro";

// Theme color for embeds
const ThemeStore = findByStoreName("ThemeStore");
const EMBED_COLOR = () =>
    parseInt(findByProps("colors", "meta").meta.resolveSemanticColor(ThemeStore.theme, semanticColors.BACKGROUND_SECONDARY).slice(1), 16);

const authorMods = {
    author: {
        username: "GotFeetBot",
        avatar: "command",
        avatarURL: "https://example.com/your-bot-avatar.png" // Replace with the bot avatar URL
    },
};

// Send message helper function
let madeSendMessage;
function sendMessage() {
    if (!madeSendMessage) madeSendMessage = common.mSendMessage(vendetta);
    return madeSendMessage(...arguments);
}

export default {
    meta: vendetta.plugin,
    patches: [],
    onUnload() {
        this.patches.forEach((up) => up()); // Unpatch every patch
        this.patches = [];
    },
    onLoad() {
        const command = registerCommand({
            name: "gotfeet",
            displayName: "gotfeet",
            description: "Fetches a random post from selected subreddits.",
            displayDescription: "Fetches a random post from selected subreddits.",
            type: 1,
            inputType: 1,
            applicationId: "-1",
            options: [],
            async execute(_, ctx) {
                try {
                    const subreddits = ["feet", "feetishh", "feetinyourface", "feetqueens", "feettoesandsocks"];
                    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
                    
                    // Fetch posts from Reddit
                    const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
                    const data = await response.json();
                    const posts = data.data.children;
                    const imagePosts = posts.filter(post => post.data.post_hint === "image");

                    if (imagePosts.length > 0) {
                        const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];

                        const embed = {
                            color: EMBED_COLOR(),
                            type: "rich",
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

                        // Send the embed message with author modifications
                        sendMessage(
                            {
                                loggingName: "GotFeetBot output message",
                                channelId: ctx.channel.id,
                                embeds: [embed],
                            },
                            {
                                ...authorMods,
                                interaction: {
                                    name: "/gotfeet",
                                    user: findByStoreName("UserStore").getCurrentUser(),
                                },
                            }
                        );
                    } else {
                        sendMessage({
                            channelId: ctx.channel.id,
                            content: `No images found in r/${subreddit}.`,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching image:", error);
                    sendMessage({
                        channelId: ctx.channel.id,
                        content: "Failed to retrieve image.",
                    });
                }
            },
        });

        this.patches.push(command);
    },
};
