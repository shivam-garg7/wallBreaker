import { PlayerMsg } from "../../../utility/PlayerMsg";
import { GameScene } from "../GameScene";

export class MsgGameSceneComponent {
    private readonly scene: GameScene;
    private playermsg!: PlayerMsg;
    /**
     *
     */
    constructor(scene: GameScene) {
        this.scene = scene;
        this.createGamePlayerMsg()
    }
    protected createGamePlayerMsg(): void {
        this.playermsg = new PlayerMsg(this.scene, {
            gameStartGuide: "Welcome!!\nPress SpaceBar to start\nPress left and Right Key For Paddle",
            restartGuide: "Press The R Key to Restart Game",
            level: "Under Progress....."

        }, { x: this.scene.renderer.width / 2, y: this.scene.renderer.height / 2 }, false)
    }
    public showHidegameOverMsg(bol: boolean): void {
        this.playermsg.getPlayerMsg("restartGuide").setVisible(bol);
    }


    public showHideGameStartPlayerMsg(bol: boolean): void {
        this.playermsg.getPlayerMsg("gameStartGuide").setVisible(bol);
    }
    public showLevelPlayerMsg(): void {
        this.playermsg.getPlayerMsg("level").setVisible(true);
    }
}