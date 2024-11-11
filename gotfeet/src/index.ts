import { loadCommand, unloadCommand } from './cmd';

export function onLoad() {
    loadCommand();
}

export function onUnload() {
    unloadCommand();
}
