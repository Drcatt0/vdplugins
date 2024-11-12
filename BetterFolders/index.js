(function(p,r,s,e){"use strict";const{getGuildFolders:g}=s.findByStoreName("UserSettingsProtoStore"),{isFolderExpanded:L}=s.findByStoreName("ExpandedGuildFolderStore"),toggleAutoCollapse=()=>{const expandedFolders=g().filter(t=>t.folderId&&L(t.folderId));expandedFolders.forEach((t,i)=>{if(i>0){e.FluxDispatcher.dispatch({type:"TOGGLE_GUILD_FOLDER_EXPAND",folderId:t.folderId})}})};const FolderAutoCollapse=()=>{const onFolderToggle=a=>{let{folderId:id}=a;if(r.storage.autoCollapse&&L(id)){toggleAutoCollapse()}};e.FluxDispatcher.subscribe("TOGGLE_GUILD_FOLDER_EXPAND",onFolderToggle);return()=>e.FluxDispatcher.unsubscribe("TOGGLE_GUILD_FOLDER_EXPAND",onFolderToggle)};var j={onLoad:function(){r.storage.autoCollapse??=true;this.unsubFolderToggle=FolderAutoCollapse();e.FluxDispatcher.dispatch({type:"SYNC_FOLDER_STATE"})},onUnload:function(){this.unsubFolderToggle&&this.unsubFolderToggle();e.FluxDispatcher.dispatch({type:"SYNC_FOLDER_STATE"})}};return p.default=j,Object.defineProperty(p,"__esModule",{value:!0}),p})({},vendetta.plugin,vendetta.metro,vendetta.metro.common);
