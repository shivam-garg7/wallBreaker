import type { Scene } from "phaser";
import { PhysicsCollisionOnObjects } from "../Component/PhysicsCollisionOnObjects";

export class CollisionStateManager {
    protected static collisionStateManager: CollisionStateManager;
    private readonly physicsCollisionObjects: PhysicsCollisionOnObjects;
    public static getInstance(): CollisionStateManager {
        if (!CollisionStateManager.collisionStateManager) {
            CollisionStateManager.collisionStateManager = new CollisionStateManager();
        }
        return CollisionStateManager.collisionStateManager;
    }
    /**
     *
     */
    constructor() {
        this.physicsCollisionObjects = PhysicsCollisionOnObjects.getInstance();
    }
    public onBrickAndBallCollision(scene: Scene, tilesArray: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[], ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody): void {
        this.physicsCollisionObjects.addBrickCollisionWithBall(scene, tilesArray, ball);
    }
    public onBallPaddleCollision(ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, scene: Scene): void {
        this.physicsCollisionObjects.onBallPaddleCollision(ball, paddle, scene);
    }
    public onBallSceneOut(ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, bottomBorderLine: Phaser.GameObjects.Line, scene: Scene):void{
        this.physicsCollisionObjects.onBallSceneOut(ball,bottomBorderLine,scene);
    }
}