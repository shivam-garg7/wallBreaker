import type { Scene } from "phaser";

export class InputHandler {

    public static addKey(key: Phaser.Input.Keyboard.Key | string | number, scene: Scene): Phaser.Input.Keyboard.Key | undefined {
        const keyboardKey = scene.input.keyboard?.addKey(key);
        if (!keyboardKey) {
            throw new Error(`Failed to add key: ${key}`);
        }
        return keyboardKey;
    }
}