(function(f, L, g, t, B, C, c, d, F, D, G, k, O, E) {
    "use strict";

    // Search Engines for Configuration Menu
    const searchEngines = {
        "SauceNAO": "https://saucenao.com",
        "Google": "https://images.google.com",
        "TinEye": "https://tineye.com",
    };

    // Convert search engine list to a format for display
    const searchEngineChoices = Object.entries(searchEngines).map(([name, url]) => ({ name, url }));

    // Settings storage (default to SauceNAO if no engine is selected)
    O.selectedEngineURL ??= "https://saucenao.com";

    // Search Engine Settings Page (Configuration Menu)
    function SearchEngineSettingsPage() {
        const ScrollView = t.ReactNative.ScrollView ?? t.ReactNative.View;
        const FormRow = d.Forms?.FormRow ?? t.ReactNative.Text;
        const Search = d.Forms?.Search ?? t.ReactNative.Text;

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
                        O.selectedEngineURL = choice.url;
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

    // Main plugin functionality
    const H = O.selectedEngineURL;

    var w = {
        translate: async function(e) {
            let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto",
                i = arguments.length > 2 ? arguments[2] : void 0,
                s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
            try {
                if (s) return { source_lang: a, text: e };
                const n = await (await fetch(H, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: e, source_lang: a, target_lang: i })
                })).json();
                if (n.code !== 200) throw Error(`Failed to translate text from DeepL: ${n.message}`);
                return { source_lang: a, text: n.data };
            } catch (n) {
                throw Error(`Failed to fetch from DeepL: ${n}`);
            }
        }
    };

    let b = [];
    var ne = {
        onLoad: function() { return b = [] },
        onUnload: function() { for (const e of b) e() },
        settings: SettingsPage
    };

    return f.default = ne, Object.defineProperty(f, "__esModule", { value: !0 }), f
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta, vendetta.commands, vendetta.ui.alerts);
