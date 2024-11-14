(function(f, L, g, t, B, C, c, d, F, D, G, k, O, E) {
    "use strict";

    // Default reverse image search engine URL
    let selectedSearchUrl = "https://saucenao.com";

    // Reverse Image Search Engines
    const searchEngines = {
        "SauceNAO": "https://saucenao.com",
        "Google": "https://images.google.com",
        "TinEye": "https://tineye.com",
    };

    // Convert search engine list to a format for display
    const searchEngineChoices = Object.entries(searchEngines).map(([name, url]) => ({ name, url }));

    const M = g.findByProps("openLazy", "hideActionSheet");
    const P = ((g.findByProps("ActionSheetRow")?.ActionSheetRow) ?? d.Forms.FormRow);
    const j = g.findByStoreName("MessageStore");
    const V = g.findByStoreName("ChannelStore");
    const z = t.stylesheet.createThemedStyleSheet({ iconComponent: { width: 24, height: 24, tintColor: C.semanticColors.INTERACTIVE_NORMAL } });

    function addReverseImageSearchButton() {
        return B.before("openLazy", M, function(e) {
            let [a, i, s] = e;
            const n = s?.message;

            if (i !== "MessageLongPressActionSheet" || !n) return;

            a.then(function(A) {
                const afterDefault = B.after("default", A, function(actionSheet) {
                    t.React.useEffect(() => () => afterDefault(), []);
                    const buttonRow = F.findInReactTree(actionSheet, r => r?.[0]?.type?.name === "ButtonRow");

                    if (!buttonRow) return;

                    const re = Math.max(buttonRow.findIndex(r => r.props.message === t.i18n.Messages.MARK_UNREAD), 0);
                    const message = j.getMessage(n.channel_id, n.id);
                    const imageAttachments = message?.attachments?.filter(att => att.content_type?.startsWith("image"));

                    if (!imageAttachments || imageAttachments.length === 0) return;

                    const searchLabel = "SauceNAO";
                    const icon = c.getAssetIDByName("ic_search");

                    const onPress = () => {
                        if (imageAttachments.length === 1) {
                            const searchEngineUrl = `${selectedSearchUrl}/search.php?url=${encodeURIComponent(imageAttachments[0].url)}`;
                            t.url.openURL(searchEngineUrl);
                        } else {
                            const links = imageAttachments.map((att, index) => `> [Image ${index + 1}](${selectedSearchUrl}/search.php?url=${encodeURIComponent(att.url)})`).join("\n");
                            t.FluxDispatcher.dispatch({
                                type: "MESSAGE_UPDATE",
                                message: { ...message, content: links, guild_id: V.getChannel(message.channel_id).guild_id },
                                log_edit: !1
                            });
                        }
                        M.hideActionSheet();
                    };

                    buttonRow.splice(re, 0, t.React.createElement(P, {
                        label: searchLabel,
                        icon: t.React.createElement(P.Icon, { source: icon, IconComponent: () => t.React.createElement(t.ReactNative.Image, { resizeMode: "cover", style: z.iconComponent, source: icon }) }),
                        onPress
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
        onLoad: function() { return b = [addReverseImageSearchButton()]; },
        onUnload: function() { for (const e of b) e(); },
        settings: SettingsPage
    };

    return f.default = ne, Object.defineProperty(f, "__esModule", { value: !0 }), f
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta, vendetta.commands, vendetta.ui.alerts);
