(function (exports, api, metro, common, plugin, lazy) {
  "use strict";
  
  // ––– Storage Manager (as provided) –––
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
  
  // ––– Create storage with an added option for the profile button.
  var storage = new StorageManager({
    storage: plugin.storage,
    initialize: function () {
      return {
        version: 3,
        hide: {
          app: true,
          gift: true,
          thread: true,
          voice: true,
          profile: false, // false = do not hide (i.e. show the profile button) by default.
        },
        show: { thread: false },
        neverDismiss: true,
      };
    },
    version: 3,
    migrations: {
      1: function (_a) {
        var version = _a.version,
          oldStorage = _a;
        return _define_property({}, "hide", oldStorage), _define_property({}, "neverDismiss", true);
      },
      2: function (old) {
        return _define_property({}, "show", { thread: false }), old;
      },
    },
  });
  
  var unpatches = [];
  
  // Lazy helpers from BunnyPlugins:
  var _a,
    color = metro.findByPropsLazy("SemanticColor");
  color === null || color === void 0 ? void 0 : color.default;
  (_a = color.default) === null || _a === void 0 ? void 0 : (_a.meta = color.default.internal);
  metro.findByStoreNameLazy("ThemeStore");
  var { factories: { createFilterDefinition }, lazy: { createLazyModule } } = metro;
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
  
  // ––– Retrieve candidate components.
  var ChatInputSendButton = findByTypeDisplayNameLazy("ChatInputSendButton");
  var ChatInputActions = findByTypeDisplayNameLazy("ChatInputActions");
  
  // Patch the ChatInputSendButton (as in your original code).
  unpatches.push(
    api.patcher.before("render", ChatInputSendButton.type, function ([props]) {
      if (props.canSendVoiceMessage)
        props.canSendVoiceMessage = !storage.get("hide.voice");
    })
  );
  
  // Patch the ChatInputActions to adjust various properties and inject the profile button.
  unpatches.push(
    api.patcher.before("render", ChatInputActions.type, function ([props]) {
      if (props.isAppLauncherEnabled)
        props.isAppLauncherEnabled = !storage.get("hide.app");
      props.canStartThreads = storage.get("show.thread") || !storage.get("hide.thread");
      props.forceShowActions = storage.get("neverDismiss");
      props.shouldShowGiftButton = !storage.get("hide.gift");
      
      // Inject our profile button if the "Hide Profile button" option is false.
      if (props.children && Array.isArray(props.children) && !storage.get("hide.profile")) {
        var currentUser = metro.findByProps("getCurrentUser").getCurrentUser();
        if (currentUser && currentUser.avatar) {
          var avatarUrl = "https://cdn.discordapp.com/avatars/" + currentUser.id + "/" + currentUser.avatar + ".png?size=40";
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
          // Inject the profile button if it's not already present.
          if (!props.children.some(function (child) {
            return child && child.key === "profile-button";
          }))
            props.children.unshift(profileButton);
        }
      }
    })
  );
  
  // ––– Plugin lifecycle and settings UI.
  var Stack = findByTypeDisplayNameLazy("Stack");
  var index = {
    onLoad: function () {
      // No additional code needed here; patching is done above.
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
            // Hide Buttons group – now with an extra row for the profile button.
            common.TableRowGroup,
            { title: "Hide Buttons" },
            [
              ["App Launcher button", "AppsIcon", "app"],
              ["Gift button", "ic_gift", "gift"],
              ["New Thread button", "ThreadPlusIcon", "thread"],
              ["Voice Message button", "MicrophoneIcon", "voice"],
              ["Profile button", "ic_profile", "profile"]
            ].map(function (entry) {
              var label = entry[0],
                icon = entry[1],
                key = entry[2];
              return common.React.createElement(common.TableSwitchRow, {
                key: key,
                icon: common.React.createElement(common.TableRow.Icon, { source: api.assets.findAssetId(icon) }),
                label: "Hide " + label,
                disabled: key === "thread" && storage.get("show." + key),
                value: key === "thread" && storage.get("show." + key)
                  ? false
                  : storage.get("hide." + key),
                onValueChange: function (v) {
                  storage.set("hide." + key, v);
                  forceUpdate();
                },
              });
            })
          ),
          common.React.createElement(
            // Force Show Buttons group.
            common.TableRowGroup,
            { title: "Force Show Buttons" },
            common.React.createElement(common.TableSwitchRow, {
              icon: common.React.createElement(common.TableRow.Icon, { source: api.assets.findAssetId("ThreadPlusIcon") }),
              label: "Force show New Thread button",
              subLabel: "Show the thread button even when you can't start threads, or when the chat input is not focused",
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
