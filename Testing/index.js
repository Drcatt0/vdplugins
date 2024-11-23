(function(f, g, h) {
    "use strict";

    const patcher = h.patcher;
    const FolderRenderer = g.findByProps("renderFolderIcon");
    const settings = h.storage || { image: null };

    function debugHook() {
        if (!FolderRenderer || !FolderRenderer.default) {
            console.error("[FolderIconChanger] FolderRenderer not found.");
            h.ui.alerts.showToast("FolderRenderer not found.");
            return;
        }

        console.log("[FolderIconChanger] Patching FolderRenderer...");
        h.ui.alerts.showToast("Patching FolderRenderer...");

        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            console.log("[FolderIconChanger] renderFolderIcon called.");
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
            h.ui.ScrollView,
            null,
            h.React.createElement(
                h.ui.Forms.FormSection,
                { title: "Folder Icon Settings" },
                h.React.createElement(h.ui.Forms.FormRow, {
                    label: "Set Folder Icon",
                    onPress: () => {
                        settings.image = "https://via.placeholder.com/100"; // Placeholder for testing
                        h.ui.alerts.showToast("Folder icon set!");
                    },
                }),
                h.React.createElement(h.ui.Forms.FormRow, {
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
        console.log("[FolderIconChanger] Plugin loaded.");
        debugHook();
    };

    f.onUnload = () => {
        patcher.unpatchAll("renderFolderIcon");
        console.log("[FolderIconChanger] Plugin unloaded.");
    };

    f.settings = SettingsPage;

})(vendetta.plugin, vendetta.metro, vendetta);
