import type { ITileRecordConfig } from "../Interface/ITileRecordConfig";
import { GameConstants } from "../GameConstants/SceneConstants";

export class GameStateManager {
    private static instance: GameStateManager;
    private _lifeLines: number;
    private _isgameOver: boolean;
    private _currentGameLevel: number;
    private _islevelComplete: boolean;
    private _tilesRecord: Record<string, ITileRecordConfig>;

    /**
     *
     */
    constructor() {
        this._lifeLines = GameConstants.TOTAL_NUMBER_LIFE;
        this._isgameOver = false;
        this._islevelComplete = false;
        this._currentGameLevel = 1
        this._tilesRecord = {};
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
    public updateTileRecord(key: string, data: ITileRecordConfig): void {
        this._tilesRecord[key] = data;
    }
    public removeTileRecord(key: string): void {
        if (key in this._tilesRecord) {
            delete this._tilesRecord[key];
        }   
    }
}