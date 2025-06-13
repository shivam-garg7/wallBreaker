import Phaser from 'phaser';

const fragShader = `
#define SHADER_NAME BEND_WAVES_FS
  precision mediump float;
uniform float     uTime;
uniform sampler2D uMainSampler;
// uniform vec2 iResolution;
varying vec2 outTexCoord;
uniform vec2 lightPos;     // position (0 to 1)
uniform vec3 lightColor;   // RGB
uniform float lightRadius;
void main() {
vec2 iResolution = vec2(1920.0,1080.0);
    vec2 texel = vec2(1.0) / iResolution;

    vec2 min = vec2(294.4, 0.0) / iResolution;
    vec2 max = vec2(1624.4, 1080.0) / iResolution;

    vec4 color = vec4(0.0);
    vec2 uv = outTexCoord;

    if (outTexCoord.x > min.x && outTexCoord.x < max.x &&
        outTexCoord.y > min.y && outTexCoord.y < max.y) {
        
        vec4 texColor = texture2D(uMainSampler, outTexCoord);

    // float dist = distance(outTexCoord, lightPos);
    // float intensity = smoothstep(lightRadius, 0.0, dist); // fade from center

    // vec3 finalColor = mix(texColor.rgb, lightColor, intensity);

    // gl_FragColor = vec4(finalColor, texColor.a);
    gl_FragColor = texColor;
    } else {
          uv.x += 0.02 * sin((uv.y + (uTime * 0.1)) * 30.0);
    vec4 texColor = texture2D(uMainSampler, uv);
    gl_FragColor = texColor;
    }
}


`;

export default class BendWaves extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    private _time;

    constructor(game: Phaser.Game) {
        super({
            game,
            renderTarget: true,
            fragShader
        });
        this._time = 0;
    }

    onPreRender() {
        this._time += 0.005;
        this.set1f('uTime', this._time);
        // this.set2f('lightPos', 0.5, 0.8); // center
        // this.set3f('lightColor', 1.0, 0.8, 0.6); // warm orange
        // this.set1f('lightRadius', 0.1); // how far it spreads
    }
}