(function(plugin, vendetta, metro) {
    "use strict";
    
    const { React } = vendetta.metro.common;
    const UserStore = metro.findByProps("getCurrentUser");
    
    // Try multiple methods to find the profile opening function
    const ProfileModule = 
        metro.findByProps("openUserProfile", "openUserProfileModal") || 
        metro.findByProps("openProfileSheet") ||
        metro.findByProps("getUserProfile");
    
    let unpatch = [];
    let debugMode = true; // Set to true for detailed logging
    
    // Helper function for logging when debug mode is on
    function log(message, data) {
        if (debugMode) {
            console.log(`[Profile Button Debug] ${message}`, data || "");
        }
    }
    
    // Function to get user avatar URL
    function getUserAvatarUrl(user, size = 40) {
        if (!user || !user.avatar) return null;
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
    }
    
    // Function to open user profile with fallbacks
    function openUserProfile(userId) {
        try {
            if (ProfileModule) {
                if (typeof ProfileModule.openUserProfile === "function") {
                    ProfileModule.openUserProfile({ userId });
                    return true;
                } else if (typeof ProfileModule.openUserProfileModal === "function") {
                    ProfileModule.openUserProfileModal({ userId });
                    return true;
                } else if (typeof ProfileModule.openProfileSheet === "function") {
                    ProfileModule.openProfileSheet(userId);
                    return true;
                }
            }
            
            // Last resort - try to find any method with "profile" in the name
            const potentialProfileModules = [];
            
            for (const module of Object.values(metro.modules)) {
                if (module && module.exports) {
                    for (const key in module.exports) {
                        if (
                            key.toLowerCase().includes("profile") && 
                            typeof module.exports[key] === "function"
                        ) {
                            potentialProfileModules.push([key, module.exports[key]]);
                        }
                    }
                }
            }
            
            log("Found potential profile methods:", potentialProfileModules.map(m => m[0]));
            
            // Try the most promising ones
            for (const [name, func] of potentialProfileModules) {
                try {
                    // Typically these functions expect either a userId or an object with userId
                    func(userId);
                    log(`Successfully called ${name} with userId`);
                    return true;
                } catch (e1) {
                    try {
                        func({ userId });
                        log(`Successfully called ${name} with {userId}`);
                        return true;
                    } catch (e2) {
                        // Continue to next method
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error("[Profile Button] Error opening profile:", error);
            return false;
        }
    }
    
    // Strategy 1: Try to find the chat input directly
    function injectIntoChatInput() {
        log("Trying Strategy 1: Chat Input Direct Injection");
        
        const possibleChatInputs = [
            metro.findByProps("ChatInput"),
            metro.findByProps("renderTextInput"),
            metro.findByProps("textInputRef"),
            metro.findByProps("renderInput", "renderButtons")
        ].filter(Boolean);
        
        log("Found possible chat inputs:", possibleChatInputs.length);
        
        for (const ChatInputModule of possibleChatInputs) {
            if (!ChatInputModule || !ChatInputModule.default) continue;
            
            try {
                const unp = vendetta.patcher.after("default", ChatInputModule, (_, res) => {
                    try {
                        if (!res || !res.props) return res;
                        
                        // Inspect the result structure to find where buttons are stored
                        const flattenProps = (obj, prefix = "", result = {}) => {
                            if (!obj || typeof obj !== "object") return result;
                            
                            for (const [key, value] of Object.entries(obj)) {
                                const newPrefix = prefix ? `${prefix}.${key}` : key;
                                
                                if (Array.isArray(value) && value.length > 0 && 
                                    value.some(item => item && item.type && 
                                        (item.type.name === "ChatBarButton" || 
                                         item.type.displayName === "ChatBarButton"))) {
                                    result[newPrefix] = value;
                                } else if (value && typeof value === "object") {
                                    flattenProps(value, newPrefix, result);
                                }
                            }
                            
                            return result;
                        };
                        
                        const buttonArrays = flattenProps(res);
                        log("Found button arrays at:", Object.keys(buttonArrays));
                        
                        // Try to inject our button into each potential buttons array
                        for (const [path, buttons] of Object.entries(buttonArrays)) {
                            if (!Array.isArray(buttons)) continue;
                            
                            // Create the button element
                            const currentUser = UserStore.getCurrentUser();
                            if (!currentUser) continue;
                            
                            const avatarUrl = getUserAvatarUrl(currentUser);
                            if (!avatarUrl) continue;
                            
                            // Try to clone an existing button to match its structure
                            const existingButton = buttons.find(b => b && b.type);
                            if (!existingButton) continue;
                            
                            // Create profile button by cloning an existing button and modifying it
                            const profileButton = React.cloneElement(
                                existingButton,
                                {
                                    ...existingButton.props,
                                    key: "profile-button-" + Date.now(),
                                    onPress: () => openUserProfile(currentUser.id),
                                    icon: () => React.createElement("img", {
                                        src: avatarUrl,
                                        style: {
                                            width: 24, 
                                            height: 24, 
                                            borderRadius: 12,
                                            objectFit: "cover"
                                        }
                                    })
                                }
                            );
                            
                            // Insert the button at the beginning of the array
                            buttons.unshift(profileButton);
                            log(`Injected button into array at ${path}`);
                        }
                        
                        return res;
                    } catch (error) {
                        console.error("[Profile Button] Error in chat input patch:", error);
                        return res;
                    }
                });
                
                unpatch.push(unp);
                log("Added patch for ChatInputModule");
            } catch (error) {
                console.error("[Profile Button] Failed to patch chat input:", error);
            }
        }
    }
    
    // Strategy 2: Find and patch the message bar component
    function injectIntoMessageBar() {
        log("Trying Strategy 2: Message Bar Injection");
        
        const possibleMessageBars = [
            metro.findByProps("MessageBar"),
            metro.findByProps("renderBar"),
            metro.findByProps("renderButtons", "renderAttachButton"),
            metro.findByDisplayName("MessageBar")
        ].filter(Boolean);
        
        log("Found possible message bars:", possibleMessageBars.length);
        
        for (const MessageBarModule of possibleMessageBars) {
            if (!MessageBarModule) continue;
            
            // Determine if we should patch default export or a specific property
            let targetProp = "default";
            let targetObj = MessageBarModule;
            
            if (MessageBarModule.MessageBar) {
                targetProp = "MessageBar";
                targetObj = MessageBarModule;
            } else if (typeof MessageBarModule === "function") {
                targetProp = null; // Patch the function directly
            }
            
            try {
                const unp = targetProp 
                    ? vendetta.patcher.after(targetProp, targetObj, patchMessageBar)
                    : vendetta.patcher.after(targetObj, patchMessageBar);
                
                unpatch.push(unp);
                log(`Added patch for MessageBarModule${targetProp ? '.' + targetProp : ''}`);
            } catch (error) {
                console.error("[Profile Button] Failed to patch message bar:", error);
            }
        }
    }
    
    // Helper function for message bar patching
    function patchMessageBar(_, res) {
        try {
            if (!res || !res.props) return res;
            
            const currentUser = UserStore.getCurrentUser();
            if (!currentUser) return res;
            
            const avatarUrl = getUserAvatarUrl(currentUser);
            if (!avatarUrl) return res;
            
            // Function to recursively find and modify button containers
            const processNode = (node) => {
                if (!node) return false;
                
                // Check if this is a button container
                if (node.props && Array.isArray(node.props.children)) {
                    const hasButtons = node.props.children.some(child => 
                        child && 
                        child.props && 
                        (child.props.accessibilityLabel || child.props.icon || child.props.onPress)
                    );
                    
                    if (hasButtons) {
                        // Create our custom button
                        const customIconStyle = {
                            width: 24, 
                            height: 24, 
                            borderRadius: 12,
                            objectFit: "cover"
                        };
                        
                        // Try to match the style of existing buttons
                        const existingButton = node.props.children.find(c => c && c.props);
                        let profileButton;
                        
                        if (existingButton) {
                            // Clone an existing button to match structure
                            profileButton = React.cloneElement(existingButton, {
                                ...existingButton.props,
                                key: "profile-button",
                                accessibilityLabel: "Your Profile",
                                onPress: () => openUserProfile(currentUser.id),
                                icon: props => React.createElement("img", {
                                    src: avatarUrl,
                                    style: customIconStyle
                                })
                            });
                        } else {
                            // Create a simple button if we can't clone
                            profileButton = React.createElement("img", {
                                key: "profile-button",
                                src: avatarUrl,
                                style: {
                                    ...customIconStyle,
                                    marginHorizontal: 10,
                                    cursor: "pointer"
                                },
                                onClick: () => openUserProfile(currentUser.id)
                            });
                        }
                        
                        // Add our button at the start
                        node.props.children.unshift(profileButton);
                        log("Added profile button to button container");
                        return true;
                    }
                }
                
                // Recursively process children
                if (node.props && node.props.children) {
                    if (Array.isArray(node.props.children)) {
                        for (const child of node.props.children) {
                            if (processNode(child)) return true;
                        }
                    } else {
                        return processNode(node.props.children);
                    }
                }
                
                return false;
            };
            
            processNode(res);
            return res;
        } catch (error) {
            console.error("[Profile Button] Error in message bar patch:", error);
            return res;
        }
    }
    
    // Strategy 3: Create a floating button
    function createFloatingButton() {
        log("Trying Strategy 3: Floating Button");
        
        try {
            // Find the React root component (app shell)
            const AppShell = metro.findByProps("AppShell") || 
                            metro.findByDisplayName("AppShell") || 
                            metro.findByProps("renderRouteContainer");
            
            if (!AppShell) {
                log("Could not find App Shell component");
                return;
            }
            
            const targetProp = AppShell.AppShell ? "AppShell" : "default";
            const targetObj = AppShell;
            
            const unp = vendetta.patcher.after(targetProp, targetObj, (_, res) => {
                try {
                    if (!res || !res.props) return res;
                    
                    const currentUser = UserStore.getCurrentUser();
                    if (!currentUser) return res;
                    
                    const avatarUrl = getUserAvatarUrl(currentUser);
                    if (!avatarUrl) return res;
                    
                    // Create floating button element
                    const floatingButton = React.createElement("div", {
                        style: {
                            position: "absolute",
                            bottom: 80,
                            left: 10,
                            zIndex: 9999,
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: "#5865F2",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
                        },
                        onClick: () => openUserProfile(currentUser.id)
                    }, 
                    React.createElement("img", {
                        src: avatarUrl,
                        style: {
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            objectFit: "cover"
                        }
                    }));
                    
                    // Append the floating button to the app
                    if (Array.isArray(res.props.children)) {
                        res.props.children.push(floatingButton);
                    } else {
                        res.props.children = [
                            res.props.children,
                            floatingButton
                        ];
                    }
                    
                    log("Added floating profile button");
                    return res;
                } catch (error) {
                    console.error("[Profile Button] Error in app shell patch:", error);
                    return res;
                }
            });
            
            unpatch.push(unp);
            log("Added patch for AppShell");
        } catch (error) {
            console.error("[Profile Button] Failed to add floating button:", error);
        }
    }
    
    // Function to find all components by property existence
    function findAllComponentsByProps(...props) {
        const results = [];
        
        for (const id in metro.modules) {
            const module = metro.modules[id];
            if (!module.exports) continue;
            
            // Check if module.exports has all the specified props
            const hasAllProps = props.every(prop => 
                module.exports[prop] !== undefined
            );
            
            if (hasAllProps) {
                results.push(module.exports);
            }
            
            // Also check default export if it exists
            if (module.exports.default) {
                const hasAllPropsInDefault = props.every(prop => 
                    module.exports.default[prop] !== undefined
                );
                
                if (hasAllPropsInDefault) {
                    results.push(module.exports.default);
                }
            }
        }
        
        return results;
    }
    
    // Debug function to log component tree
    function dumpComponentTree() {
        if (!debugMode) return;
        
        const NavBar = metro.findByProps("NavigationBar") || metro.findByDisplayName("NavigationBar");
        if (NavBar) {
            log("Found NavBar component");
            const unp = vendetta.patcher.after(NavBar.default ? "default" : "NavigationBar", NavBar, (_, res) => {
                if (!res) return res;
                log("NavBar structure:", JSON.stringify(res, (key, value) => {
                    if (key === "children") return "[children]";
                    if (typeof value === "function") return "[function]";
                    return value;
                }));
                return res;
            });
            setTimeout(() => unp(), 5000); // Remove after 5 seconds
        }
    }
    
    plugin.onLoad = function() {
        console.log("[Profile Button] Plugin loaded!");
        
        // After a delay, try all strategies
        setTimeout(() => {
            dumpComponentTree();
            injectIntoChatInput();
            injectIntoMessageBar();
            createFloatingButton();
            
            log("All injection strategies attempted");
        }, 3000);
    };
    
    plugin.onUnload = function() {
        console.log("[Profile Button] Plugin unloaded!");
        unpatch.forEach(u => u());
    };
    
})(vendetta.plugin, vendetta, vendetta.metro);
