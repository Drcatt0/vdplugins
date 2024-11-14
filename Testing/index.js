(function(f, L, g, t, B, C, c, d, F, D, G, k, O, E) {
    "use strict";

    // Reverse Image Search Engines
    const searchEngines = {
        "SauceNAO": "https://saucenao.com",
        "Google": "https://images.google.com",
        "TinEye": "https://tineye.com",
    };

    // Convert search engine list to a format for display
    const searchEngineChoices = Object.entries(searchEngines).map(([name, url]) => ({ name, url }));

    // Search Engine Settings Page
    function SearchEngineSettingsPage() {
        const ScrollView = t.ReactNative.ScrollView ?? t.ReactNative.View; // Use View as fallback if ScrollView is undefined
        const FormRow = d.Forms?.FormRow ?? t.ReactNative.Text; // Use Text as fallback if FormRow is undefined
        const Search = d.Forms?.Search ?? t.ReactNative.Text; // Use Text as fallback if Search is undefined

        const [searchTerm, setSearchTerm] = t.React.useState("");

        return t.React.createElement(ScrollView, { style: { flex: 1 } },
            Search && t.React.createElement(Search, {
                placeholder: "Search Engine",
                onChangeText: setSearchTerm,
            }),
            searchEngineChoices
                .filter(choice => choice.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(choice => t.React.createElement(FormRow, {
                    key: choice.name,
                    label: choice.name || "Fallback Label",
                    trailing: () => t.React.createElement(FormRow.Arrow ?? t.ReactNative.Text, null, "➔"),
                    onPress: () => {
                        O.set("selectedEngine", choice.url);
                        E.showToast(`Selected ${choice.name} as search engine`, c.getAssetIDByName("check"));
                    },
                }))
        );
    }

    // Main Settings Page
    function SettingsPage() {
        const navigation = t.NavigationNative?.useNavigation?.();

        if (!navigation) {
            console.error("Navigation is undefined");
            return t.React.createElement(t.ReactNative.Text, null, "Error: Navigation component missing.");
        }

        const ScrollView = t.ReactNative.ScrollView ?? t.ReactNative.View;
        const FormRow = d.Forms?.FormRow ?? t.ReactNative.Text;

        return t.React.createElement(ScrollView, { style: { flex: 1 } },
            t.React.createElement(FormRow, {
                label: "Select Search Engine",
                trailing: () => t.React.createElement(FormRow.Arrow ?? t.ReactNative.Text, null, "➔"),
                onPress: () => navigation.push("VendettaCustomPage", {
                    title: "Select Search Engine",
                    render: SearchEngineSettingsPage,
                }),
            }),
            t.React.createElement(t.ReactNative.Text, { style: { textAlign: "center", margin: 10 } }, "Configure your preferred reverse image search engine.")
        );
    }

    // Plugin load/unload functions
    let b = [];
    var ne = {
        onLoad: function() {
            if (typeof K === "function") {
                b = [K()];
            } else {
                console.error("Function K is undefined or not a function.");
            }
        },
        onUnload: function() { for (const e of b) e() },
        settings: SettingsPage
    };

    return f.default = ne, Object.defineProperty(f, "__esModule", { value: !0 }), f
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta, vendetta.commands, vendetta.ui.alerts, vendetta.storage, vendetta.ui.toasts);
