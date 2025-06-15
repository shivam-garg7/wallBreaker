import { Scene } from "phaser";
import { LevelCreationConstants } from "../../GameConstants/LevelCreationContants";
import { PaddleAssetsData } from "../entity/BuildingMaterialConfig";
import { GameStateManager } from "../../StateManger/GameStateManager";

export class PaddleCreation {

    protected static paddleCreation: PaddleCreation;
    protected gameStateMachine: GameStateManager;
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
    }
    public static getInstance(): PaddleCreation {
        if (!PaddleCreation.paddleCreation) {
            PaddleCreation.paddleCreation = new PaddleCreation();
        }
        return PaddleCreation.paddleCreation;
    }

    public createPaddle(scene: Scene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        const paddle = scene.physics.add.sprite(0, 0, LevelCreationConstants.PADDLE_ATLAS_KEY, this.getPaddleFrameKey(0));
        this.setPaddleProperties(paddle);
        this.gameStateMachine.setCreatedPaddle(paddle);
        return paddle;
    }
    private setPaddleProperties(paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): void {
        paddle.setOrigin(0.5, 0).setScale(0.25);
        paddle.setImmovable(true);
        paddle.setCollideWorldBounds(true);
        paddle.body.enable = false;
    }
    private getPaddleFrameKey(key: number): string {
        return PaddleAssetsData.paddleFramesKey[key];
    }
    public updatePaddle(scene: Scene): void {
        // to do
    }

}