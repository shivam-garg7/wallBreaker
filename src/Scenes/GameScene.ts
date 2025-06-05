import { Scene } from "phaser";
import { InputHandler } from "../utility/InputHandler";
import { keyAction } from "../GameConstants/InputConstants";
import { SceneName } from "../GameConstants/SceneConstants";
import { PlayerMsg } from "../utility/PlayerMsg";
import { GameStateManager } from "../StateManger/GameStateManager";
import { originalWidth } from "../main";
import { originalHeight } from "../main";
import { CreateGameLevel } from "../GameLevelCreationUnit/System/CreateGameLevel";
import { CollisionStateManager } from "../CollisionHandlingUnit/System/CollisionStateManager";

type PhysicsImage = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
export class GameScene extends Scene {
    private tilesArray!: PhysicsImage[];
    private brokenTileArray!: PhysicsImage[];
    private paddle!: PhysicsImage;
    private ball!: PhysicsImage;
    private bottomBorderLine!: Phaser.GameObjects.Line;
    private paddleBallContainer!: Phaser.GameObjects.Container;
    private left!: Phaser.Input.Keyboard.Key;
    private right!: Phaser.Input.Keyboard.Key;
    private space!: Phaser.Input.Keyboard.Key;
    private restartKey!: Phaser.Input.Keyboard.Key;
    private playermsg!: PlayerMsg;
    private readonly gameStateManager!: GameStateManager;
    private readonly createGameLevel!: CreateGameLevel;
    private readonly collisionStateManager!: CollisionStateManager;

