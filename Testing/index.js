(function(f, g, h) {
    "use strict";

    const { ScrollView, View, Forms } = h.ui;
    const { FormRow, FormSection, FormIcon } = Forms;
    const { findByProps, patcher } = g;
    const { launchImageLibrary } = findByProps("launchImageLibrary");
    const FolderRenderer = findByProps("renderFolderIcon");

    let settings = h.storage || { image: null };

    function updateFolderIcons() {
        if (!FolderRenderer) return;

        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            if (settings.image) {
                res.props.children = h.React.createElement("img", {
                    src: settings.image,
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                    },
                });
            }
            return res;
        });
    }

    function SettingsPage() {
        return h.React.createElement(
            ScrollView,
            null,
            h.React.createElement(
                FormSection,
                { title: "Folder Icon Settings" },
                h.React.createElement(FormRow, {
                    label: "Upload Folder Icon",
                    leading: h.React.createElement(FormIcon, {
                        source: { uri: settings.image || "ic_add_24px" },
                    }),
                    onPress: () => {
                        launchImageLibrary({}, (response) => {
                            if (!response || response.didCancel || response.error) return;
                            settings.image = `data:image/jpeg;base64,${response.data}`;
                        });
                    },
                }),
                h.React.createElement(FormRow, {
                    label: "Clear Icon",
                    onPress: () => {
                        settings.image = null;
                    },
                })
            )
        );
    }

    f.onLoad = () => {
        updateFolderIcons();
    };

    f.onUnload = () => {
        patcher.unpatchAll("renderFolderIcon");
    };

    f.settings = SettingsPage;

})(vendetta.plugin, vendetta.metro, vendetta);
