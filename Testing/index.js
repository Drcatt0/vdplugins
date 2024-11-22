(function (c, p, y, d, u, r, w, b) {
    "use strict";

    const { findByStoreName, findByProps } = d;
    const { useState } = u.React;
    const { FormSwitch, FormSection, FormTextInput, FormRow, FormDivider } = u.Forms;

    const Settings = r.createProxy({ closeOnOpen: false, folders: {} });

    const getFolders = findByStoreName("UserSettingsProtoStore").getGuildFolders;
    const isFolderExpanded = findByStoreName("ExpandedGuildFolderStore").isFolderExpanded;
    const toggleFolderExpand = findByProps("toggleGuildFolderExpand").toggleGuildFolderExpand;

    const patchGuildFolders = () => {
        const originalToggleFolderExpand = toggleFolderExpand;

        toggleFolderExpand = (folderId) => {
            if (Settings.closeOnOpen) {
                const expandedFolders = getFolders().filter((f) => isFolderExpanded(f.folderId));
                expandedFolders.forEach((f) => {
                    if (f.folderId !== folderId) {
                        originalToggleFolderExpand(f.folderId);
                    }
                });
            }
            originalToggleFolderExpand(folderId);
        };
    };

    const FolderIconRow = ({ folder, onChange }) => {
        const [icon, setIcon] = useState(Settings.folders[folder.folderId]?.icon || "");

        const updateIcon = (newIcon) => {
            setIcon(newIcon);
            Settings.folders[folder.folderId] = { ...Settings.folders[folder.folderId], icon: newIcon };
            onChange(folder.folderId, newIcon);
        };

        return (
            <FormRow
                label={folder.name || `Folder ${folder.folderId}`}
                note="Set a custom icon for this folder."
                trailing={
                    <FormTextInput
                        placeholder="Paste image link or upload"
                        value={icon}
                        onChange={updateIcon}
                        style={{ flex: 1 }}
                    />
                }
            />
        );
    };

    const SettingsPanel = () => {
        const [closeOnOpen, setCloseOnOpen] = useState(Settings.closeOnOpen);
        const folders = getFolders().filter((f) => f.folderId); // Filter only folders

        const toggleCloseOnOpen = () => {
            const newState = !closeOnOpen;
            setCloseOnOpen(newState);
            Settings.closeOnOpen = newState;
        };

        const updateFolderIcon = (folderId, icon) => {
            Settings.folders[folderId] = { ...Settings.folders[folderId], icon };
        };

        return (
            <FormSection title="BetterFolders Settings">
                <FormSwitch
                    label="Close other folders on open"
                    note="Automatically close other folders when opening a new folder."
                    value={closeOnOpen}
                    onValueChange={toggleCloseOnOpen}
                />
                <FormDivider />
                {folders.map((folder) => (
                    <FolderIconRow key={folder.folderId} folder={folder} onChange={updateFolderIcon} />
                ))}
            </FormSection>
        );
    };

    const applyCustomIcons = () => {
        const guildFolders = getFolders();

        guildFolders.forEach((folder) => {
            const customIcon = Settings.folders[folder.folderId]?.icon;

            if (customIcon) {
                // Patch the UI to display custom icons (example implementation, dependent on UI structure)
                // Implement logic to patch folder rendering with custom icons
            }
        });
    };

    const onLoad = () => {
        patchGuildFolders();
        applyCustomIcons();
    };

    const onUnload = () => {
        toggleFolderExpand = findByProps("toggleGuildFolderExpand").toggleGuildFolderExpand; // Restore original function
    };

    return {
        onLoad,
        onUnload,
        SettingsPanel,
    };
})(vendetta.plugin, vendetta.metro, vendetta.ui, vendetta.storage, vendetta.ui.components);