    /**
     *
     */
    constructor() {
        super(SceneName.GAME_SCENE);
        this.gameStateManager = GameStateManager.getInstance();
        this.createGameLevel = CreateGameLevel.getInstance();
        this.collisionStateManager = CollisionStateManager.getInstance();


    }
    init(): void {
        this.tilesArray = [];
        this.brokenTileArray = [];
    }
    create(): void {
        this.createInitalGameSetup();
        this.physicsCollisionHandling();
        this.inputHandling();
        this.createGamePlayerMsg();
        this.showHideGameStartPlayerMsg(true);
        // Listen to the resize event
        this.scale.on('resize', this.onResize, this);

    }
    private onResize(gameSize: Phaser.Structs.Size): void {
        const { width, height } = gameSize;
        this.physics.world.setBounds(0, 0, width, height);
        const scaleX = this.scale.width / originalWidth;
        const scaleY = this.scale.height / originalHeight;
        const scale = Math.min(scaleX, scaleY);
        this.cameras.main.setZoom(scale);
    }
    protected createInitalGameSetup(): void {
        this.tilesArray = this.createGameLevel.startLevelCreation(this);
        this.paddle = this.createGameLevel.startPaddleCreation(this);
        this.ball = this.createGameLevel.startBallCreation(this);
        this.paddleBallContainer = this.createGameLevel.addBallAndPaddleToContainer(this, this.ball, this.paddle);
        this.bottomBorderLine = this.createGameLevel.startBorderLineCreation(this);
        this.physics.world.setBoundsCollision(true, true, true, false);
    }
    protected physicsCollisionHandling(): void {
        this.collisionStateManager.onBrickAndBallCollision(this,this.tilesArray,this.ball);
        this.collisionStateManager.onBallPaddleCollision(this.ball,this.paddle,this);
        this.collisionStateManager.onBallSceneOut(this.ball,this.bottomBorderLine,this);
    }
    public onLevelComplete(): void {
        this.gameStateManager.islevelComplete = true;
        this.left.enabled = false;
        this.right.enabled = false;
        this.playermsg.getPlayerMsg("level").setVisible(true);
    }
    public lifeLineLost(): void {
        this.paddleBallContainer.setActive(true);
        (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.enable = true;
        this.paddle.setVelocity(0);
        if (this.gameStateManager.lifeLines) {
            this.resetToPlay();
        } else {
            this.onGameOver();
        }

    }
    protected resetToPlay(): void {
        this.ball.disableBody(true);
        this.ball.setVelocity(0, 0);
        this.paddle.setPosition(0, 0);
        this.ball.setPosition(0, 0);
        this.paddleBallContainer.setPosition(this.renderer.width / 2, this.renderer.height - (this.ball.height * 0.25 + this.paddle.height * 0.25) / 2);
        this.space.enabled = true;
    }
    protected onGameOver(): void {
        this.gameStateManager.isGameOver = true;
        this.showHidegameOverMsg(true);
        this.left.enabled = false;
        this.right.enabled = false;
        this.space.enabled = false;
        this.restartKey.enabled = true;
    }
    protected showHidegameOverMsg(bol: boolean): void {
        this.playermsg.getPlayerMsg("restartGuide").setVisible(bol);
    }
    protected inputHandling(): void {

        this.left = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, this)!;
        this.left?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.DOWN], this.onLeftKeyPressDown, this);
        this.left?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onLeftKeyPressUp, this);
        this.right = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, this)!;
        this.right?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.DOWN], this.onRightKeyPressDown, this);
        this.right?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onRightKeyPressUp, this);
        this.space = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, this)!;
        this.space?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onSpaceBarPressUp, this);
        this.restartKey = InputHandler.addKey(Phaser.Input.Keyboard.KeyCodes.R, this)!;
        this.restartKey.enabled = false;
        this.restartKey?.on(keyAction[Phaser.Input.Keyboard.KeyCodes.UP], this.onRestartKeyPressUp, this);

    }
    protected onLeftKeyPressDown(): void {
        if (this.paddleBallContainer.active) {

            (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(-400);

        }
        else if (this.paddle.active) {

            this.paddle.setVelocityX(-400)
        }
    }
    protected onLeftKeyPressUp(): void {
        if (this.paddleBallContainer.active) {

            if (!this.right?.isDown) {

                (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(0);
            } else {
                (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(400)
            }
        }
        else if (this.paddle.active) {

            if (!this.right?.isDown) {

                this.paddle.setVelocityX(0)
            } else {
                this.paddle.setVelocityX(400)
            }
        }
    }
    protected onRightKeyPressUp(): void {
        if (this.paddleBallContainer.active) {

            if (!this.left?.isDown) {

                (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(0)
            } else {
                (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(-400)
            }
        }
        else if (this.paddle.active) {
            if (!this.left?.isDown) {

                this.paddle.setVelocityX(0)
            } else {
                this.paddle.setVelocityX(-400)
            }

        }
    }
    protected onRightKeyPressDown(): void {
        if (this.paddleBallContainer.active) {

            (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocityX(400);
        }
        else if (this.paddle.active) {
            this.paddle.setVelocityX(400);

        }
    }
    protected onSpaceBarPressUp(): void {
        if (this.paddleBallContainer.active) {
            this.showHideGameStartPlayerMsg(false);
            this.gameStateManager.lifeLoose();
            this.ball.enableBody(true);
            this.paddleBallContainer.setActive(false);
            (this.paddleBallContainer as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.enable = false;
            const velocityX = Phaser.Math.Between(-200, 200);
            this.ball.setVelocity(velocityX, 400);
            this.space.enabled = false;

        }

    }
    protected onRestartKeyPressUp(): void {
        this.showHidegameOverMsg(false);
        this.clearCurrentWall();
        this.tilesArray = this.createGameLevel.startLevelCreation(this);
        // this.addBrickCollisionWithBall();
        this.resetToPlay();
        this.gameStateManager.reset();
        this.left.enabled = true;
        this.right.enabled = true;
        this.space.enabled = true;
        this.restartKey.enabled = false;
    }
    protected clearCurrentWall(): void {
        for (const tile of this.tilesArray) {
            this.physics.world.remove(tile.body);
            tile.destroy(true);
        }
        this.tilesArray = [];
    }
    protected createGamePlayerMsg(): void {
        this.playermsg = new PlayerMsg(this, {
            gameStartGuide: "Welcome!!\nPress SpaceBar to start\nPress left and Right Key For Paddle",
            restartGuide: "Press The R Key to Restart Game",
            level: "Under Progress....."

        }, { x: this.renderer.width / 2, y: this.renderer.height / 2 }, false)
    }
    protected showHideGameStartPlayerMsg(bol: boolean): void {
        this.playermsg.getPlayerMsg("gameStartGuide").setVisible(bol);
    }
}