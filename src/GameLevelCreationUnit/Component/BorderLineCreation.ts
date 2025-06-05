import { Scene } from "phaser";

export class BorderLineCreation {

    protected static borderLineCreation: BorderLineCreation;
    public static getInstance(): BorderLineCreation {
        if (!BorderLineCreation.borderLineCreation) {
            BorderLineCreation.borderLineCreation = new BorderLineCreation();
        }
        return BorderLineCreation.borderLineCreation;
    }

    public createBorderLineCreation(scene: Scene): Phaser.GameObjects.Line {
        const bottomBorderLine = scene.add.line(0, 0, 0, scene.renderer.height, scene.renderer.width, scene.renderer.height, 0xFFFFFF, 1);
        this.setProperties(scene,bottomBorderLine);
        return bottomBorderLine;
    }
    private setProperties(scene: Scene, bottomBorderLine: Phaser.GameObjects.Line): void {
        bottomBorderLine.setPosition(0,scene.renderer.height).setOrigin(0, 0.5);
        scene.physics.add.existing(bottomBorderLine);
        (bottomBorderLine as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setImmovable(true);
    }
}