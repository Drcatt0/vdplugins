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
        username: "HelloBot",
        avatar: "command",
        avatarURL: "https://example.com/your-bot-avatar.png" // Replace with the bot avatar URL if you have one
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
            name: "hello",
            displayName: "hello",
            description: "Sends a Hello World message in an embed.",
            displayDescription: "Sends a Hello World message in an embed.",
            type: 1,
            inputType: 1,
            applicationId: "-1",
            options: [],
            execute(_, ctx) {
                try {
                    const embed = {
                        color: EMBED_COLOR(),
                        type: "rich",
                        title: "Hello World",
                        description: "This is a test message to confirm the embed functionality.",
                    };

                    // Send the embed message with author modifications
                    sendMessage(
                        {
                            loggingName: "HelloBot output message",
                            channelId: ctx.channel.id,
                            embeds: [embed],
                        },
                        {
                            ...authorMods,
                            interaction: {
                                name: "/hello",
                                user: findByStoreName("UserStore").getCurrentUser(),
                            },
                        }
                    );
                } catch (e) {
                    console.error("Error sending Hello World embed:", e);
                    sendMessage({
                        channelId: ctx.channel.id,
                        content: "Failed to send Hello World message.",
                    });
                }
            },
        });

        this.patches.push(command);
    },
};
