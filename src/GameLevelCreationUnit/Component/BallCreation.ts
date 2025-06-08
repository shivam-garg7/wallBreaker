import { Scene } from "phaser";
import { LevelCreationConstants } from "../../GameConstants/LevelCreationContants";
import { BallAssetsData } from "../entity/BuildingMaterialConfig";
import { GameStateManager } from "../../StateManger/GameStateManager";

export class BallCreation {

    protected static ballCreation: BallCreation;
    protected gameStateMachine: GameStateManager;
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
    }
    public static getInstance(): BallCreation {
        if (!BallCreation.ballCreation) {
            BallCreation.ballCreation = new BallCreation();
        }
        return BallCreation.ballCreation;
    }

    public createBall(scene: Scene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        const ball = scene.physics.add.sprite(0, 0, LevelCreationConstants.BaLL_ATLAS_KEY, this.getBallFrameKey(0));
        this.setBallProperties(ball);
        this.gameStateMachine.setCreatedBall(ball);
        return ball;
    }
    private setBallProperties(ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): void {
        ball.setOrigin(0.5, 1).setScale(0.25, 0.25)
        ball.setCollideWorldBounds(true, 1, 1);
        ball.setBounce(1, 1);
        ball.setCircle(66.5);
    }
    private getBallFrameKey(key: number): string {
        return BallAssetsData.ballFramesKey[key];
    }
    public updateBall(scene: Scene): void {
        // to do
    }

}