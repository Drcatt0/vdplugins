(function (plugin, commands, metro, common) {
    "use strict";

    // Import necessary Vendetta utilities and stores
    const { findByProps } = metro;
    const GuildStore = findByProps("getGuilds", "getGuild");
    const LeaveGuild = findByProps("leaveGuild");

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

                        // Notify the user that the process is starting
                        return {
                            content: `You are in ${guilds.length} server(s). Are you sure you want to leave all?`,
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: "Confirm",
                                            style: 4, // Danger style
                                            custom_id: "leaveall_confirm",
                                        },
                                    ],
                                },
                            ],
                            async executeCustom(id, interaction) {
                                if (id !== "leaveall_confirm") return;

                                for (const guildId of guilds) {
                                    try {
                                        await LeaveGuild.leaveGuild(guildId);
                                    } catch (err) {
                                        console.error(`Failed to leave guild ${guildId}:`, err);
                                    }
                                }

                                interaction.update({
                                    content: "Successfully left all servers.",
                                    components: [],
                                });
                            },
                        };
                    } catch (error) {
                        console.error("Error leaving servers:", error);
                        return {
                            content:
                                "An error occurred while leaving servers. Check the console for details.",
                        };
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
