(function (exports, api, metro, common, plugin, lazy) {
  "use strict";

  // Initialize storage with "show.profile" option.
  var storage = new (function StorageManager(options) {
    this._storage = options.storage;
    this.version = options.version;
    this._migrations = options.migrations;

    if (!this._storage.version) {
      var newStorage = options.initialize();
      for (var key in newStorage) this._storage[key] = newStorage[key];
    }
    if (this.version < this._storage.version)
      throw new Error("Unsupported storage version");
    if (this.version > this._storage.version) this.migrate();
  })({
    storage: plugin.storage,
    initialize: function () {
      return {
        version: 4,
        hide: { app: true, gift: true, thread: true, voice: true },
        show: { thread: false, profile: true }, // New: Profile button toggle
        neverDismiss: true,
      };
    },
    version: 4,
    migrations: {
      1: function (oldStorage) {
        return oldStorage;
      },
      2: function (old) {
        return old;
      },
    },
  });

  var unpatches = [];

  // Lazy load utilities
  var { factories: { createFilterDefinition }, lazy: { createLazyModule } } = metro;
  var byTypeDisplayName = createFilterDefinition(
    ([name], m) => m?.type?.displayName === name,
    ([name]) => `palmdevs.byTypeDisplayName(${name})`
  );
  var findByTypeDisplayNameLazy = (displayName, expDefault = true) =>
    createLazyModule(expDefault ? byTypeDisplayName(displayName) : byTypeDisplayName.byRaw(displayName));

  // Get necessary modules
  var ChatInputActions = findByTypeDisplayNameLazy("ChatInputActions");
  var ChatInputSendButton = findByTypeDisplayNameLazy("ChatInputSendButton");
  var UserStore = metro.findByProps("getCurrentUser");
  var ProfileModule = metro.findByProps("openProfileSheet");

  // Helper: Generate avatar URL
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Inject the Profile Button
  function patchProfileButton() {
    if (!ChatInputActions || !ChatInputActions.type) return;
    let unp = api.patcher.before("render", ChatInputActions.type, ([props]) => {
      if (!props || !Array.isArray(props.children)) return;
      if (!storage.get("show.profile")) return; // Only inject if enabled

      const currentUser = UserStore.getCurrentUser();
      if (!currentUser || !currentUser.avatar) return;
      const avatarUrl = getUserAvatarUrl(currentUser, 40);

      const ProfileButton = common.React.createElement(
        common.TouchableOpacity,
        {
          onPress: () => {
            if (ProfileModule?.openProfileSheet)
              ProfileModule.openProfileSheet(currentUser.id);
          },
          style: { marginRight: 8 },
          key: "profile-button"
        },
        common.React.createElement(common.Image, {
          source: { uri: avatarUrl },
          style: { width: 32, height: 32, borderRadius: 16 }
        })
      );

      if (!props.children.some(child => child?.key === "profile-button")) {
        props.children.unshift(ProfileButton);
      }
    });

    unpatches.push(unp);
  }

  // Inject profile button when plugin loads
  function injectPatches() {
    patchProfileButton();
  }

  // Plugin lifecycle
  var index = {
    onLoad: function () {
      setTimeout(() => {
        injectPatches();
      }, 3000);
      console.log("Profile Button Plugin loaded");
    },
    onUnload: function () {
      unpatches.forEach(unp => unp());
      console.log("Profile Button Plugin unloaded");
    },
    settings: function () {
      var [_state, forceUpdate] = common.React.useReducer((x) => ~x, 0);
      return common.React.createElement(
        common.ReactNative.ScrollView,
        { style: { flex: 1 } },
        common.React.createElement(
          common.TableRowGroup,
          { title: "Show Buttons" },
          // Add a new row for the profile button toggle
          common.React.createElement(common.TableSwitchRow, {
            icon: common.React.createElement(common.TableRow.Icon, {
              source: api.assets.findAssetId("ic_profile"),
            }),
            label: "Show Profile Button",
            value: storage.get("show.profile"),
            onValueChange: (v) => {
              storage.set("show.profile", v);
              forceUpdate();
            },
          })
        ),
        common.React.createElement(
          common.TableRowGroup,
          { title: "Force Show Buttons" },
          common.React.createElement(common.TableSwitchRow, {
            icon: common.React.createElement(common.TableRow.Icon, {
              source: api.assets.findAssetId("ThreadPlusIcon"),
            }),
            label: "Force show New Thread button",
            subLabel:
              "Show the thread button even when you can't start threads, or when the chat input is not focused",
            value: storage.get("show.thread"),
            onValueChange: (v) => {
              storage.set("show.thread", v);
              forceUpdate();
            },
          })
        )
      );
    },
  };

  exports.default = index;
  exports.storage = storage;
  Object.defineProperty(exports, "__esModule", { value: true });

})(exports, bunny.api, bunny.metro, bunny.metro.common, vendetta.plugin, bunny.utils.lazy);
