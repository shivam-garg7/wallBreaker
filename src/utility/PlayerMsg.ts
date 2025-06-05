import type { Scene } from "phaser";
import type { PlayerMsgConfig } from "../Interface/PlayerMsg";

export class PlayerMsg {
    private readonly scene: Scene;
    private keyTextValuePairObject: Record<string, Phaser.GameObjects.Text> = {};
    /**
     *
     */
    constructor(scene: Scene, msgObject?: Record<string, string>, config: PlayerMsgConfig = { x: 0, y: 0, style: {} }, visible: boolean = true) {
        this.scene = scene;
        if (msgObject) {
            for (const msg of Object.entries(msgObject)) {

                this.createPlayerMsg(msg, config,visible);

            }
        }
    }
    public createPlayerMsg(msg: [string, string], config: PlayerMsgConfig = { x: 0, y: 0, style: {} },visible:boolean = true): void {
        const [key, value] = msg;
        this.keyTextValuePairObject[key] = this.scene.add.text(config.x, config.y, value, config.style).setOrigin(0.5).setVisible(visible);
    }
    public getPlayerMsg(key: string): Phaser.GameObjects.Text {
        return this.keyTextValuePairObject[key];
    }
}