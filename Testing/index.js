(function(plugin, vendetta, metro) {
    "use strict";
    
    const { React } = vendetta.metro.common;
    const ProfileModule = metro.findByProps("openUserProfile", "openUserProfileModal");
    const UserStore = metro.findByProps("getCurrentUser");
    
    // Find the chat input toolbar components using more reliable methods
    const ChatBarComponent = metro.findByProps("ChatBarButton");
    
    let unpatch;
    
    function injectProfileButton() {
        console.log("[Profile Button] Attempting to inject profile button...");
        
        // First try to find the component that renders the chat input buttons
        const ChatBarButtonComponent = metro.findByName("ChatBarButton") || 
                                      metro.findByDisplayName("ChatBarButton");
        
        if (!ChatBarButtonComponent) {
            console.error("[Profile Button] ChatBarButton component not found!");
            return;
        }
        
        // Create a custom button component that mimics Discord's style
        const ProfileButton = (props) => {
            const currentUser = UserStore.getCurrentUser();
            if (!currentUser || !currentUser.avatar) {
                return null;
            }
            
            const avatarUrl = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png?size=40`;
            
            // Use Discord's own styling for consistency
            return React.createElement(ChatBarButtonComponent, {
                ...props,
                style: {
                    marginLeft: 8,
                    marginRight: 4
                },
                onPress: () => {
                    if (ProfileModule.openUserProfile) {
                        ProfileModule.openUserProfile({ userId: currentUser.id });
                    } else if (ProfileModule.openUserProfileModal) {
                        ProfileModule.openUserProfileModal({ userId: currentUser.id });
                    } else if (ProfileModule.openProfileSheet) {
                        ProfileModule.openProfileSheet(currentUser.id);
                    }
                },
                icon: props => React.createElement("img", {
                    src: avatarUrl,
                    style: {
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        objectFit: "cover"
                    }
                })
            });
        };
        
        // Find the chat input container
        const ChatInputContainer = metro.findByProps("ChatInput");
        
        if (!ChatInputContainer || !ChatInputContainer.default) {
            console.error("[Profile Button] Chat input container not found!");
            return;
        }
        
        // Patch the chat input container to add our button
        unpatch = vendetta.patcher.after("default", ChatInputContainer, (_, res) => {
            try {
                if (!res || !res.props || !res.props.children) return res;
                
                // Find the buttons container in the chat input
                const findButtonsContainer = (element) => {
                    if (!element) return null;
                    
                    // Check if this element is the buttons container
                    if (element.props && Array.isArray(element.props.children)) {
                        const buttons = element.props.children.filter(child => 
                            child && child.type && 
                            (child.type.name === "ChatBarButton" || 
                             child.type.displayName === "ChatBarButton")
                        );
                        
                        if (buttons.length > 0) return element;
                    }
                    
                    // If not, check its children
                    if (element.props && element.props.children) {
                        if (Array.isArray(element.props.children)) {
                            for (const child of element.props.children) {
                                const result = findButtonsContainer(child);
                                if (result) return result;
                            }
                        } else {
                            return findButtonsContainer(element.props.children);
                        }
                    }
                    
                    return null;
                };
                
                const buttonsContainer = findButtonsContainer(res);
                
                if (buttonsContainer && buttonsContainer.props && Array.isArray(buttonsContainer.props.children)) {
                    // Add our profile button to the beginning of the buttons array
                    buttonsContainer.props.children.unshift(
                        React.createElement(ProfileButton, { key: "profile-button" })
                    );
                    console.log("[Profile Button] Successfully injected button!");
                } else {
                    console.error("[Profile Button] Buttons container not found in chat input!");
                }
                
                return res;
            } catch (error) {
                console.error("[Profile Button] Error during injection:", error);
                return res;
            }
        });
    }
    
    plugin.onLoad = function() {
        console.log("[Profile Button] Plugin loaded!");
        
        // Wait a short time for Discord to initialize components
        setTimeout(injectProfileButton, 2000);
    };
    
    plugin.onUnload = function() {
        console.log("[Profile Button] Plugin unloaded!");
        if (unpatch) unpatch();
    };
    
})(vendetta.plugin, vendetta, vendetta.metro);
