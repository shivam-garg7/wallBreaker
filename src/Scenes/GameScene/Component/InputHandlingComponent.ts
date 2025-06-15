import { keyAction } from "../../../GameConstants/InputConstants";
import { GameStateManager } from "../../../StateManger/GameStateManager";
import { GameScene } from "../GameScene";
import { InputHandler } from "../../../InputHandlingUnit/component/InputHandler";
import { IVelocity } from "../../../Interface/IPhysicsBodyData";

export class InputHandlingComponent {
    private readonly scene: GameScene;
    private left!: Phaser.Input.Keyboard.Key;
    private right!: Phaser.Input.Keyboard.Key;
    private space!: Phaser.Input.Keyboard.Key;
    private restartKey!: Phaser.Input.Keyboard.Key;
    private gameStateMachine!: GameStateManager;
    private readonly velocity: IVelocity = {
        x: 400,
        y: 400
    }
    /**
     *
     */
    constructor(scene: GameScene) {
        this.scene = scene;
        this.initialize();
        this.startGameSetup();
    }
    private initialize(): void {
        this.gameStateMachine = GameStateManager.getInstance();

    }
    protected startGameSetup(): void {
        this.left = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, this.scene)!;
        this.left?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.DOWN], this.onLeftKeyPressDown, this);
        this.left?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onLeftKeyPressUp, this);
        this.right = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, this.scene)!;
        this.right?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.DOWN], this.onRightKeyPressDown, this);
        this.right?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onRightKeyPressUp, this);
        this.space = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, this.scene)!;
        this.space?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onSpaceBarPressUp, this);
        this.restartKey = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.R, this.scene)!;
        this.restartKey.enabled = false;
        this.restartKey?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onRestartKeyPressUp, this);
    }
    private onLeftKeyPressDown(): void {
        if (!this.gameStateMachine.isGameOver) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocity(-this.velocity.x, 0);
        }
    }
    private onLeftKeyPressUp(): void {
        this.stopPaddle();

    }
    private onRightKeyPressDown(): void {
        if (!this.gameStateMachine.isGameOver) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocity(this.velocity.x, 0);
        }

    }
    private onRightKeyPressUp(): void {

        this.stopPaddle();

    }
    private stopPaddle(): void {
        if (this.gameStateMachine.isGameOver) {
            return;
        }
        if (this.left.isUp && this.right.isUp) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocity(0, 0);

        } else if (this.left.isDown) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocity(-this.velocity.x, 0);

        } else if (this.right.isDown) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocity(this.velocity.x, 0);

        }
    }
    private onSpaceBarPressUp(): void {

        this.disableEnableSpaceBar(false);
        const velocityX = Phaser.Math.Between(-this.velocity.x, this.velocity.x);
        this.gameStateMachine.getGameBall().body.setVelocity(velocityX, -this.velocity.y);
        this.gameStateMachine.removeBallFromContainer();

    }
    public onRestartKeyPressUp(): void {
        this.disableEnableRestartKey(false);
        this.gameStateMachine.reset();
        this.scene.clearCurrentWall();
        this.scene.wallCreationAndCollision();
        this.scene.resetToPlay();
        this.gameStateMachine.getGameBall().visible = true;
        this.gameStateMachine.isGameOver = false;


    }
    public disableEnableRestartKey(value: boolean): void {
        this.restartKey.enabled = value;
    }
    public disableEnableSpaceBar(value: boolean): void {
        this.space.enabled = value;
    }
}