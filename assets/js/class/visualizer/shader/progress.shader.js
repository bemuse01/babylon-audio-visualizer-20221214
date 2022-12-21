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
    uniform vec3 color1;
    uniform vec3 color2;

    ${ShaderMethod.executeNormalizing()}

    void main(){
        vec2 coord = gl_FragCoord.xy - eResolution * 0.5;

        float radian = atan(coord.x, -coord.y);
        float p = radians(mix(180.0, -180.0, progress));
        float opacity = 0.0;

        if(radian >= p) opacity = 1.0;

        float degree = degrees(radian);
        float d1 = executeNormalizing(degree, 0.0, 1.0, 0.0, 180.0);
        float d2 = executeNormalizing(degree, 0.0, 1.0, -180.0, 0.0);
        vec3 color = vec3(1);

        if(degree <= 180.0 && degree >= 0.0) color = mix(color2, color1, d1);
        else color = mix(color1, color2, d2);

        gl_FragColor = vec4(color, opacity);
    }
`

BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

export default name