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
    public createWallOnPatternBased(scene: Scene, patternConfig: number[][]): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] {
        const brickArray: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];
        for (let index = 0; index < patternConfig.length; index++) {
            for (let j = 0; j < patternConfig[index].length; j++) {
                if (patternConfig[index][j] == 1) {
                    const brick = this.createBrickOnCanvas(index, j, scene, this.getBrickColor(), patternConfig[index].length);
                    brickArray.push(brick);
                }
            }

        }
        return brickArray;
    }
    private createBrickOnCanvas(i: number, j: number, scene: Scene, brickColor: string, noOfRows: number): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
        const tile = scene.physics.add.sprite(0, 0, LevelCreationConstants.BRICKS_ATLAS_KEY, brickColor);
        tile.setName(`${brickColor}_${i}_${j}`);
        this.gameStateMachine.updateTileRecord(`${brickColor}_${i}_${j}`, { color: brickColor, tileValue: tile });
        this.setProperties(tile, j, i, scene, noOfRows);
        return tile;
    }
    private setProperties(tile: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, j: number, i: number, scene: Scene, noOfRows: number): void {
        tile.setOrigin(0, 0).setScale(0.4, 0.4);
        tile.setImmovable(true);
        const totalWidth = tile.displayWidth * noOfRows;
        this.gameStateMachine.setPhysicsBodyXPositionAndWidth((scene.renderer.width - totalWidth) / 2, totalWidth);
        tile.setPosition(((scene.renderer.width - totalWidth) / 2) + (tile.displayWidth * j), tile.displayHeight * i);
    }
    protected getBrickColor(): string {
        return Phaser.Math.RND.pick(BrickAssetsData.bricksFramesKey);
    }

}