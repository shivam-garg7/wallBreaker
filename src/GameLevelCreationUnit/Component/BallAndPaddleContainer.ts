import { Scene } from "phaser";
import { GameStateManager } from "../../StateManger/GameStateManager";


export class BallAndPaddleContainerCreation {

    protected static ballAndPaddleContainerCreation: BallAndPaddleContainerCreation;
    protected gameStateMachine: GameStateManager;
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
    }
    public static getInstance(): BallAndPaddleContainerCreation {
        if (!BallAndPaddleContainerCreation.ballAndPaddleContainerCreation) {
            BallAndPaddleContainerCreation.ballAndPaddleContainerCreation = new BallAndPaddleContainerCreation();
        }
        return BallAndPaddleContainerCreation.ballAndPaddleContainerCreation;
    }

    public createBallAndPaddleContainer(scene: Scene, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): Phaser.GameObjects.Container {
        const paddleBallContainer: Phaser.GameObjects.Container = scene.add.container(0, 0, [ball, paddle]);
        this.setContainerProperties(scene, paddleBallContainer, ball, paddle);
        this.gameStateMachine.setCreatedBallAndPaddleContainer(paddleBallContainer);
        return paddleBallContainer;
    }
    private setContainerProperties(scene: Scene, paddleBallContainer: Phaser.GameObjects.Container, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): void {
        paddleBallContainer.setPosition(scene.renderer.width / 2, scene.renderer.height - (ball.height * 0.25 + paddle.height * 0.25) / 2)
        paddleBallContainer.setSize(paddle.width * 0.25, ball.height * 0.25 + paddle.height * 0.25);
        scene.physics.add.existing(paddleBallContainer);
        (paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setCollideWorldBounds(true);
    }
}


