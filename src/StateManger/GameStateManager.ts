import type { ITileRecordConfig } from "../Interface/ITileRecordConfig";
import { GameConstants } from "../GameConstants/SceneConstants";
import { IPhysicsBodyData } from "Interface/IPhysicsBodyData";

export class GameStateManager {
    private static instance: GameStateManager;
    private _lifeLines: number;
    private _isgameOver: boolean;
    private _currentGameLevel: number;
    private _islevelComplete: boolean;
    private _paddle!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _ball!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _paddleBallContainer!: Phaser.GameObjects.Container;
    private _backGroundContainer!: Phaser.GameObjects.Container;
    private _bottomBorderLine!: Phaser.GameObjects.Line;
    private _physicsBodyXPosition: IPhysicsBodyData;
    private _tilesRecord: Record<string, ITileRecordConfig>;
    private _tilesColliderRecord: Record<string, Phaser.Physics.Arcade.Collider>;

    /**
     *
     */
    constructor() {
        this._lifeLines = GameConstants.TOTAL_NUMBER_LIFE;
        this._isgameOver = false;
        this._islevelComplete = false;
        this._currentGameLevel = 1
        this._tilesRecord = {};
        this._tilesColliderRecord = {};
        this._physicsBodyXPosition = { x: undefined, y: undefined, width: undefined, height: undefined };
    }
    public static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }
    get lifeLines(): number { return this._lifeLines };

    public set lifeLines(value: number) {
        this._lifeLines = value;
    }

    get isGameOver(): boolean { return this._isgameOver };

    public set isGameOver(val: boolean) {
        this._isgameOver = val;
    }

    get islevelComplete(): boolean { return this._islevelComplete };

    public set islevelComplete(val: boolean) {
        this._islevelComplete = val;
    }
    get currentGameLevel(): number { return this._currentGameLevel };

    public set currentGameLevel(val: number) {
        this._currentGameLevel = val;
    }
    public updateLevel(): void {
        this._currentGameLevel++;
    }
    public lifeLoose(): void {
        this._lifeLines--;
    }
    public reset(): void {
        this._lifeLines = GameConstants.TOTAL_NUMBER_LIFE;
    }
    public getTileRecord(): Record<string, ITileRecordConfig> {
        return this._tilesRecord;
    }
    public getTileColliderRecord(key:string): Phaser.Physics.Arcade.Collider {
        return this._tilesColliderRecord[key];
    }
    public updateTileRecord(key: string, data: ITileRecordConfig): void {
        this._tilesRecord[key] = data;
    }
    public removeTileRecord(key: string): void {
        if (key in this._tilesRecord) {
            delete this._tilesRecord[key];
        }
    }
    public updateTileColliderRecord(key: string, data: Phaser.Physics.Arcade.Collider): void {
        this._tilesColliderRecord[key] = data;
    }
    public removeTileColliderRecord(key: string): void {
        if (key in this._tilesColliderRecord) {
            delete this._tilesColliderRecord[key];
        }
    }
    public setCreatedPaddle(value: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): void {
        this._paddle = value;
    }
    public getGamePaddle(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this._paddle;
    }
    public setCreatedBall(value: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): void {
        this._ball = value;
    }
    public getGameBall(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this._ball;
    }
    public setCreatedBallAndPaddleContainer(value: Phaser.GameObjects.Container): void {
        this._paddleBallContainer = value;
    }
    public getGameBallAndPaddleContainer(): Phaser.GameObjects.Container {
        return this._paddleBallContainer;
    }
    public setBackgroundContainer(value: Phaser.GameObjects.Container): void {
        this._backGroundContainer = value;
    }
    public getBackgroundContainer(): Phaser.GameObjects.Container {
        return this._backGroundContainer;
    }
    public setCreatedBottomBorderLine(value: Phaser.GameObjects.Line): void {
        this._bottomBorderLine = value;
    }
    public getGameBottomBorderLine(): Phaser.GameObjects.Line {
        return this._bottomBorderLine;
    }
    public setPhysicsBodyXPositionAndWidth(x: number, width: number): void {
        this._physicsBodyXPosition = { x: x, width: width };
    }
    public getGamePhysicsBodyData(): IPhysicsBodyData {
        return this._physicsBodyXPosition;
    }
    public removeBallFromContainer(): void {
        this._ball.body.enable = true;
        this._paddle.body.enable = true;
        this._paddleBallContainer.remove(this._ball);
        this._ball.x = this._paddleBallContainer.x;
        this._ball.y = this._paddleBallContainer.y;
    }
    public addBallFromContainer(): void {
        this._ball.body.enable = false;
        this._paddle.body.enable = false;
        this._paddleBallContainer.add(this._ball);
        this._ball.setPosition(0, 0);
    }
}