import * as common from "../../common";
import { semanticColors } from "@vendetta/ui";
import { registerCommand } from "@vendetta/commands";
import { findByStoreName, findByProps } from "@vendetta/metro";

const ThemeStore = findByStoreName("ThemeStore");

// Setting the color for the embed to match the theme
export const EMBED_COLOR = () =>
    parseInt(
        findByProps("colors", "meta").meta.resolveSemanticColor(ThemeStore.theme, semanticColors.BACKGROUND_SECONDARY).slice(1),
        16
    );

const authorMods = {
    author: {
        username: "HelloBot",
        avatar: "command",
        avatarURL: common.AVATARS.command, // Replace with specific avatar URL if needed
    },
};

// Helper function to send a message, mimicking TokenUtils style
let madeSendMessage;
function sendMessage() {
    if (!madeSendMessage) madeSendMessage = common.mSendMessage(vendetta);
    return madeSendMessage(...arguments);
}

export default {
    meta: vendetta.plugin,
    patches: [],
    onUnload() {
        // Unpatch all when the plugin is unloaded
        this.patches.forEach((up) => up());
        this.patches = [];
    },
    onLoad() {
        try {
            const helloCommand = {
                execute(args, ctx) {
                    try {
                        // Setting up the message modifications (author and interaction)
                        const messageMods = {
                            ...authorMods,
                            interaction: {
                                name: "/hello",
                                user: findByStoreName("UserStore").getCurrentUser(),
                            },
                        };

                        // Sending an embed with "Hello World" content
                        sendMessage(
                            {
                                loggingName: "HelloBot output message",
                                channelId: ctx.channel.id,
                                embeds: [
                                    {
                                        color: EMBED_COLOR(),
                                        type: "rich",
                                        title: "Hello World",
                                        description: "This is a test message in an embed.",
                                    },
                                ],
                            },
                            messageMods
                        );
                    } catch (error) {
                        console.error("Error executing /hello command:", error);
                    }
                },
            };

            const commandRegistration = registerCommand({
                name: "hello",
                displayName: "hello",
                description: "Sends a Hello World message in an embed",
                type: 1,
                inputType: 1,
                applicationId: "-1",
                execute: helloCommand.execute,
            });

            this.patches.push(commandRegistration);
        } catch (error) {
            console.error("Error loading HelloBot:", error);
        }
    },
};
