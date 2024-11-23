(function(f, g, h) {
    "use strict";

    const { ScrollView } = h.ui.General;
    const { FormSection, FormRow, FormIcon } = h.ui.Forms;
    const patcher = h.patcher;
    const FolderRenderer = g.findByProps("renderFolderIcon");
    const ImagePicker = g.findByProps("launchImageLibrary");

    // Plugin storage
    h.storage ??= { image: null };

    function patchFolderIcons() {
        if (!FolderRenderer || !FolderRenderer.default) {
            console.error("[FolderIconChanger] FolderRenderer not found.");
            h.ui.alerts.showToast("FolderRenderer not found.");
            return;
        }

        console.log("[FolderIconChanger] Patching FolderRenderer...");
        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            if (h.storage.image) {
                res.props.children = h.React.createElement("img", {
                    src: h.storage.image,
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
                { title: "Folder Icon Settings", titleStyleType: "no_border" },
                h.React.createElement(FormRow, {
                    label: "Upload Folder Icon",
                    subLabel: "Choose an image to use as the folder icon.",
                    leading: h.React.createElement(FormIcon, {
                        source: { uri: h.storage.image || "ic_add_24px" },
                    }),
                    onPress: () => {
                        ImagePicker.launchImageLibrary({}, (response) => {
                            if (!response || response.didCancel || response.error) return;
                            h.storage.image = `data:image/jpeg;base64,${response.data}`;
                            h.ui.alerts.showToast("Folder icon uploaded successfully!");
                        });
                    },
                }),
                h.React.createElement(FormRow, {
                    label: "Clear Folder Icon",
                    subLabel: "Remove the custom folder icon.",
                    onPress: () => {
                        h.storage.image = null;
                        h.ui.alerts.showToast("Folder icon cleared.");
                    },
                })
            )
        );
    }

    f.onLoad = () => {
        console.log("[FolderIconChanger] Plugin loaded.");
        patchFolderIcons();
    };

    f.onUnload = () => {
        patcher.unpatchAll("renderFolderIcon");
        console.log("[FolderIconChanger] Plugin unloaded.");
    };

    f.settings = SettingsPage;

})(vendetta.plugin, vendetta.metro, vendetta);
