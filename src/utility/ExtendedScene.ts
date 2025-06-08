import { originalWidth, originalHeight } from "../main";
import { Scene } from "phaser";

export class ExtendedScene extends Scene {
    /**
     *
     */
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }
    protected onResize(gameSize: Phaser.Structs.Size): void {
        // const { width, height } = gameSize;
        // this.physics.world.setBounds(0, 0, width, height);
        // const scaleX = this.scale.width / originalWidth;
        // const scaleY = this.scale.height / originalHeight;
        // const scale = Math.min(scaleX, scaleY);
        // this.cameras.main.setZoom(scale);
    }
}