(function (plugin, commands, metro, common) {
    "use strict";

    // Import necessary Vendetta utilities and stores
    const { findByProps } = metro;
    const GuildStore = findByProps("getGuilds", "getGuild");
    const LeaveGuild = findByProps("leaveGuild");
    const Dispatcher = findByProps("dispatch");

    let registeredCommands = [];

    const onLoad = () => {
        registeredCommands.push(
            commands.registerCommand({
                name: "leaveall",
                displayName: "leaveall",
                description: "Leave all joined servers.",
                displayDescription: "Leave all joined servers.",
                type: 1, // CHAT command type
                inputType: 1, // BUILT_IN_TEXT
                applicationId: "-1",
                options: [],
                async execute() {
                    try {
                        const guilds = Object.keys(GuildStore.getGuilds());
                        if (guilds.length === 0) {
                            return { content: "You are not in any servers." };
                        }

                        for (const guildId of guilds) {
                            try {
                                await LeaveGuild.leaveGuild(guildId);
                                Dispatcher.dispatch({
                                    type: "GUILD_REMOVE",
                                    guildId,
                                });
                            } catch (err) {
                                console.error(`Failed to leave guild ${guildId}:`, err);
                            }
                        }

                        return { content: "Successfully left all servers." };
                    } catch (error) {
                        console.error("Error leaving servers:", error);
                        return { content: "An error occurred while leaving servers. Check console for details." };
                    }
                },
            })
        );
    };

    const onUnload = () => {
        for (const unregister of registeredCommands) unregister();
        registeredCommands = [];
    };

    plugin.onLoad = onLoad;
    plugin.onUnload = onUnload;
})(vendetta.plugin, vendetta.commands, vendetta.metro, vendetta.metro.common);
