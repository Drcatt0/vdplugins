(function (c, p, y, d, u, r, w, b) {
    "use strict";

    const { FormSection, FormRow, FormTextInput, FormSwitch } = u.Forms;
    const { useState } = u.React;
    const { getGuildFolders } = d.findByStoreName("UserSettingsProtoStore");
    const { isFolderExpanded } = d.findByStoreName("ExpandedGuildFolderStore");
    const FluxDispatcher = d.findByProps("dispatch", "subscribe");

    // Storage for settings
    const Settings = r.createProxy({(function (p, r, s, e, u, E, D, S, P) {
    "use strict";

    const { getGuildFolders } = s.findByStoreName("UserSettingsProtoStore");
    const { isFolderExpanded } = s.findByStoreName("ExpandedGuildFolderStore");
    const FluxDispatcher = e.FluxDispatcher;
    const { View, Image } = D.General;
    const { FormSwitch, FormRow, FormIcon, FormTextInput } = D.Forms;
    const { ScrollView } = e.ReactNative;
    const { useState } = e.React;

    r.storage.autoCollapse ??= false;
    r.storage.hideIcons ??= false;
    r.storage.folderIcons ??= {};

    function applyCustomIcons() {
        getGuildFolders().forEach((folder) => {
            if (r.storage.folderIcons[folder.folderId]) {
                FluxDispatcher.dispatch({
                    type: "CUSTOM_FOLDER_ICON_UPDATE",
                    folderId: folder.folderId,
                    icon: r.storage.folderIcons[folder.folderId],
                });
            }
        });
    }

    function y() {
        getGuildFolders()
            .filter((folder) => folder.folderId && !isFolderExpanded(folder.folderId))
            .forEach((folder) => {
                FluxDispatcher.dispatch({
                    type: "TOGGLE_GUILD_FOLDER_EXPAND",
                    folderId: folder.folderId,
                });
                FluxDispatcher.dispatch({
                    type: "TOGGLE_GUILD_FOLDER_EXPAND",
                    folderId: folder.folderId,
                });
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

    function A() {
        let unpatch = E.after(
            "GuildContainer",
            s.findByPropsAll("GuildContainer").at(-1),
            function ([{ children }], res) {
                const folder = children?.props?.folder;
                if (folder && r.storage.folderIcons[folder.folderId]) {
                    const customIcon = r.storage.folderIcons[folder.folderId];
                    const iconStyle = {
                        overflow: "hidden",
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 48,
                        width: 48,
                    };

                    const icon = React.createElement(Image, {
                        source: { uri: customIcon },
                        style: { tintColor: folder.folderColor ? `#${folder.folderColor.toString(16)}` : undefined },
                    });

                    res.children = React.createElement(View, { style: iconStyle }, icon);
                }
            }
        );
        return y(), function () {
            setTimeout(function () {
                return y();
            }, 100);
            unpatch();
        };
    }

    function X() {
        S.useProxy(r.storage);
        const [autoCollapse, setAutoCollapse] = useState(r.storage.autoCollapse);
        const [hideIcons, setHideIcons] = useState(r.storage.hideIcons);
        const folders = getGuildFolders().filter((folder) => folder.folderId);

        function toggleAutoCollapse() {
            r.storage.autoCollapse = !r.storage.autoCollapse;
            setAutoCollapse(r.storage.autoCollapse);
        }

        function toggleHideIcons() {
            r.storage.hideIcons = !r.storage.hideIcons;
            setHideIcons(r.storage.hideIcons);
        }

        return (
            <ScrollView style={{ flex: 1, marginTop: 10 }}>
                <FormRow
                    label="Auto Collapse Folders"
                    subLabel="Automatically collapse other folders when expanding one."
                    trailing={
                        <FormSwitch
                            value={autoCollapse}
                            onValueChange={toggleAutoCollapse}
                        />
                    }
                />
                <FormRow
                    label="Hide Folder Icons"
                    subLabel="Hide server icons for collapsed folders."
                    trailing={
                        <FormSwitch
                            value={hideIcons}
                            onValueChange={toggleHideIcons}
                        />
                    }
                />
                {folders.map((folder) => (
                    <FolderSettingsRow key={folder.folderId} folder={folder} />
                ))}
            </ScrollView>
        );
    }

    let unpatches = [];

    var j = {
        onLoad: function () {
            unpatches.push(A());
        },
        onUnload: function () {
            for (const unpatch of unpatches) unpatch();
            unpatches = [];
        },
        settings: X,
    };

    return (p.default = j), Object.defineProperty(p, "__esModule", { value: !0 }), p;
})(
    {},
    vendetta.plugin,
    vendetta.metro,
    vendetta.metro.common,
    vendetta.ui.assets,
    vendetta.patcher,
    vendetta.ui.components,
    vendetta.storage,
    vendetta.ui
);

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
