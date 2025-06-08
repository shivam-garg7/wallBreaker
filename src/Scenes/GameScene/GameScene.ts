
import { SceneName } from "../../GameConstants/SceneConstants";
import { PlayerMsg } from "../../utility/PlayerMsg";
import { GameStateManager } from "../../StateManger/GameStateManager";
import { CreateGameLevel } from "../../GameLevelCreationUnit/System/CreateGameLevel";
import { CollisionStateManager } from "../../CollisionHandlingUnit/System/CollisionStateManager";
import { GameSceneInputComponent } from "./Component/GameSceneInputComponent";
import { ExtendedScene } from "../../utility/ExtendedScene";
import { originalHeight, originalWidth } from "../../main";
import { BackGroundShaders } from "../../shaders/BackGroundShaders";

export class GameScene extends ExtendedScene {

    private playermsg!: PlayerMsg;
    private readonly gameStateManager!: GameStateManager;
    private readonly createGameLevel!: CreateGameLevel;
    private readonly collisionStateManager!: CollisionStateManager;
    private gameInputComponent!: GameSceneInputComponent;

    /**
     *
     */
    constructor() {
        super({ key: SceneName.GAME_SCENE });
        this.gameStateManager = GameStateManager.getInstance();
        this.createGameLevel = CreateGameLevel.getInstance();
        this.collisionStateManager = CollisionStateManager.getInstance();


    }
    init(): void {
    }
    create(): void {
        this.createInitalGameSetup();
        this.physicsCollisionHandling();
        this.intializeInputHandling();
        this.createGamePlayerMsg();
        this.showHideGameStartPlayerMsg(true);
        this.scale.on('resize', this.onResize, this);
        // const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
        // renderer.pipelines.add("glowpipeline",new BackGroundShaders(this.game));
        // this.gameStateManager.getGamePaddle().setPipeline("glowpipeline");
    }
    protected onResize(gameSize: Phaser.Structs.Size): void {
        super.onResize(gameSize);
        const scaleX = this.scale.width / originalWidth;
        const scaleY = this.scale.height / originalHeight;
        const scale = Math.min(scaleX, scaleY);
        this.cameras.main.setZoom(scale);
    }
    protected createInitalGameSetup(): void {
        this.createGameLevel.createBackground(this, [1920, 1080]);
        this.createGameLevel.startLevelCreation(this);
        this.createGameLevel.startPaddleCreation(this);
        this.createGameLevel.startBallCreation(this);
        this.createGameLevel.addBallAndPaddleToContainer(this, (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody), (this.gameStateManager.getGamePaddle() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody));
        this.createGameLevel.startBorderLineCreation(this);
        this.physics.world.setBoundsCollision(true, true, true, false);
        const physicsBodyData = this.gameStateManager.getGamePhysicsBodyData();
        this.physics.world.setBounds(physicsBodyData.x ? physicsBodyData.x : 0, physicsBodyData.y ? physicsBodyData.y : 0, physicsBodyData.width ? physicsBodyData.width : this.renderer.width, physicsBodyData.height ? physicsBodyData.height : this.renderer.height);
    }
    protected physicsCollisionHandling(): void {
        this.collisionStateManager.onBrickAndBallCollision(this, this.gameStateManager.getTileRecord(), (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody));
        this.collisionStateManager.onBallPaddleCollision((this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody), (this.gameStateManager.getGamePaddle() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody), this);
        this.collisionStateManager.onBallSceneOut((this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody), (this.gameStateManager.getGameBottomBorderLine() as Phaser.GameObjects.Line), this);
    }
    protected intializeInputHandling(): void {
        this.gameInputComponent = new GameSceneInputComponent(this, this.createGameLevel, this.collisionStateManager);
    }
    public clearCurrentWall(): void {
        Object.entries(this.gameStateManager.getTileRecord()).forEach(([key, value]) => {
            const tileRecord = value.tileValue;
            this.physics.world.remove(tileRecord.body);
            this.gameStateManager.removeTileRecord(key);
            tileRecord.destroy(true);
        });
    }
    public onLevelComplete(): void {
        this.gameStateManager.islevelComplete = true;
        this.gameStateManager.updateLevel();
        this.createGameLevel.startLevelCreation(this);
        this.gameInputComponent.disableEnableLeftKey(false);
        this.gameInputComponent.disableEnableRightKey(false);
        this.playermsg.getPlayerMsg("level").setVisible(true);
    }
    public lifeLineLost(): void {
        (this.gameStateManager.getGameBallAndPaddleContainer() as Phaser.GameObjects.Container).setActive(true);
        ((this.gameStateManager.getGameBallAndPaddleContainer() as Phaser.GameObjects.Container) as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.enable = true;
        this.gameStateManager.getGamePaddle().setVelocity(0);
        if (this.gameStateManager.lifeLines) {
            this.resetToPlay();
        } else {
            this.onGameOver();
        }

    }
    public resetToPlay(): void {
        (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).disableBody(true);
        (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setVelocity(0, 0);
        (this.gameStateManager.getGamePaddle() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setPosition(0, 0);
        (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setPosition(0, 0);
        (this.gameStateManager.getGameBallAndPaddleContainer() as Phaser.GameObjects.Container).setPosition(this.renderer.width / 2, this.renderer.height - ((this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).height * 0.25 + (this.gameStateManager.getGamePaddle() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).height * 0.25) / 2);
        this.gameInputComponent.disableEnableSpaceBar(true);
    }
    protected onGameOver(): void {
        this.gameStateManager.isGameOver = true;
        this.showHidegameOverMsg(true);
        this.gameInputComponent.disableEnableLeftKey(false);
        this.gameInputComponent.disableEnableRightKey(false);
        this.gameInputComponent.disableEnableSpaceBar(false);
        this.gameInputComponent.disableEnableRestartKey(true);
    }
    public showHidegameOverMsg(bol: boolean): void {
        this.playermsg.getPlayerMsg("restartGuide").setVisible(bol);
    }

    protected createGamePlayerMsg(): void {
        this.playermsg = new PlayerMsg(this, {
            gameStartGuide: "Welcome!!\nPress SpaceBar to start\nPress left and Right Key For Paddle",
            restartGuide: "Press The R Key to Restart Game",
            level: "Under Progress....."

        }, { x: this.renderer.width / 2, y: this.renderer.height / 2 }, false)
    }
    public showHideGameStartPlayerMsg(bol: boolean): void {
        this.playermsg.getPlayerMsg("gameStartGuide").setVisible(bol);
    }

}