import type { Scene } from "phaser";
import { GameStateManager } from "../../StateManger/GameStateManager";
import { LevelCreation } from "../Component/LevelCreation";
import { PatternLevelFifth, PatternLevelFourth, PatternLevelOne, PatternLevelSecond, PatternLevelSeventh, PatternLevelSixth, PatternLevelThird } from "../entity/PatternConfig";
import { BallAssetsData, BrickAssetsData, PaddleAssetsData } from "../entity/BuildingMaterialConfig";
import { PaddleCreation } from "../Component/PaddleCreation";
import { BallCreation } from "../Component/BallCreation";
import { BorderLineCreation } from "../Component/BorderLineCreation";
import { BallAndPaddleContainerCreation } from "../Component/BallAndPaddleContainer";
import { CreateBrokenBrick } from "../Component/CreateBrokenBrick";
import { BackGroundCreation } from "../Component/BackGroundCreation";

export class CreateGameLevel {
    private readonly gameState: GameStateManager;
    private readonly levelCreation: LevelCreation;
    private readonly paddleCreation: PaddleCreation;
    private readonly ballCreation: BallCreation;
    private readonly borderLineCreation: BorderLineCreation;
    private readonly ballAndPaddleContainerCreation: BallAndPaddleContainerCreation;
    private readonly createBrokenBrick: CreateBrokenBrick;
    private readonly backGroundCreation: BackGroundCreation;
    private levelCreationData: any[] = [];
    /**
     *
     */
    constructor() {
        this.gameState = GameStateManager.getInstance();
        this.levelCreation = LevelCreation.getInstance();
        this.paddleCreation = PaddleCreation.getInstance();
        this.ballCreation = BallCreation.getInstance();
        this.borderLineCreation = BorderLineCreation.getInstance();
        this.ballAndPaddleContainerCreation = BallAndPaddleContainerCreation.getInstance();
        this.createBrokenBrick = CreateBrokenBrick.getInstance();
        this.backGroundCreation = BackGroundCreation.getInstance();
        this.levelCreationData = [PatternLevelOne, PatternLevelSecond, PatternLevelThird, PatternLevelFourth, PatternLevelFifth, PatternLevelSixth, PatternLevelSeventh];
    }
    protected static createWallPattern: CreateGameLevel;
    public static getInstance(): CreateGameLevel {
        if (!CreateGameLevel.createWallPattern) {
            CreateGameLevel.createWallPattern = new CreateGameLevel();
        }
        return CreateGameLevel.createWallPattern;
    }
    public startLevelCreation(scene: Scene): any {
        return this.levelCreation.createWallOnPatternBased(scene, this.getlevelCreationData());
    }
    public startPaddleCreation(scene: Scene): any {
        return this.paddleCreation.createPaddle(scene);
    }
    public updatePaddle(scene: Scene): any {
        return this.paddleCreation.updatePaddle(scene);
    }
    public startBallCreation(scene: Scene): any {
        return this.ballCreation.createBall(scene);
    }
    public updateBall(scene: Scene): any {
        return this.ballCreation.updateBall(scene);
    }
    public createBackground(scene: Scene,size:number[]): any {
        return this.backGroundCreation.createBackGround(scene,size);
    }
    public startBorderLineCreation(scene: Scene): any {
        return this.borderLineCreation.createBorderLineCreation(scene);
    }
    public addBallAndPaddleToContainer(scene: Scene, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): any {
        return this.ballAndPaddleContainerCreation.createBallAndPaddleContainer(scene, ball, paddle)
    }
    public generateBrokenBricks(brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, scene: Scene): Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] {
        return this.createBrokenBrick.createBrokenBricks(brick, scene);
    }

    private getlevelCreationData(): any {
        return this.levelCreationData[this.gameState.currentGameLevel - 1];
    }

    public updateLevelCreationData(value: any[]): void {
        this.levelCreationData = value;
    }
    public updateBricksFramesKeyData(value: string[]): void {
        BrickAssetsData.bricksFramesKey = value;
    }
    public updateBallFramesKeyData(value: string[]): void {
        BallAssetsData.ballFramesKey = value;
    }
    public updatePaddleFramesKeyData(value: string[]): void {
        PaddleAssetsData.paddleFramesKey = value;
    }
}