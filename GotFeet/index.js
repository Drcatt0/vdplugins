import * as common from "../../common";
import { semanticColors } from "@vendetta/ui";
import { registerCommand } from "@vendetta/commands";
import { findByStoreName, findByProps } from "@vendetta/metro";

// Resolve embed color using the theme
const ThemeStore = findByStoreName("ThemeStore");
const EMBED_COLOR = () =>
    parseInt(
        findByProps("colors", "meta").meta.resolveSemanticColor(ThemeStore.theme, semanticColors.BACKGROUND_SECONDARY).slice(1),
        16
    );

// Author modifications for embed
const authorMods = {
    author: {
        username: "TokenUtils",
        avatar: "command",
        avatarURL: common.AVATARS.command,
    },
};

// Send message function used for embedding the response
let madeSendMessage;
function sendMessage() {
    if (window.sendMessage) return window.sendMessage?.(...arguments);
    if (!madeSendMessage) madeSendMessage = common.mSendMessage(vendetta);
    return madeSendMessage(...arguments);
}

export default {
    meta: vendetta.plugin,
    patches: [],
    onUnload() {
        // Unpatch everything on unload
        this.patches.forEach((up) => up());
        this.patches = [];
    },
    onLoad() {
        try {
            // Define `/token get` command
            const getCommand = {
                execute(args, ctx) {
                    try {
                        const messageMods = {
                            ...authorMods,
                            interaction: {
                                name: "/token get",
                                user: findByStoreName("UserStore").getCurrentUser(),
                            },
                        };

                        const { getToken } = findByProps("getToken");
                        sendMessage(
                            {
                                loggingName: "Token get output message",
                                channelId: ctx.channel.id,
                                embeds: [
                                    {
                                        color: EMBED_COLOR(),
                                        type: "rich",
                                        title: "Token of the current account",
                                        description: `${getToken()}`,
                                    },
                                ],
                            },
                            messageMods
                        );
                    } catch (e) {
                        console.error(e);
                        alert("There was an error while executing /token get\n" + e.stack);
                    }
                },
            };

            // Register the `/token get` command
            const commandConfig = {
                type: 1,
                inputType: 1,
                applicationId: "-1",
                execute: getCommand.execute,
                name: "token get",
                description: "Shows your current user token",
            };

            this.patches.push(registerCommand(commandConfig));
        } catch (e) {
            console.error(e);
            alert("There was an error while loading TokenUtils\n" + e.stack);
        }
    },
};
