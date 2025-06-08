
import { LoadConstants, SceneName } from "../GameConstants/SceneConstants";
import { ExtendedScene } from "../utility/ExtendedScene";


export class LoadingScene extends ExtendedScene {
  protected rec?: Phaser.GameObjects.Rectangle;
  /**
   *
   */
  constructor() {
    super({ key: SceneName.LOADING_SCENE });
  }
  init(): void {
    this.add.text(this.renderer.width / 2 - 20, 300, "Loading....", {})
    this.rec = this.add.rectangle(this.renderer.width / 2 - 50, this.renderer.height / 2 - 10, 200, 20, 0xFFFFFF).setOrigin(0, 0);

  }
  preload(): void {
    try {
      this.load.pack(LoadConstants.GAME_SCREEN_ASSETS_BUNDLE, './manifest.json');
      this.load.on(LoadConstants.PROGRESS, (percentage: number) => {
        (this.rec as any).width = 200 * percentage;
      });
      this.load.on('loaderror', () => {
        console.error('Failed to load assets');
      });

    } catch (error) {
      console.error('Error during preload:', error);
    }
  }
  create(): void {
    this.scene.start(SceneName.GAME_SCENE);
    this.scene.remove();
     this.scale.on('resize', this.onResize, this);
  }
}