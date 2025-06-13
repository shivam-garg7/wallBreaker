import { keyAction } from "../../../GameConstants/InputConstants";
import { InputHandler } from "../../../InputHandlingUnit/component/InputHandler";
import { GameStateManager } from "../../../StateManger/GameStateManager";
import { GameScene } from "../GameScene";
import { CreateGameLevel } from "GameLevelCreationUnit/System/CreateGameLevel";
import { CollisionStateManager } from "CollisionHandlingUnit/System/CollisionStateManager";

export class GameSceneInputComponent {
    private left!: Phaser.Input.Keyboard.Key;
    private right!: Phaser.Input.Keyboard.Key;
    private space!: Phaser.Input.Keyboard.Key;
    private restartKey!: Phaser.Input.Keyboard.Key;
    private readonly gameStateMachine: GameStateManager;
    private readonly createGameLevel: CreateGameLevel;
    private readonly collisionStateManager: CollisionStateManager;

    private readonly scene: GameScene;
    /**
     *
     */
    constructor(scene: GameScene, createGameLevel: CreateGameLevel, collisionStateManager: CollisionStateManager) {
        this.scene = scene;
        this.gameStateMachine = GameStateManager.getInstance();
        this.createGameLevel = createGameLevel;
        this.collisionStateManager = collisionStateManager;
        this.inputHandling();
    }
    protected inputHandling(): void {

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
    protected onLeftKeyPressDown(): void {
        if (this.gameStateMachine.getGameBallAndPaddleContainer().active) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(-400);

        }
        else if (this.gameStateMachine.getGamePaddle().active) {

            this.gameStateMachine.getGamePaddle().setVelocityX(-400)
        }
    }
    protected onLeftKeyPressUp(): void {
        if (this.gameStateMachine.getGameBallAndPaddleContainer().active) {

            if (!this.right?.isDown) {

                (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(0);
            } else {
                (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(400)
            }
        }
        else if (this.gameStateMachine.getGamePaddle().active) {

            if (!this.right?.isDown) {

                this.gameStateMachine.getGamePaddle().setVelocityX(0)
            } else {
                this.gameStateMachine.getGamePaddle().setVelocityX(400)
            }
        }
    }
    protected onRightKeyPressUp(): void {
        if (this.gameStateMachine.getGameBallAndPaddleContainer().active) {

            if (!this.left?.isDown) {

                (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(0)
            } else {
                (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(-400)
            }
        }
        else if (this.gameStateMachine.getGamePaddle().active) {
            if (!this.left?.isDown) {

                this.gameStateMachine.getGamePaddle().setVelocityX(0)
            } else {
                this.gameStateMachine.getGamePaddle().setVelocityX(-400)
            }

        }
    }
    protected onRightKeyPressDown(): void {
        if (this.gameStateMachine.getGameBallAndPaddleContainer().active) {

            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(400);
        }
        else if (this.gameStateMachine.getGamePaddle().active) {
            this.gameStateMachine.getGamePaddle().setVelocityX(400);

        }
    }
    protected onSpaceBarPressUp(): void {
        if (this.gameStateMachine.getGameBallAndPaddleContainer().active) {
            // this.scene.showHideGameStartPlayerMsg(false);
            this.gameStateMachine.lifeLoose();
            this.gameStateMachine.getGameBall().enableBody(true);
            this.gameStateMachine.getGameBallAndPaddleContainer().setActive(false);
            (this.gameStateMachine.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.enable = false;
            const velocityX = Phaser.Math.Between(-200, 200);
            this.gameStateMachine.getGameBall().setVelocity(velocityX, 400);
            this.space.enabled = false;

        }

    }
    protected onRestartKeyPressUp(): void {
        // this.scene.showHidegameOverMsg(false);
        this.scene.clearCurrentWall();
        this.createGameLevel.startLevelCreation(this.scene);
        this.collisionStateManager.onBrickAndBallCollision(this.scene, this.gameStateMachine.getTileRecord(), this.gameStateMachine.getGameBall());
        this.scene.resetToPlay();
        this.gameStateMachine.reset();
        this.left.enabled = true;
        this.right.enabled = true;
        this.space.enabled = true;
        this.restartKey.enabled = false;
    }
    public disableEnableLeftKey(value:boolean): void {
        this.left.enabled = value;
    }
    public disableEnableRightKey(value:boolean): void {
        this.right.enabled = value;
    }
    public disableEnableRestartKey(value:boolean): void {
        this.restartKey.enabled = value;
    }
    public disableEnableSpaceBar(value:boolean): void {
        this.space.enabled = value;
    }
}