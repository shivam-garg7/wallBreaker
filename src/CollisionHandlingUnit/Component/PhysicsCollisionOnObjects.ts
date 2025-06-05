import type { Scene } from "phaser";
import { GameStateManager } from "../../StateManger/GameStateManager";
import { CreateGameLevel } from "../../GameLevelCreationUnit/System/CreateGameLevel";
import type { GameScene } from "../../Scenes/GameScene";

export class PhysicsCollisionOnObjects {
    protected static physicsCollisionOnObjects: PhysicsCollisionOnObjects;
    protected gameStateMachine: GameStateManager;
    private readonly createLevelUnit: CreateGameLevel;
    public static getInstance(): PhysicsCollisionOnObjects {
        if (!PhysicsCollisionOnObjects.physicsCollisionOnObjects) {
            PhysicsCollisionOnObjects.physicsCollisionOnObjects = new PhysicsCollisionOnObjects();
        }
        return PhysicsCollisionOnObjects.physicsCollisionOnObjects;
    }
    /**
     *
     */
    constructor() {
        this.gameStateMachine = GameStateManager.getInstance();
        this.createLevelUnit = CreateGameLevel.getInstance();
    }
    public onBallPaddleCollision(ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, scene: Scene): void {
        scene.physics.add.collider(ball,
            paddle
        );


    }
    public onBallSceneOut(ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, bottomBorderLine: Phaser.GameObjects.Line, scene: Scene): void {
        scene.physics.add.overlap(ball, bottomBorderLine, (scene as GameScene).lifeLineLost.bind(scene), undefined, this);
    }
    public addBrickCollisionWithBall(scene: Scene, tilesArray: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[], ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): void {
        for (const tile of tilesArray) {

            scene.physics.add.collider(ball,
                tile,
                (ball, tile) => {

                    this.BrokenBricks(tile, scene);
                    this.handleBrickCollision(ball, tile, scene, tilesArray);
                },
                undefined,
                this);

        }
    }
    private handleBrickCollision(ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, scene: Scene, tilesArray: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]) {
        tilesArray = tilesArray.filter(item => item !== brick);
        scene.physics.world.remove((brick as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).body);
        this.gameStateMachine.removeTileRecord((brick as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).name);
        if(Object.entries(this.gameStateMachine.getTileRecord()).length == 0){
            (scene as GameScene).onLevelComplete.bind(scene);
        }
        brick.destroy(true);

    }
    protected BrokenBricks(brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, scene: Scene): void {
        const brokenBricks = this.createLevelUnit.generateBrokenBricks(brick, scene);
        for (const brokenBrick of brokenBricks) {
            this.removeBrickFromScene(brokenBrick, scene);
        }

    }
    private removeBrickFromScene(brokenBrick: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, scene: Scene): void {
        scene.time.delayedCall(1000, (brokenBrick: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, scene: Scene) => {
            scene.physics.world.remove(brokenBrick.body);
            brokenBrick.destroy(true);
        }, [brokenBrick, scene], this);
    }
}