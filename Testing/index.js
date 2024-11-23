(function(c, p, y, d, u, r, w, b) {
    "use strict";

    const { ScrollView } = u.General;
    const { FormSection, FormRow, FormIcon } = u.Forms;
    const ImagePicker = d.findByProps("launchImageLibrary");
    const patcher = y.patcher;
    const FolderRenderer = d.findByProps("renderFolderIcon");

    r.storage ??= { image: null };

    function patchFolderIcons() {
        if (!FolderRenderer || !FolderRenderer.default) {
            u.alerts.showToast("FolderRenderer not found.");
            return;
        }

        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            if (r.storage.image) {
                res.props.children = React.createElement("img", {
                    src: r.storage.image,
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
        return React.createElement(
            ScrollView,
            null,
            React.createElement(
                FormSection,
                { title: "Folder Icon Settings", titleStyleType: "no_border" },
                React.createElement(FormRow, {
                    label: "Upload Folder Icon",
                    subLabel: "Select an image to use as the folder icon.",
                    leading: React.createElement(FormIcon, {
                        source: { uri: r.storage.image || "ic_add_24px" },
                    }),
                    onPress: () => {
                        ImagePicker.launchImageLibrary({}, (response) => {
                            if (!response || response.didCancel || response.error) return;
                            r.storage.image = `data:image/jpeg;base64,${response.data}`;
                            u.alerts.showToast("Folder icon updated!");
                        });
                    },
                })
            )
        );
    }

    const onLoad = () => {
        console.log("[FolderIconChanger] Plugin loaded.");
        patchFolderIcons();
    };

    const onUnload = () => {
        patcher.unpatchAll("renderFolderIcon");
        console.log("[FolderIconChanger] Plugin unloaded.");
    };

    return (c.onLoad = onLoad), (c.onUnload = onUnload), (c.settings = SettingsPage), c;
})({}, vendetta.commands, vendetta, vendetta.metro, vendetta.ui.components, vendetta.plugin, vendetta.storage, vendetta.ui.assets);
