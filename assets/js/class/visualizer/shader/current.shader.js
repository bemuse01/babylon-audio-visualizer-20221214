import ShaderMethod from '../../../method/method.shader.js'

const name = 'current'

const vertex = `
    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;

    uniform mat4 worldViewProjection;

    void main(){
        gl_Position = worldViewProjection * vec4(position, 1.0);

        vUv = uv;
    }
`
const fragment = `
    varying vec2 vUv;

    uniform vec2 eResolution;    
    uniform sampler2D tText;
    uniform vec3 color1;
    uniform vec3 color2;

    ${ShaderMethod.executeNormalizing()}

    void main(){
        vec2 coord1 = gl_FragCoord.xy - eResolution * 0.5;

        vec4 text = texture(tText, vUv);

        // progress circle
        // float radian = atan(coord1.x, -coord1.y);

        // float degree = degrees(radian);
        // float d1 = executeNormalizing(degree, 0.0, 1.0, 0.0, 180.0);
        // float d2 = executeNormalizing(degree, 0.0, 1.0, -180.0, 0.0);
        // vec3 color = vec3(1);

        // if(degree <= 180.0 && degree >= 0.0) color = mix(color2, color1, d1);
        // else color = mix(color1, color2, d2);

        vec3 color = mix(color2, color1, vUv.y);

        text.rgb = color;

        gl_FragColor = text;
    }
`

BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

export default name