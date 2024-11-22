(function (c, p, y, d, u, r, w, b) {
    "use strict";

    const { FormSection, FormRow, FormTextInput, FormSwitch } = u.Forms;
    const { useState } = u.React;
    const { getGuildFolders } = d.findByStoreName("UserSettingsProtoStore");
    const { isFolderExpanded } = d.findByStoreName("ExpandedGuildFolderStore");
    const FluxDispatcher = d.findByProps("dispatch", "subscribe");

    // Storage for settings
    const Settings = r.createProxy({
        autoCollapse: false,
        folders: {},
    });

    const toggleFolderExpand = (folderId) => {
        if (Settings.autoCollapse) {
            const expandedFolders = getGuildFolders().filter((folder) =>
                isFolderExpanded(folder.folderId)
            );
            expandedFolders.forEach((folder) => {
                if (folder.folderId !== folderId) {
                    FluxDispatcher.dispatch({
                        type: "TOGGLE_GUILD_FOLDER_EXPAND",
                        folderId: folder.folderId,
                    });
                }
            });
        }

        FluxDispatcher.dispatch({
            type: "TOGGLE_GUILD_FOLDER_EXPAND",
            folderId,
        });
    };

    const applyCustomIcons = () => {
        const guildFolders = getGuildFolders();
        guildFolders.forEach((folder) => {
            const customIcon = Settings.folders[folder.folderId]?.icon;
            if (customIcon) {
                // Patch the UI to use custom icons (implementation will depend on folder UI structure)
                console.log(`Applying custom icon for folder ${folder.folderId}: ${customIcon}`);
            }
        });
    };

    const FolderSettingsRow = ({ folder }) => {
        const [icon, setIcon] = useState(Settings.folders[folder.folderId]?.icon || "");

        const handleIconChange = (value) => {
            setIcon(value);
            Settings.folders[folder.folderId] = {
                ...Settings.folders[folder.folderId],
                icon: value,
            };
            applyCustomIcons();
        };

        return (
            <FormRow
                label={`Folder: ${folder.name || `Unnamed (${folder.folderId})`}`}
                trailing={
                    <FormTextInput
                        placeholder="Paste icon URL"
                        value={icon}
                        onChange={handleIconChange}
                    />
                }
            />
        );
    };

    const SettingsPanel = () => {
        const folders = getGuildFolders().filter((folder) => folder.folderId);

        return (
            <FormSection title="Folder Settings">
                <FormSwitch
                    label="Auto Collapse Folders"
                    value={Settings.autoCollapse}
                    onValueChange={(value) => {
                        Settings.autoCollapse = value;
                    }}
                />
                {folders.map((folder) => (
                    <FolderSettingsRow key={folder.folderId} folder={folder} />
                ))}
            </FormSection>
        );
    };

    const onLoad = () => {
        // Automatically apply custom icons when the plugin is loaded
        applyCustomIcons();
    };

    const onUnload = () => {
        // Clean up any patches or changes made
        console.log("BetterFolders plugin unloaded.");
    };

    return {
        onLoad,
        onUnload,
        settings: SettingsPanel,
    };
})(vendetta.plugin, vendetta.metro, vendetta.ui, vendetta.storage, vendetta.ui.components);
