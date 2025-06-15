
import { GameScene } from "../GameScene";

export class MsgGameSceneComponent {
    private readonly scene: GameScene;
    private msgText!: Phaser.GameObjects.BitmapText;
    /**
     *
     */
    constructor(scene: GameScene) {
        this.scene = scene;
        this.entryPopPlayerMsg();
    }
    protected entryPopPlayerMsg(): void {
        this.msgText = this.scene.add.bitmapText(this.scene.renderer.width / 2, this.scene.renderer.height / 2,'arcadeFont',"GAME START PRESS SHIFT",50).setOrigin(0.5,0.5).setDepth(2000);
    }
    public updatePlayerMsg(msg:string):void{
        this.msgText.setText(msg);
    }
    public ShowPlayerMsg(val:boolean):void{
        this.msgText.setVisible(val);
    }
}