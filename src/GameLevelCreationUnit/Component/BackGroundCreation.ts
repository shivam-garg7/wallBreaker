import { BackGroundImage } from "../entity/BackGroundConfig";
import { GameStateManager } from "../../StateManger/GameStateManager";
import { Scene } from "phaser";
import { LevelCreationConstants } from "../../GameConstants/LevelCreationContants";

export class BackGroundCreation {
    protected static backGroundCreation: BackGroundCreation;
    protected gameStateMachine: GameStateManager;
    private readonly levelImages: { image: string[]; }[];
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
        this.levelImages = [BackGroundImage.Level1, BackGroundImage.Level2, BackGroundImage.Level3, BackGroundImage.Level4, BackGroundImage.Level5, BackGroundImage.Level6, BackGroundImage.Level7, BackGroundImage.Level8]
    }
    public static getInstance(): BackGroundCreation {
        if (!BackGroundCreation.backGroundCreation) {
            BackGroundCreation.backGroundCreation = new BackGroundCreation();
        }
        return BackGroundCreation.backGroundCreation;
    }
    public createBackGround(scene: Scene,size:number[]): Phaser.GameObjects.Container {
        const con : Phaser.GameObjects.Container = scene.add.container(0,0);
        for (const image of this.levelImages[this.gameStateMachine.currentGameLevel - 1].image) {
            const backGround = scene.add.sprite(0, 0, LevelCreationConstants.BACKGROUND_ATLAS_KEY, image);
            backGround.setDisplaySize(size[0],size[1]).setPosition(backGround.displayWidth/2,backGround.displayHeight/2);
            con.add(backGround);
        }
        return con;
    }
    public removeBackGround(): void {
        // to do
    }
}