(function(p, r, s, e, u, D, S) {
    "use strict";

    const { getGuildFolders } = s.findByStoreName("UserSettingsProtoStore");
    const { isFolderExpanded } = s.findByStoreName("ExpandedGuildFolderStore");
    const FluxDispatcher = e.FluxDispatcher;
    const { FormRow, FormSwitch, FormTextInput } = D.Forms;
    const { ScrollView } = e.ReactNative;
    const { useState } = e.React;

    // Initialize storage for settings
    r.storage.autoCollapse ??= true;
    r.storage.folderIcons ??= {};

    function toggleAutoCollapse() {
        const expandedFolders = getGuildFolders().filter((folder) => folder.folderId && isFolderExpanded(folder.folderId));
        if (expandedFolders.length > 1) {
            expandedFolders.slice(1).forEach((folder) => {
                FluxDispatcher.dispatch({ type: "TOGGLE_GUILD_FOLDER_EXPAND", folderId: folder.folderId });
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
                FluxDispatcher.dispatch({
                    type: "CUSTOM_FOLDER_ICON_UPDATE",
                    folderId: folder.folderId,
                    icon: customIcon,
                });
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
                    <FormTextInput
                        placeholder="Paste icon URL"
                        value={icon}
                        onChange={handleIconChange}
                    />
                }
            />
        );
    };

    function SettingsPanel() {
        const folders = getGuildFolders().filter((folder) => folder.folderId);

        return (
            <ScrollView style={{ flex: 1, marginTop: 10 }}>
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
                {folders.map((folder) => (
                    <FolderSettingsRow key={folder.folderId} folder={folder} />
                ))}
            </ScrollView>
        );
    }

    var plugin = {
        onLoad: function () {
            FluxDispatcher.subscribe("TOGGLE_GUILD_FOLDER_EXPAND", onFolderToggle);
            applyCustomIcons();
        },
        onUnload: function () {
            FluxDispatcher.unsubscribe("TOGGLE_GUILD_FOLDER_EXPAND", onFolderToggle);
        },
        settings: SettingsPanel,
    };

    return (p.default = plugin), Object.defineProperty(p, "__esModule", { value: !0 }), p;
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.ui.assets, vendetta.ui.components, vendetta.storage);
