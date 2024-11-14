(function (f, L, g, t, B, C, c, d, F, D, G, k, O, E) {
    "use strict";
    const defaultSearchEngines = {
        SauceNAO: "https://saucenao.com/search.php?url=%s",
        Google: "https://www.google.com/searchbyimage?image_url=%s&safe=off",
        TinEye: "https://tineye.com/search?url=%s",
        FuzzySearch: "https://api-next.fuzzysearch.net/v1/url?url="
    };

    // Variable to store the currently selected search engine name, default to SauceNAO
    let selectedSearchEngine = "SauceNAO";

    // Function to process with FuzzySearch if selected
    async function processWithFuzzySearch(url) {
        try {
            const finalLink = `${defaultSearchEngines.FuzzySearch}${encodeURIComponent(url)}`;
            const response = await fetch(finalLink, {
                method: "GET",
                headers: {
                    "x-api-key": "eluIOaOhIP1RXlgYetkcZCF8la7p3NoCPy8U0i8dKiT4xdIH",
                    "Accept": "application/json"
                }
            });
            const data = await response.json();
            return data.url || url;
        } catch {
            return url; // Fallback to original URL if FuzzySearch fails
        }
    }

    const M = g.findByProps("openLazy", "hideActionSheet"),
          P = ((y = g.findByProps("ActionSheetRow")) === null || y === void 0 ? void 0 : y.ActionSheetRow) ?? d.Forms.FormRow,
          j = g.findByStoreName("MessageStore"),
          V = g.findByStoreName("ChannelStore"),
          z = t.stylesheet.createThemedStyleSheet({ iconComponent: { width: 24, height: 24, tintColor: C.semanticColors.INTERACTIVE_NORMAL } });

    function K() {
        return B.before("openLazy", M, function (e) {
            let [a, i, s] = e;
            const n = s?.message;
            i !== "MessageLongPressActionSheet" || !n || a.then(function (A) {
                const ae = B.after("default", A, function (ue, ie) {
                    t.React.useEffect(function () { return function () { ae(); } }, []);
                    const v = F.findInReactTree(ie, function (r) {
                        var l, h;
                        return (r == null || (h = r[0]) === null || h === void 0 || (l = h.type) === null || l === void 0 ? void 0 : l.name) === "ButtonRow";
                    });
                    if (!v) return;
                    const re = Math.max(v.findIndex(function (r) { return r.props.message === t.i18n.Messages.MARK_UNREAD; }), 0),
                          u = j.getMessage(n.channel_id, n.id),
                          imageAttachments = u?.attachments?.filter(att => att.content_type?.startsWith("image"));
                    if (!imageAttachments || imageAttachments.length === 0) return;

                    const oe = async function () {
                        let searchUrl;
                        if (selectedSearchEngine === "FuzzySearch") {
                            searchUrl = await processWithFuzzySearch(imageAttachments[0].url);
                        } else {
                            searchUrl = defaultSearchEngines[selectedSearchEngine].replace("%s", encodeURIComponent(imageAttachments[0].url));
                        }
                        t.url.openURL(searchUrl);
                        M.hideActionSheet();
                    };

                    v.splice(re, 0, t.React.createElement(P, {
                        label: selectedSearchEngine,
                        icon: t.React.createElement(P.Icon, {
                            source: c.getAssetIDByName("ic_search"),
                            IconComponent: function () { return t.React.createElement(t.ReactNative.Image, { resizeMode: "cover", style: z.iconComponent, source: c.getAssetIDByName("ic_search") }); }
                        }),
                        onPress: oe
                    }));
                });
            });
        });
    }

    // Search Engine Settings Page
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
            Object.entries(defaultSearchEngines)
                .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(([name]) => t.React.createElement(FormRow, {
                    key: name,
                    label: name,
                    trailing: () => t.React.createElement(FormRow.Arrow ?? t.ReactNative.Text, null, "➔"),
                    onPress: () => {
                        selectedSearchEngine = name;
                        alert(`Selected ${name} as the search engine.`);
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
        onLoad: function () { return b = [K()]; },
        onUnload: function () { for (const e of b) e(); },
        settings: SettingsPage
    };

    return f.default = ne, Object.defineProperty(f, "__esModule", { value: !0 }), f;
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta, vendetta.commands, vendetta.ui.alerts);
