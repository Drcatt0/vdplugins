(function(e,d,o){"use strict";const n=e.findByProps("sendBotMessage"),c=e.findByStoreName("GuildStore"),r=e.findByStoreName("GuildChannelStore"),t=e.findByStoreName("ReadStateStore");o.registerCommand({name:"markasreadall",displayName:"markasreadall",description:"read all server notifications",displayDescription:"read all server notifications",applicationId:-1,inputType:1,type:1,execute:function(h,s){try{const i=[];Object.values(c.getGuilds()).forEach(function(l){r.getChannels(l.id).SELECTABLE.forEach(function(a){t.hasUnread(a.channel.id)&&i.push({channelId:a.channel.id,messageId:t.lastMessageId(a.channel.id),readStateType:0})})}),d.FluxDispatcher.dispatch({type:"BULK_ACK",context:"APP",channels:i}),n.sendBotMessage(s.channel.id,"Done!")}catch{n.sendBotMessage(s.channel.id,"Failed to read all server notifications")}}})})(vendetta.metro,vendetta.metro.common,vendetta.commands);
