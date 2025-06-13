
import { SceneName } from "../../GameConstants/SceneConstants";
import { GameStateManager } from "../../StateManger/GameStateManager";
import { CreateGameLevel } from "../../GameLevelCreationUnit/System/CreateGameLevel";
import { CollisionStateManager } from "../../CollisionHandlingUnit/System/CollisionStateManager";
import { GameSceneInputComponent } from "./Component/GameSceneInputComponent";
import { ExtendedScene } from "../../utility/ExtendedScene";
import { MsgGameSceneComponent } from "./Component/MsgGameSceneComponent";


export class GameScene extends ExtendedScene {

    private playermsg!: MsgGameSceneComponent;
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
        // this.intializePlayerMsg();

    }
    init(): void {
    }
    create(): void {
        this.createInitalGameSetup();
        this.physicsCollisionHandling();
        this.intializeInputHandling();
        // this.playermsg.showHideGameStartPlayerMsg(true);

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
    protected intializePlayerMsg(): void {
        this.playermsg = new MsgGameSceneComponent(this);
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
        this.gameInputComponent.disableEnableLeftKey(false);
        this.gameInputComponent.disableEnableRightKey(false);
        this.gameStateManager.islevelComplete = true;
        (this.gameStateManager.getGameBallAndPaddleContainer()).setActive(true);
        (this.gameStateManager.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.enable = true;
        this.gameStateManager.getGamePaddle().setVelocity(0);
        this.gameStateManager.updateLevel();
        this.createGameLevel.startLevelCreation(this);
        this.collisionStateManager.onBrickAndBallCollision(this, this.gameStateManager.getTileRecord(), (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody));
        this.gameStateManager.reset();
        this.resetToPlay();
        this.gameInputComponent.disableEnableLeftKey(true);
        this.gameInputComponent.disableEnableRightKey(true);
        // this.playermsg.showLevelPlayerMsg();
    }
    public lifeLineLost(): void {
        (this.gameStateManager.getGameBallAndPaddleContainer()).setActive(true);
        (this.gameStateManager.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.enable = true;
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
        this.gameStateManager.getGameBallAndPaddleContainer().setPosition(this.renderer.width / 2, this.renderer.height - ((this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).height * 0.25 + (this.gameStateManager.getGamePaddle() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).height * 0.25) / 2);
        this.gameInputComponent.disableEnableSpaceBar(true);
    }
    protected onGameOver(): void {
        this.gameStateManager.isGameOver = true;
        // this.playermsg.showHidegameOverMsg(true);
        this.gameInputComponent.disableEnableLeftKey(false);
        this.gameInputComponent.disableEnableRightKey(false);
        this.gameInputComponent.disableEnableSpaceBar(false);
        this.gameInputComponent.disableEnableRestartKey(true);
    }


}