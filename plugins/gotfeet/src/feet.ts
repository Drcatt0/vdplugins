export async function fetchFeetImage(): Promise<string | null> {
    try {
        const response = await fetch("https://www.reddit.com/r/feet/top.json?limit=10");
        const data = await response.json();
        
        const posts = data.data.children;
        const imagePosts = posts.filter(post => post.data.post_hint === 'image');
        
        if (imagePosts.length > 0) {
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            return randomPost.data.url;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}
