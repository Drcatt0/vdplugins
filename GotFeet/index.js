import * as common from "../../common";
import { semanticColors } from "@vendetta/ui";
import { registerCommand } from "@vendetta/commands";
import { findByStoreName, findByProps } from "@vendetta/metro";

const ThemeStore = findByStoreName("ThemeStore");
const EMBED_COLOR = () =>
    parseInt(findByProps("colors", "meta").meta.resolveSemanticColor(ThemeStore.theme, semanticColors.BACKGROUND_SECONDARY).slice(1), 16);

const authorMods = {
    author: {
        username: "HelloBot",
        avatar: "command",
        avatarURL: common.AVATARS.command, // Replace this with a specific avatar URL if desired
    },
};

let madeSendMessage;
function sendMessage() {
    if (!madeSendMessage) madeSendMessage = common.mSendMessage(vendetta);
    return madeSendMessage(...arguments);
}

export default {
    meta: vendetta.plugin,
    patches: [],
    onUnload() {
        this.patches.forEach((up) => up()); // Unpatch all patches
        this.patches = [];
    },
    onLoad() {
        try {
            const exeCute = {
                hello(args, ctx) {
                    try {
                        const messageMods = {
                            ...authorMods,
                            interaction: {
                                name: "/hello",
                                user: findByStoreName("UserStore").getCurrentUser(),
                            },
                        };

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
                    } catch (e) {
                        console.error("Error sending Hello World embed:", e);
                        alert("There was an error while executing /hello\n" + e.stack);
                    }
                },
            };

            const helloCommand = registerCommand({
                type: 1,
                inputType: 1,
                applicationId: "-1",
                execute: exeCute.hello,
                name: "hello",
                description: "Sends a Hello World message in an embed",
            });

            this.patches.push(helloCommand);
        } catch (e) {
            console.error("Error loading HelloBot:", e);
            alert("There was an error while loading HelloBot\n" + e.stack);
        }
    },
};
