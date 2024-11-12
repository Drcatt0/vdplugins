(function(f,$,h,B){"use strict";var N;(function(e){e[e.BUILT_IN=0]="BUILT_IN",e[e.BUILT_IN_TEXT=1]="BUILT_IN_TEXT",e[e.BUILT_IN_INTEGRATION=2]="BUILT_IN_INTEGRATION",e[e.BOT=3]="BOT",e[e.PLACEHOLDER=4]="PLACEHOLDER"})(N||(N={}));var c;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER=6]="USER",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(c||(c={}));var g;(function(e){e[e.CHAT=1]="CHAT",e[e.USER=2]="USER",e[e.MESSAGE=3]="MESSAGE"})(g||(g={}));const{sendBotMessage:_}=h.findByProps("sendBotMessage");let A=[];const L=function(){A.push($.registerCommand({name:"readall",displayName:"readall",description:"Marks all messages and servers as read.",displayDescription:"Marks all messages and servers as read.",type:g.CHAT,inputType:N.BUILT_IN_TEXT,applicationId:"-1",options:[],execute:async function(){try{const AckUtils=h.findByProps("bulkAck"),ReadStateStore=h.findByStoreName("ReadStateStore"),ChannelStore=h.findByStoreName("ChannelStore");let toRead=[];const allReadStates=ReadStateStore.getAllReadStates().map(m=>({...m})),onlyUnreadOrMentions=allReadStates.filter(m=>ReadStateStore.hasUnread(m.channelId));if(f.storage.dm??true){const UnreadDMs=onlyUnreadOrMentions.filter(m=>ChannelStore.getChannel(m.channelId)?.isDM()).map(m=>({channelId:m.channelId,messageId:m._lastMessageId}));toRead.push(...UnreadDMs)}if(f.storage.server??true){const UnreadGuildChannels=onlyUnreadOrMentions.filter(m=>ChannelStore.getChannel(m.channelId)?.getGuildId()).map(m=>({channelId:m.channelId,messageId:m._lastMessageId}));toRead.push(...UnreadGuildChannels)}AckUtils.bulkAck(toRead);return{content:"All messages marked as read!"}}catch(error){console.error("Error marking messages as read:",error);return{content:"Failed to mark messages as read."}}}}))},O=function(){for(const e of A)e()};f.default={onLoad:L,onUnload:O,settings:()=>h.createElement(B.ScrollView,null,h.createElement(B.FormSwitchRow,{label:"Mark DMs as Read",value:f.storage.dm??true,onValueChange:e=>f.storage.dm=e}),h.createElement(B.FormSwitchRow,{label:"Mark Servers as Read",value:f.storage.server??true,onValueChange:e=>f.storage.server=e}))}})({},vendetta.commands,vendetta.metro,vendetta.ui.components);
