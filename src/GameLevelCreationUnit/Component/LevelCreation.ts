import { Scene } from "phaser";
import { LevelCreationConstants } from "../../GameConstants/LevelCreationContants";
import { BrickAssetsData } from "../entity/BuildingMaterialConfig";
import { GameStateManager } from "../../StateManger/GameStateManager";

export class LevelCreation {

    protected static levelCreation: LevelCreation;
    protected gameStateMachine: GameStateManager;
    public static getInstance(): LevelCreation {
        if (!LevelCreation.levelCreation) {
            LevelCreation.levelCreation = new LevelCreation();
        }
        return LevelCreation.levelCreation;
    }
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
    }
    public createWallOnPatternBased(scene: Scene, patternConfig: any): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] {
        const brickArray: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];
        for (let index = 0; index < patternConfig.length; index++) {
            for (let j = 0; j < patternConfig[index].length; j++) {
                if (patternConfig[index][j] == 1) {
                    const brick = this.createBrickOnCanvas(index, j, scene, this.getBrickColor());
                    brickArray.push(brick);
                }
            }

        }
        return brickArray;
    }
    private createBrickOnCanvas(i: number, j: number, scene: Scene, brickColor: string): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
        const tile = scene.physics.add.sprite(94 * j, 44 * i, LevelCreationConstants.BRICKS_ATLAS_KEY, brickColor);
        tile.setName(`${brickColor}_${i}_${j}`);
        this.gameStateMachine.updateTileRecord(`${brickColor}_${i}_${j}`, { color: brickColor, tileValue: tile });
        this.setProperties(tile);
        return tile;
    }
    private setProperties(tile: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): void {
        tile.setOrigin(0, 0).setScale(0.5, 0.5);
        tile.setImmovable(true);
    }
    protected getBrickColor(): string {
        return Phaser.Math.RND.pick(BrickAssetsData.bricksFramesKey);
    }

}