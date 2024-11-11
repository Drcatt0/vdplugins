(function(f,vendetta,metro,common,assets,toasts){"use strict";async function fetchFeetImage(){try{const response=await fetch("https://www.reddit.com/r/feet/top.json?limit=10");const data=await response.json();const posts=data.data.children;const imagePosts=posts.filter(post=>post.data.post_hint==="image");if(imagePosts.length>0){const randomPost=imagePosts[Math.floor(Math.random()*imagePosts.length)];return randomPost.data.url}else{return"No images found in r/feet."}}catch(error){console.error("Error fetching image:",error);return"Failed to retrieve image."}}const registerCommand=function(){vendetta.commands.registerCommand({name:"gotfeet",description:"Fetches a random post from r/feet.",options:[],execute:async()=>{const imageUrl=await fetchFeetImage();return{content:imageUrl||"No images found in r/feet."}}})};const unregisterCommand=function(){vendetta.commands.unregisterCommand("gotfeet")};f.onLoad=registerCommand;f.onUnload=unregisterCommand;Object.defineProperty(f,"__esModule",{value:true})})(typeof exports==="undefined"?{}:exports,vendetta,vendetta.metro,vendetta.metro.common,vendetta.ui.assets,vendetta.ui.toasts);
