import { registerCommand } from 'vendetta-commands';
import { fetchFeetImage } from './feet';

export function loadCommand() {
    registerCommand({
        name: "gotfeet",
        description: "Fetches a random post from r/feet.",
        options: [],
        execute: async () => {
            const imageUrl = await fetchFeetImage();
            return {
                content: imageUrl ? imageUrl : "No images found in r/feet."
            };
        },
    });
}

export function unloadCommand() {
    unregisterCommand("gotfeet");
}
