(function (exports, api, metro, common, plugin, lazy) {
  "use strict";

  // ––– Storage Manager (from your provided code) –––
  function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor))
      throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    return Constructor;
  }
  function _define_property(obj, key, value) {
    return key in obj
      ? Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true })
      : (obj[key] = value), obj;
  }
  
  var StorageManager = function () {
    function StorageManager2(options) {
      _class_call_check(this, StorageManager2);
      _define_property(this, "_storage", void 0);
      _define_property(this, "_migrations", void 0);
      _define_property(this, "version", void 0);
      this._storage = options.storage;
      this.version = options.version;
      this._migrations = options.migrations;
      if (!this._storage.version) {
        var newStorage = options.initialize();
        for (var key in newStorage) this._storage[key] = newStorage[key];
      }
      if (this.version < this._storage.version)
        throw new Error("The supported version is lower than the current storage version");
      if (this.version > this._storage.version) this.migrate();
    }
    _create_class(StorageManager2, [
      {
        key: "migrate",
        value: function () {
          for (
            var migrationStorage = this._storage,
              currentVersion = migrationStorage.version;
            currentVersion < this.version;
            currentVersion++
          ) {
            var migration = this._migrations[currentVersion];
            migrationStorage = migration(migrationStorage);
            migrationStorage.version = currentVersion + 1;
          }
          for (var key in migrationStorage) this._storage[key] = migrationStorage[key];
        },
      },
      {
        key: "set",
        value: function (path, value) {
          for (
            var currentNode = this._storage, steps = path.split("."), i = 0;
            i < steps.length;
            i++
          ) {
            var nextKey = steps[i];
            if (i === steps.length - 1) currentNode[nextKey] = value;
            else if (nextKey in currentNode) currentNode = currentNode[nextKey];
            else {
              var node = {};
              currentNode[nextKey] = node;
              currentNode = node;
            }
          }
          return this;
        },
      },
      {
        key: "get",
        value: function (path) {
          var currentNode;
          for (var _i = 0, _a = path.split("."); _i < _a.length; _i++) {
            var nextKey = _a[_i];
            var node = currentNode ?? this._storage;
            if (nextKey in node) currentNode = node[nextKey];
            else return;
          }
          return currentNode;
        },
      },
      {
        key: "getFirstDefined",
        value: function () {
          for (var _i = 0; _i < arguments.length; _i++) {
            var path = arguments[_i];
            var value = this.get(path);
            if (value !== void 0) return value;
          }
        },
      },
      {
        key: "setIfNotDefined",
        value: function (path, valueCb) {
          if (this.get(path) === void 0) this.set(path, valueCb());
          return this;
        },
      },
      {
        key: "unset",
        value: function (path) {
          var currentNode;
          for (var steps = path.split("."), i = 0; i < steps.length; i++) {
            var nextKey = steps[i];
            if (i === steps.length - 1)
              return delete currentNode[nextKey], true;
            var node = currentNode ?? this._storage;
            if (nextKey in node) currentNode = node[nextKey];
            else return false;
          }
        },
      },
    ]);
    return StorageManager2;
  }();

  // Initialize storage with our options.
  var storage = new StorageManager({
    storage: plugin.storage,
    initialize: function () {
      return {
        version: 3,
        // Use "show.profile": true to indicate that the profile button should be injected.
        show: { profile: true, thread: false },
        hide: { app: true, gift: true, thread: true, voice: true },
        neverDismiss: true,
      };
    },
    version: 3,
    migrations: {
      1: function (oldStorage) {
        // Migration code here if needed.
        return oldStorage;
      },
      2: function (old) {
        return old;
      },
    },
  });

  var unpatches = [];

  // Lazy helpers from BunnyPlugins:
  var _a,
    { factories: { createFilterDefinition }, lazy: { createLazyModule } } = metro;
  var byTypeDisplayName = createFilterDefinition(
    function ([name], m) {
      return m && m.type && m.type.displayName === name;
    },
    function ([name]) {
      return "palmdevs.byTypeDisplayName(" + name + ")";
    }
  );
  var findByTypeDisplayNameLazy = function (displayName, expDefault) {
    if (expDefault === void 0) expDefault = true;
    return createLazyModule(expDefault ? byTypeDisplayName(displayName) : byTypeDisplayName.byRaw(displayName));
  };

  // Retrieve candidate components.
  var ChatInputActions = findByTypeDisplayNameLazy("ChatInputActions");
  var ChatInputSendButton = findByTypeDisplayNameLazy("ChatInputSendButton");

  // (Keep existing patches from your plugin for other buttons.)
  unpatches.push(
    api.patcher.before("render", ChatInputSendButton.type, function ([props]) {
      if (props.canSendVoiceMessage)
        props.canSendVoiceMessage = !storage.get("hide.voice");
    })
  );
  unpatches.push(
    api.patcher.before("render", ChatInputActions.type, function ([props]) {
      if (props.isAppLauncherEnabled)
        props.isAppLauncherEnabled = !storage.get("hide.app");
      props.canStartThreads = storage.get("show.thread") || !storage.get("hide.thread");
      props.forceShowActions = storage.get("neverDismiss");
      props.shouldShowGiftButton = !storage.get("hide.gift");

      // Inject the profile button only if the option is enabled.
      if (props.children && Array.isArray(props.children) && storage.get("show.profile")) {
        var currentUser = metro.findByProps("getCurrentUser").getCurrentUser();
        if (currentUser && currentUser.avatar) {
          var avatarUrl =
            "https://cdn.discordapp.com/avatars/" +
            currentUser.id +
            "/" +
            currentUser.avatar +
            ".png?size=40";
          var profileButton = common.React.createElement(
            common.TouchableOpacity,
            {
              onPress: function () {
                var ProfileModule = metro.findByProps("openProfileSheet");
                if (ProfileModule && typeof ProfileModule.openProfileSheet === "function")
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
          // Only add if it hasn't been added yet.
          if (!props.children.some(function (child) {
              return child && child.key === "profile-button";
            }))
            props.children.unshift(profileButton);
        }
      }
    })
  );

  // Settings UI using your existing style.
  var Stack = findByTypeDisplayNameLazy("Stack");
  var index = {
    onLoad: function () {
      // Patches are already applied above.
    },
    onUnload: function () {
      unpatches.forEach(function (unpatch) {
        unpatch();
      });
    },
    settings: function () {
      var _a = common.React.useReducer(function (x) {
          return ~x;
        }, 0),
        _ = _a[0],
        forceUpdate = _a[1];
      return common.React.createElement(
        common.ReactNative.ScrollView,
        { style: { flex: 1 } },
        common.React.createElement(
          Stack,
          { style: { paddingVertical: 24, paddingHorizontal: 12 }, spacing: 24 },
          common.React.createElement(
            common.TableRowGroup,
            { title: "Show Buttons" },
            // Add a new row for the profile button toggle.
            common.React.createElement(common.TableSwitchRow, {
              icon: common.React.createElement(common.TableRow.Icon, { source: api.assets.findAssetId("ic_profile") }),
              label: "Show Profile Button",
              value: storage.get("show.profile"),
              onValueChange: function (v) {
                storage.set("show.profile", v);
                forceUpdate();
              },
            })
          ),
          common.React.createElement(
            common.TableRowGroup,
            { title: "Force Show Buttons" },
            common.React.createElement(common.TableSwitchRow, {
              icon: common.React.createElement(common.TableRow.Icon, { source: api.assets.findAssetId("ThreadPlusIcon") }),
              label: "Force show New Thread button",
              subLabel:
                "Show the thread button even when you can't start threads, or when the chat input is not focused",
              value: storage.get("show.thread"),
              onValueChange: function (v) {
                storage.set("show.thread", v);
                forceUpdate();
              },
            })
          )
        )
      );
    },
  };

  exports.default = index;
  exports.storage = storage;
  Object.defineProperty(exports, "__esModule", { value: true });
})(exports, bunny.api, bunny.metro, bunny.metro.common, vendetta.plugin, bunny.utils.lazy);
