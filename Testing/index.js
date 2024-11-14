(function(f,L,g,t,B,C,c,d,F,D,G,k,O,E){"use strict";const H="https://saucenao.com";

// Reverse Image Search Engines
const searchEngines = {
    "SauceNAO": "https://saucenao.com",
    "Google": "https://images.google.com",
    "TinEye": "https://tineye.com",
};

// Map choices for search engines
const searchEngineChoices = Object.entries(searchEngines).map(([name, url]) => ({ name, url }));

// Search Engine Selection Page
function SearchEngineSettingsPage() {
    if (!t.ReactNative.ScrollView || !d.Forms.Search || !d.Forms.FormRow) {
        console.error("One of the components is undefined:", {
            ScrollView: t.ReactNative.ScrollView,
            Search: d.Forms.Search,
            FormRow: d.Forms.FormRow
        });
        return t.React.createElement(t.ReactNative.Text, null, "Error: Missing components.");
    }

    const [searchTerm, setSearchTerm] = t.React.useState("");

    return t.React.createElement(t.ReactNative.ScrollView, { style: { flex: 1 } },
        t.React.createElement(d.Forms.Search, {
            placeholder: "Search Engine",
            onChangeText: setSearchTerm,
        }),
        searchEngineChoices
            .filter(choice => choice.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(choice => t.React.createElement(d.Forms.FormRow, {
                key: choice.name,
                label: choice.name,
                trailing: () => t.React.createElement(d.Forms.FormRow.Arrow, null),
                onPress: () => {
                    O.set("selectedEngine", choice.url);
                    E.showToast(`Selected ${choice.name} as search engine`, c.getAssetIDByName("check"));
                },
            }))
    );
}

// Main Settings Page
function SettingsPage() {
    if (!t.NavigationNative || !t.NavigationNative.useNavigation) {
        console.error("Navigation is undefined:", t.NavigationNative);
        return t.React.createElement(t.ReactNative.Text, null, "Error: Navigation component missing.");
    }

    const navigation = t.NavigationNative.useNavigation();

    return t.React.createElement(t.ReactNative.ScrollView, { style: { flex: 1 } },
        t.React.createElement(d.Forms.FormRow, {
            label: "Select Search Engine",
            trailing: () => t.React.createElement(d.Forms.FormRow.Arrow, null),
            onPress: () => navigation.push("VendettaCustomPage", {
                title: "Select Search Engine",
                render: SearchEngineSettingsPage,
            }),
        }),
        t.React.createElement(t.ReactNative.Text, { style: { textAlign: "center", margin: 10 } }, "Configure your preferred reverse image search engine.")
    );
}

// Load and unload functions
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
