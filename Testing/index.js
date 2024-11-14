(function (f, L, g, t, B, C, c, d, F, D, G, k, O, E) {
    "use strict";
    const defaultSearchEngines = {
        SauceNAO: "https://saucenao.com",
        Google: "https://images.google.com",
        TinEye: "https://tineye.com",
        FuzzySearch: "https://api-next.fuzzysearch.net/v1/url?url="
    };

    // Variable to store the currently selected search engine URL, defaults to SauceNAO
    let selectedSearchEngine = "SauceNAO";

    var w = {
        translate: async function (e) {
            let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto",
                i = arguments.length > 2 ? arguments[2] : void 0,
                s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
            try {
                if (s) return { source_lang: a, text: e };
                const n = await (await fetch(defaultSearchEngines[selectedSearchEngine], {
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
    }, y;

    const M = g.findByProps("openLazy", "hideActionSheet"),
          P = ((y = g.findByProps("ActionSheetRow")) === null || y === void 0 ? void 0 : y.ActionSheetRow) ?? d.Forms.FormRow,
          j = g.findByStoreName("MessageStore"),
          V = g.findByStoreName("ChannelStore"),
          z = t.stylesheet.createThemedStyleSheet({ iconComponent: { width: 24, height: 24, tintColor: C.semanticColors.INTERACTIVE_NORMAL } });

    let T = [];

    async function processWithFuzzySearch(url) {
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
    }

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
                    const S = u?.id ?? n.id,
                          se = u?.content ?? n.content,
                          _ = "SauceNAO",
                          icon = c.getAssetIDByName("ic_search"),
                          oe = async function () {
                              if (selectedSearchEngine === "FuzzySearch") {
                                  const searchUrl = await processWithFuzzySearch(imageAttachments[0].url);
                                  t.url.openURL(searchUrl);
                              } else {
                                  const searchUrl = `${defaultSearchEngines[selectedSearchEngine]}/search.php?url=${encodeURIComponent(imageAttachments[0].url)}`;
                                  t.url.openURL(searchUrl);
                              }
                              M.hideActionSheet();
                          };
                    v.splice(re, 0, t.React.createElement(P, {
                        label: selectedSearchEngine,
                        icon: t.React.createElement(P.Icon, {
                            source: icon,
                            IconComponent: function () { return t.React.createElement(t.ReactNative.Image, { resizeMode: "cover", style: z.iconComponent, source: icon }); }
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
                .map(([name, url]) => t.React.createElement(FormRow, {
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
