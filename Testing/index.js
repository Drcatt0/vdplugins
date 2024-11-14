(function(f, L, g, t, B, C, c, d, F, D, G, k, O, E) {
    "use strict";

    // Default reverse image search engine URL
    const defaultSearchUrl = "https://saucenao.com";

    // Reverse Image Search Engines
    const searchEngines = {
        "SauceNAO": "https://saucenao.com",
        "Google": "https://images.google.com",
        "TinEye": "https://tineye.com",
    };

    // Convert search engine list to a format for display
    const searchEngineChoices = Object.entries(searchEngines).map(([name, url]) => ({ name, url }));

    // Store user-selected search engine in memory (or use default if none selected)
    let selectedSearchUrl = defaultSearchUrl;

    // Reverse Image Search Action Button
    const M = g.findByProps("openLazy", "hideActionSheet");
    const P = d.Forms?.FormRow ?? t.ReactNative.Text;
    const j = g.findByStoreName("MessageStore");
    const V = g.findByStoreName("ChannelStore");
    const z = t.stylesheet.createThemedStyleSheet({
        iconComponent: { width: 24, height: 24, tintColor: C.semanticColors.INTERACTIVE_NORMAL }
    });
    let T = [];

    function K() {
        return B.before("openLazy", M, function(e) {
            let [a, i, s] = e;
            const n = s?.message;
            i !== "MessageLongPressActionSheet" || !n || a.then(function(A) {
                const ae = B.after("default", A, function(ue, ie) {
                    t.React.useEffect(function() {
                        return function() { ae(); };
                    }, []);
                    const v = F.findInReactTree(ie, function(r) {
                        var l, h;
                        return (r == null || (h = r[0]) === null || h === void 0 || (l = h.type) === null || l === void 0 ? void 0 : l.name) === "ButtonRow";
                    });
                    if (!v) return;
                    const re = Math.max(v.findIndex(function(r) { return r.props.message === t.i18n.Messages.MARK_UNREAD; }), 0);
                    const u = j.getMessage(n.channel_id, n.id);
                    const imageAttachments = u?.attachments?.filter(att => att.content_type?.startsWith("image"));
                    if (!imageAttachments || imageAttachments.length === 0) return;
                    const S = u?.id ?? n.id, se = u?.content ?? n.content;
                    const I = T.find(function(r) { return Object.keys(r)[0] === S; }, "cache object");
                    const _ = "Reverse Image Search", icon = c.getAssetIDByName("ic_search");
                    const oe = function() {
                        const searchUrl = selectedSearchUrl; // Use selected search engine URL
                        if (imageAttachments.length === 1) {
                            const searchEngineUrl = `${searchUrl}/search.php?url=${encodeURIComponent(imageAttachments[0].url)}`;
                            t.url.openURL(searchEngineUrl);
                        } else {
                            const links = imageAttachments.map((att, index) => `> [Image ${index + 1}](${searchUrl}/search.php?url=${encodeURIComponent(att.url)})`).join("\n");
                            t.FluxDispatcher.dispatch({ type: "MESSAGE_UPDATE", message: { ...u, content: links, guild_id: V.getChannel(u.channel_id).guild_id }, log_edit: !1 });
                        }
                        M.hideActionSheet();
                    };
                    v.splice(re, 0, t.React.createElement(P, {
                        label: _,
                        icon: t.React.createElement(P.Icon, { source: icon, IconComponent: function() { return t.React.createElement(t.ReactNative.Image, { resizeMode: "cover", style: z.iconComponent, source: icon }); } }),
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
            searchEngineChoices
                .filter(choice => choice.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(choice => t.React.createElement(FormRow, {
                    key: choice.name,
                    label: choice.name || "Fallback Label",
                    trailing: () => t.React.createElement(FormRow.Arrow ?? t.ReactNative.Text, null, "➔"),
                    onPress: () => {
                        selectedSearchUrl = choice.url;
                        alert(`Selected ${choice.name} for reverse image search.`);
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
        onLoad: function() { return b = [K()]; },
        onUnload: function() { for (const e of b) e(); },
        settings: SettingsPage
    };

    return f.default = ne, Object.defineProperty(f, "__esModule", { value: !0 }), f
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta, vendetta.commands, vendetta.ui.alerts);
