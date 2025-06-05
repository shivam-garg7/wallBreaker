import type { Scene } from "phaser";
import { LevelCreationConstants } from "../../GameConstants/LevelCreationContants";
import { GameStateManager } from "../../StateManger/GameStateManager";

export class CreateBrokenBrick {
    protected static createBrokenBrick: CreateBrokenBrick;
    private readonly gameStateMachine: GameStateManager;
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
    }
    public static getInstance(): CreateBrokenBrick {
        if (!CreateBrokenBrick.createBrokenBrick) {
            CreateBrokenBrick.createBrokenBrick = new CreateBrokenBrick();
        }
        return CreateBrokenBrick.createBrokenBrick;
    }
    public createBrokenBricks(brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, scene: Scene): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] {
        const brokenBricksArray: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];
        for (let index = 0; index < 4; index++) {
            const brokenBrick = scene.physics.add.sprite((brick as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).x, (brick as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).y, LevelCreationConstants.BRICKS_ATLAS_KEY, `${this.getFrameName(brick)}Break`);
            this.setProperties(brokenBrick, index);
            brokenBricksArray.push(brokenBrick);
        }
        return brokenBricksArray;
    }
    private getFrameName(brick: Phaser.Types.Physics.Arcade.ImageWithDynamicBody|Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile): string {

        return this.gameStateMachine.getTileRecord()[(brick as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).name].color;

    }
    private setProperties(brokenBrick: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, index: number): void {
        const velocityX = Phaser.Math.Between(-25, 25);
        const velocityY = Phaser.Math.Between(-100, -10);
        const rotation = Phaser.Math.Between(0, 10);
        brokenBrick.x += brokenBrick.width * 0.25 * index;
        brokenBrick.setOrigin(0, 0).setScale(0.25, 0.25);
        brokenBrick.setRotation(rotation);
        brokenBrick.setVelocity(velocityX, velocityY);
        brokenBrick.setGravityY(500);
        brokenBrick.setBounce(0.4);
    }
}