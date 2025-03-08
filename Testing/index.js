(function (plugin, v, m) {
    "use strict";

    const { React } = v.metro.common;
    const { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } = v.metro.common.ReactNative;
    const { storage } = v.plugin;
    const { FormInput, FormLabel, FormSwitchRow } = v.ui.components.Forms;
    const { showToast } = v.ui.toasts;
    const { openModal } = v.ui;

    // Your Plugin Repo URL
    const PLUGIN_REPO = "https://drcatt0.github.io/vdplugins/";

    // Component to Fetch and Display Plugins
    function PluginBrowser() {
        const [plugins, setPlugins] = React.useState(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState(null);

        React.useEffect(() => {
            fetch(PLUGIN_REPO + "index.json")
                .then((res) => res.json())
                .then((data) => {
                    setPlugins(data.plugins);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("[Plugin Browser] Failed to fetch plugins:", err);
                    setError("Failed to load plugin list.");
                    setLoading(false);
                });
        }, []);

        if (loading) {
            return (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator size="large" color="#7289DA" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={{ padding: 20 }}>
                    <Text style={{ color: "red" }}>{error}</Text>
                </View>
            );
        }

        return (
            <ScrollView style={{ padding: 10 }}>
                {plugins.map((plugin) => (
                    <View key={plugin.name} style={{ marginBottom: 15, padding: 10, borderRadius: 8, backgroundColor: "#2F3136" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>{plugin.name}</Text>
                        <Text style={{ color: "#BBB", marginBottom: 10 }}>{plugin.description}</Text>
                        <TouchableOpacity
                            onPress={() => installPlugin(plugin.url)}
                            style={{
                                backgroundColor: "#7289DA",
                                padding: 10,
                                borderRadius: 5,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Install</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        );
    }

    // Function to Install Plugin
    function installPlugin(url) {
        v.plugins.install(url)
            .then(() => {
                showToast(`Installed ${url}`, "success");
            })
            .catch((err) => {
                showToast(`Failed to install: ${err}`, "error");
            });
    }

    // Plugin Registration
    plugin.onLoad = function () {
        v.commands.registerCommand({
            name: "pluginbrowser",
            displayName: "pluginbrowser",
            description: "Browse and install custom plugins from drcatt0.github.io",
            type: 1,
            applicationId: "-1",
            inputType: 1,
            execute: () => openModal(PluginBrowser),
        });
    };

    plugin.onUnload = function () {
        v.commands.unregisterCommand("pluginbrowser");
    };

})(vendetta.plugin, vendetta, vendetta.metro);
