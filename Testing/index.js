(function(f, g, h) {
    "use strict";

    const { General, Forms, Alerts } = h.ui;
    const { ScrollView, View } = General;
    const { FormRow, FormSection, FormIcon } = Forms;
    const { launchImageLibrary } = g.findByProps("launchImageLibrary");
    const FolderComponent = g.findByProps("folderIcon");
    const patcher = h.patcher;

    // Plugin settings storage
    const settings = {
        image: null, // Base64 image URL
    };

    // Replace folder icons with the custom image
    function replaceFolderIcons() {
        patcher.before("renderFolder", FolderComponent, "folderIcon", (args) => {
            if (settings.image) {
                args[0].iconSource = { uri: settings.image };
            }
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
                            launchImageLibrary({}, (response) => {
                                if (!response || response.didCancel || response.error) return;
                                const base64Image = `data:image/jpeg;base64,${response.data}`;
                                settings.image = base64Image;
                                Alerts.showToast("Folder Icon Updated!");
                            });
                        }}
                        leading={<FormIcon source={{ uri: settings.image || "ic_add_24px" }} />}
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

    // Plugin lifecycle
    f.onLoad = function() {
        replaceFolderIcons();
    };

    f.onUnload = function() {
        patcher.unpatchAll("renderFolder");
    };

    f.settings = SettingsPage;

    return f;
})(vendetta.plugin, vendetta.metro, vendetta);
