import ShaderMethod from '../../../method/method.shader.js'

const name = 'progress'

const vertex = `
    attribute vec3 position;
    // attribute vec2 uv;

    uniform mat4 worldViewProjection;
    // uniform mat4 viewProjection;

    void main(){
        vec3 nPosition = position;

        gl_Position = worldViewProjection * vec4(nPosition, 1.0);
    }
`
const fragment = `
    uniform vec2 eResolution;    
    uniform float progress;

    void main(){
        vec2 coord = gl_FragCoord.xy - eResolution * 0.5;

        float radian = atan(coord.y, coord.x) + radians(180.0);
        float opacity = 0.0;

        if(radian >= progress) opacity = 1.0;

        gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
    }
`

BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

export default name