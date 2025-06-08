import { Game } from "phaser";

export class BackGroundShaders extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
/**
 *
 */
constructor(game:Game) {
    super({
        game:game,
        fragShader:
        `
       precision mediump float;

        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;

        void main() {
          // Sample original texture
          vec4 color = texture2D(uMainSampler, outTexCoord);

          // Override with RED
          gl_FragColor  = vec4(color.r*0.7,0.0,0.0, 1);
        }

        `
    });
    
}
}