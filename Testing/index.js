(function (p, r, s, e, u, D, S) {
    "use strict";

    const { getGuildFolders } = s.findByStoreName("UserSettingsProtoStore");
    const { isFolderExpanded } = s.findByStoreName("ExpandedGuildFolderStore");
    const { FormRow, FormTextInput, FormSwitch, FormIcon, FormSection, FormFileRow } = D.Forms;
    const { ScrollView } = e.ReactNative;
    const { useState } = e.React;

    // Initialize storage for settings
    r.storage.folderIcons ??= {};
    r.storage.autoCollapse ??= true;

    // Toggle folder auto-collapse functionality
    function toggleAutoCollapse() {
        const expandedFolders = getGuildFolders().filter((folder) => folder.folderId && isFolderExpanded(folder.folderId));
        if (expandedFolders.length > 1) {
            expandedFolders.slice(1).forEach((folder) => {
                e.FluxDispatcher.dispatch({ type: "TOGGLE_GUILD_FOLDER_EXPAND", folderId: folder.folderId });
            });
        }
    }

    function onFolderToggle(action) {
        const { folderId } = action;
        if (r.storage.autoCollapse && isFolderExpanded(folderId)) {
            toggleAutoCollapse();
        }
    }

    function applyCustomIcons() {
        const folders = getGuildFolders();
        folders.forEach((folder) => {
            const customIcon = r.storage.folderIcons[folder.folderId];
            if (customIcon) {
                // Apply custom folder icons logic here
                // Example: Dispatch a custom action to update folder UI (mocked)
                console.log(`Applying custom icon for folder ${folder.folderId}: ${customIcon}`);
            }
        });
    }

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
            e.FluxDispatcher.subscribe("TOGGLE_GUILD_FOLDER_EXPAND", onFolderToggle);
            applyCustomIcons();
        },
        onUnload: function () {
            e.FluxDispatcher.unsubscribe("TOGGLE_GUILD_FOLDER_EXPAND", onFolderToggle);
        },
        settings: SettingsPanel,
    };

    return (p.default = plugin), Object.defineProperty(p, "__esModule", { value: true }), p;
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);
