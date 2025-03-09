(function (exports, api, metro, common, plugin, lazy) {
  "use strict";

  console.log("🔄 [Profile Button Plugin] Initializing...");

  // Storage system
  var storage = new (function StorageManager(options) {
    this._storage = options.storage;
    this.version = options.version;
    this._migrations = options.migrations;

    if (!this._storage.version) {
      var newStorage = options.initialize();
      for (var key in newStorage) this._storage[key] = newStorage[key];
    }
    if (this.version < this._storage.version) throw new Error("Unsupported storage version");
    if (this.version > this._storage.version) this.migrate();
  })({
    storage: plugin.storage,
    initialize: function () {
      return {
        version: 5,
        hide: { app: true, gift: true, thread: true, voice: true },
        show: { thread: false, profile: true }, // Profile Button Toggle
        neverDismiss: true,
      };
    },
    version: 5,
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

  // Debugging
  function log(message) {
    console.log(`🛠️ [Profile Button Plugin] ${message}`);
  }

  // Load necessary Discord modules
  var ChatInputActions = metro.findByName("ChatInputActions") || metro.findByProps("renderSendButton");
  var UserStore = metro.findByProps("getCurrentUser");
  var ProfileModule = metro.findByProps("openProfileSheet");

  if (!ChatInputActions) log("⚠️ Could not find ChatInputActions!");
  if (!UserStore) log("⚠️ Could not find UserStore!");
  if (!ProfileModule) log("⚠️ Could not find ProfileModule!");

  // Helper: Get the user's avatar URL
  function getUserAvatarUrl(user, size = 40) {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  // Inject the Profile Button
  function patchProfileButton() {
    try {
      if (!ChatInputActions || !ChatInputActions.type) return;
      log("📌 Patching ChatInputActions...");

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

        // Ensure the button isn't added multiple times
        if (!props.children.some(child => child?.key === "profile-button")) {
          props.children.unshift(ProfileButton);
          log("✅ Profile Button added to Chat Bar!");
        }
      });

      unpatches.push(unp);
    } catch (err) {
      console.error("❌ [Profile Button Plugin] Failed to patch ChatInputActions:", err);
    }
  }

  // Inject profile button when plugin loads
  function injectPatches() {
    patchProfileButton();
  }

  // Plugin lifecycle
  var index = {
    onLoad: function () {
      log("🚀 Plugin loaded!");
      setTimeout(() => {
        injectPatches();
      }, 3000);
    },
    onUnload: function () {
      unpatches.forEach(unp => unp());
      log("🔄 Plugin unloaded!");
    },
    settings: function () {
      var [_state, forceUpdate] = common.React.useReducer((x) => ~x, 0);
      return common.React.createElement(
        common.ReactNative.ScrollView,
        { style: { flex: 1 } },
        common.React.createElement(
          common.TableRowGroup,
          { title: "Show Buttons" },
          // Profile button toggle
          common.React.createElement(common.TableSwitchRow, {
            icon: common.React.createElement(common.TableRow.Icon, {
              source: api.assets.findAssetId("ic_profile"),
            }),
            label: "Show Profile Button",
            value: storage.get("show.profile"),
            onValueChange: (v) => {
              storage.set("show.profile", v);
              forceUpdate();
              log(`🔧 Profile Button toggled: ${v}`);
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
