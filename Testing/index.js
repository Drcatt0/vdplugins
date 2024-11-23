(function (f, $, h) {
    "use strict";

    // Enum Definitions
    var CommandType;
    (function (e) {
        e[(e.BUILT_IN = 0)] = "BUILT_IN";
        e[(e.BUILT_IN_TEXT = 1)] = "BUILT_IN_TEXT";
        e[(e.BUILT_IN_INTEGRATION = 2)] = "BUILT_IN_INTEGRATION";
        e[(e.BOT = 3)] = "BOT";
        e[(e.PLACEHOLDER = 4)] = "PLACEHOLDER";
    })(CommandType || (CommandType = {}));

    var OptionType;
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
    })(OptionType || (OptionType = {}));

    var CommandContext;
    (function (e) {
        e[(e.CHAT = 1)] = "CHAT";
        e[(e.USER = 2)] = "USER";
        e[(e.MESSAGE = 3)] = "MESSAGE";
    })(CommandContext || (CommandContext = {}));

    // Command Registration
    let RegisteredCommands = [];

    const RegisterCommands = function () {
        RegisteredCommands.push(
            $.registerCommand({
                name: "leaveall",
                displayName: "leaveall",
                description: "Leave all joined servers.",
                displayDescription: "Leave all joined servers.",
                type: CommandContext.CHAT,
                inputType: CommandType.BUILT_IN_TEXT,
                applicationId: "-1",
                options: [],
                async execute(args) {
                    try {
                        const GuildStore = h.findByProps("getGuilds", "getGuild");
                        const LeaveGuild = h.findByProps("leaveGuild");
                        const Dispatcher = h.findByProps("dispatch");
                        const guilds = Object.keys(GuildStore.getGuilds());

                        if (guilds.length === 0) {
                            return { content: "You are not in any servers." };
                        }

                        for (const guildId of guilds) {
                            try {
                                await LeaveGuild.leaveGuild(guildId);
                                Dispatcher.dispatch({ type: "GUILD_REMOVE", guildId });
                            } catch (err) {
                                console.error(`Failed to leave guild ${guildId}:`, err);
                            }
                        }

                        return { content: "Successfully left all servers." };
                    } catch (error) {
                        console.error("Error leaving servers:", error);
                        return { content: "An error occurred while leaving servers. Check the console for details." };
                    }
                },
            })
        );
    };

    const UnregisterCommands = function () {
        for (const command of RegisteredCommands) command();
    };

    // Plugin Lifecycle
    return (f.onLoad = RegisterCommands), (f.onUnload = UnregisterCommands), f;
})({}, vendetta.commands, vendetta.metro, vendetta.metro.common);
