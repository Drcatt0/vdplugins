(function(f, g, h) {
    "use strict";

    const { ScrollView, Forms } = h.ui;
    const { FormRow, FormSection, FormIcon } = Forms;
    const FolderRenderer = g.findByProps("renderFolderIcon");
    const ImagePicker = g.findByProps("launchImageLibrary");
    const patcher = h.patcher;

    const settings = h.storage || { image: null };

    function patchFolderIcons() {
        if (!FolderRenderer || !FolderRenderer.default) {
            h.ui.alerts.showToast("Unable to patch folder icons. Component not found.");
            return;
        }

        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            if (settings.image) {
                res.props.children = h.React.createElement("img", {
                    src: settings.image,
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
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
                        ImagePicker.launchImageLibrary({}, (response) => {
                            if (!response || response.didCancel || response.error) return;
                            settings.image = `data:image/jpeg;base64,${response.data}`;
                            h.ui.alerts.showToast("Icon uploaded successfully!");
                        });
                    },
                }),
                h.React.createElement(FormRow, {
                    label: "Clear Folder Icon",
                    onPress: () => {
                        settings.image = null;
                        h.ui.alerts.showToast("Folder icon cleared.");
                    },
                })
            )
        );
    }

    f.onLoad = () => {
        patchFolderIcons();
    };

    f.onUnload = () => {
        patcher.unpatchAll("renderFolderIcon");
    };

    f.settings = SettingsPage;

})(vendetta.plugin, vendetta.metro, vendetta);
