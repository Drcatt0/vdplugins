(function(f, g, h, d, u, r, w, b) {
    "use strict";

    const { ScrollView } = u.General;
    const { FormSection, FormRow, FormIcon } = u.Forms;
    const patcher = h.patcher;
    const FolderRenderer = d.findByProps("renderFolderIcon");
    const ImagePicker = d.findByProps("launchImageLibrary");

    // Settings storage
    const settings = r.storage || { image: null };

    function patchFolderIcons() {
        if (!FolderRenderer || !FolderRenderer.default) {
            u.alerts.showToast("FolderRenderer not found.");
            return;
        }

        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            if (settings.image) {
                res.props.children = h.React.createElement("img", {
                    src: settings.image,
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                            u.alerts.showToast("Folder icon uploaded successfully!");
                        });
                    },
                }),
                h.React.createElement(FormRow, {
                    label: "Clear Folder Icon",
                    onPress: () => {
                        settings.image = null;
                        u.alerts.showToast("Folder icon cleared.");
                    },
                })
            )
        );
    }

    // Plugin lifecycle methods
    const onLoad = () => {
        patchFolderIcons();
    };

    const onUnload = () => {
        patcher.unpatchAll("renderFolderIcon");
    };

    return (f.onLoad = onLoad), (f.onUnload = onUnload), (f.settings = SettingsPage), f;
})({}, vendetta.plugin, vendetta, vendetta.metro, vendetta.ui.components, vendetta.storage, vendetta.ui.assets);
