
import { GameLevels, SceneName } from "../../GameConstants/SceneConstants";
import { GameStateManager } from "../../StateManger/GameStateManager";
import { CreateGameLevel } from "../../GameLevelCreationUnit/System/CreateGameLevel";
import { CollisionStateManager } from "../../CollisionHandlingUnit/System/CollisionStateManager";
import { ExtendedScene } from "../../utility/ExtendedScene";
import { MsgGameSceneComponent } from "./Component/MsgGameSceneComponent";
import { originalHeight, originalWidth } from "../../main";
import { InputHandlingComponent } from "./Component/InputHandlingComponent";


export class GameScene extends ExtendedScene {

    private playermsg!: MsgGameSceneComponent;
    private readonly gameStateManager!: GameStateManager;
    private readonly createGameLevel!: CreateGameLevel;
    private readonly collisionStateManager!: CollisionStateManager;
    private inputHandlingComponent!: InputHandlingComponent;

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
        this.inputHandling();
        this.initializePlayerMsg();
        this.gameStateManager.isGameOver = false;
    }
    protected createInitalGameSetup(): void {
        this.createGameLevel.createBackground(this, [originalWidth, originalHeight]);
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
    protected inputHandling(): void {
        this.inputHandlingComponent = new InputHandlingComponent(this);
    }
    protected initializePlayerMsg(): void {
        this.playermsg = new MsgGameSceneComponent(this);
    }
    public clearCurrentWall(): void {
        Object.entries(this.gameStateManager.getTileRecord()).forEach(([key, value]) => {
            const tileRecord = value.tileValue;
            this.physics.world.remove(tileRecord.body);
            this.gameStateManager.removeTileRecord(key);
            this.gameStateManager.getTileColliderRecord(key).destroy();
            this.gameStateManager.removeTileColliderRecord(key);
            tileRecord.destroy(true);
        });
    }
    public onLevelComplete(): void {
        this.showPlayerMsg(true);
        this.playermsg.updatePlayerMsg("HURRY LEVEL COMPLETE !!!");
        const timer = this.time.delayedCall(2000,
            () => {
                this.showPlayerMsg(false);
                timer.remove(true);
                timer.destroy();
                this.gameStateManager.updateLevel();
                if (this.gameStateManager.currentGameLevel == GameLevels.TOTAL_NUMBER_OF_GAME_LEVEL + 1) {
                    this.allLevelComplete();
                    return;
                }
                this.updateBackground();
                this.onGameOver();
                this.inputHandlingComponent.onRestartKeyPressUp();

            },
            undefined,
            this
        );
    }
    protected updateBackground(): void {

        this.createGameLevel.updateBackGround(this, [originalWidth, originalHeight]);

    }
    public lifeLineLost(): void {
        this.gameStateManager.lifeLoose();
        if (this.gameStateManager.lifeLines == 0) {
            this.onGameOver();

        } else {
            this.resetToPlay();
        }
    }
    public resetToPlay(): void {
        this.gameStateManager.addBallFromContainer();
        this.alignBallAndPaddleContainer();
        this.inputHandlingComponent.disableEnableSpaceBar(true);
    }
    protected onGameOver(): void {
        this.showPlayerMsg(true);
        this.playermsg.updatePlayerMsg("GAME OVER PRESS R TO RESTART");
        this.gameStateManager.isGameOver = true;
        this.gameStateManager.getGameBall().visible = false;
        this.gameStateManager.getGameBall().body.enable = false;
        (this.gameStateManager.getGameBallAndPaddleContainer() as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setVelocity(0, 0);
        this.inputHandlingComponent.disableEnableRestartKey(true);
    }
    protected alignBallAndPaddleContainer(): void {
        this.gameStateManager.getGameBallAndPaddleContainer().setX(this.renderer.width / 2);
    }
    public wallCreationAndCollision(): void {
        this.createGameLevel.startLevelCreation(this);
        this.collisionStateManager.onBrickAndBallCollision(this, this.gameStateManager.getTileRecord(), (this.gameStateManager.getGameBall() as Phaser.Types.Physics.Arcade.ImageWithDynamicBody));
    }
    protected allLevelComplete(): void {
        // to do.
    }
    public showPlayerMsg(val: boolean): void {
        this.playermsg.ShowPlayerMsg(val);
    }
}