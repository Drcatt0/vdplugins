(function(f, g, h) {
    "use strict";

    const { ScrollView, Forms, Alerts } = h.ui;
    const { FormRow, FormSection, FormIcon } = Forms;
    const { patcher } = h;
    const FolderRenderer = g.findByProps("renderFolderIcon");
    const ImagePicker = g.findByProps("launchImageLibrary");

    const settings = h.storage || { image: null };

    // Hook into folder rendering
    function patchFolderIcons() {
        if (!FolderRenderer) {
            Alerts.showToast("Failed to locate folder renderer.");
            return;
        }

        patcher.after("renderFolderIcon", FolderRenderer, "default", (args, res) => {
            if (settings.image) {
                res.props.children = (
                    <img
                        src={settings.image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                );
            }
            return res;
        });
    }

    // Plugin settings page
    function SettingsPage() {
        return (
            <ScrollView>
                <FormSection title="Folder Icon Settings">
                    <FormRow
                        label="Upload Folder Icon"
                        onPress={() => {
                            ImagePicker.launchImageLibrary({}, (response) => {
                                if (!response || response.didCancel || response.error) return;
                                settings.image = `data:image/jpeg;base64,${response.data}`;
                                Alerts.showToast("Folder Icon Updated!");
                            });
                        }}
                        leading={
                            settings.image ? (
                                <FormIcon source={{ uri: settings.image }} />
                            ) : (
                                <FormIcon name="ic_add_24px" />
                            )
                        }
                    />
                    <FormRow
                        label="Clear Icon"
                        onPress={() => {
                            settings.image = null;
                            Alerts.showToast("Folder Icon Cleared!");
                        }}
                    />
                </FormSection>
            </ScrollView>
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
