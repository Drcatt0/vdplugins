(function (p, r, s, e, u, D, S) {
    "use strict";

    const { getGuildFolders } = s.findByStoreName("UserSettingsProtoStore");
    const { isFolderExpanded } = s.findByStoreName("ExpandedGuildFolderStore");
    const { FormRow, FormTextInput, FormSwitch, FormSection, FormFileRow } = D.Forms;
    const { ScrollView } = e.ReactNative;
    const { useState } = e.React;

    // Initialize storage for settings
    r.storage.folderIcons ??= {};
    r.storage.autoCollapse ??= true;

    /**
     * Toggles the auto-collapse functionality for guild folders.
     */
    function toggleAutoCollapse() {
        const expandedFolders = getGuildFolders().filter((folder) => folder.folderId && isFolderExpanded(folder.folderId));
        if (expandedFolders.length > 1) {
            expandedFolders.slice(1).forEach((folder) => {
                e.FluxDispatcher.dispatch({ type: "TOGGLE_GUILD_FOLDER_EXPAND", folderId: folder.folderId });
            });
        }
    }

    /**
     * Applies custom folder icons from storage to the guild folders.
     */
    function applyCustomIcons() {
        const folders = getGuildFolders();
        folders.forEach((folder) => {
            const customIcon = r.storage.folderIcons[folder.folderId];
            if (customIcon) {
                // Dispatch custom actions to update folder UI
                e.FluxDispatcher.dispatch({
                    type: "SET_CUSTOM_FOLDER_ICON",
                    folderId: folder.folderId,
                    iconUrl: customIcon,
                });
            }
        });
    }

    /**
     * React component for folder settings row.
     * @param {Object} folder The folder object.
     */
    const FolderSettingsRow = ({ folder }) => {
        const [icon, setIcon] = useState(r.storage.folderIcons[folder.folderId] || "");

        const handleIconChange = (value) => {
            setIcon(value);
            r.storage.folderIcons[folder.folderId] = value;
            applyCustomIcons();
        };

        return (
            <FormRow
                label={`Folder: ${folder.name || `Unnamed (${folder.folderId})`}`}
                trailing={
                    <>
                        <FormTextInput
                            placeholder="Paste icon URL"
                            value={icon}
                            onChange={handleIconChange}
                        />
                        <FormFileRow
                            label="Upload Icon"
                            onUpload={(file) => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const fileDataUrl = event.target.result;
                                    setIcon(fileDataUrl);
                                    r.storage.folderIcons[folder.folderId] = fileDataUrl;
                                    applyCustomIcons();
                                };
                                reader.readAsDataURL(file);
                            }}
                        />
                    </>
                }
            />
        );
    };

    /**
     * Settings page for managing plugin options.
     */
    function SettingsPanel() {
        const folders = getGuildFolders().filter((folder) => folder.folderId);

        return (
            <ScrollView style={{ flex: 1, marginTop: 10 }}>
                <FormSection title="Folder Settings">
                    <FormRow
                        label="Auto Collapse Folders"
                        subLabel="Automatically collapse other folders when expanding one."
                        trailing={
                            <FormSwitch
                                value={r.storage.autoCollapse}
                                onValueChange={() => {
                                    r.storage.autoCollapse = !r.storage.autoCollapse;
                                }}
                            />
                        }
                    />
                </FormSection>
                <FormSection title="Custom Folder Icons">
                    {folders.map((folder) => (
                        <FolderSettingsRow key={folder.folderId} folder={folder} />
                    ))}
                </FormSection>
            </ScrollView>
        );
    }

    var plugin = {
        onLoad: function () {
            e.FluxDispatcher.subscribe("TOGGLE_GUILD_FOLDER_EXPAND", toggleAutoCollapse);
            applyCustomIcons();
        },
        onUnload: function () {
            e.FluxDispatcher.unsubscribe("TOGGLE_GUILD_FOLDER_EXPAND", toggleAutoCollapse);
        },
        settings: SettingsPanel,
    };

    return (p.default = plugin), Object.defineProperty(p, "__esModule", { value: true }), p;
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);
