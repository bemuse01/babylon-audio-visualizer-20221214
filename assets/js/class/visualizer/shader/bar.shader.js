import ShaderMethod from '../../../method/method.shader.js'

const name = 'VisualizerParticle'

const vertex = `
    #include<instancesDeclaration>

    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 aColor;
    attribute float aAudio;

    // uniform mat4 worldViewProjection;
    // uniform float time;
    uniform mat4 viewProjection;

    varying vec3 vColor;

    void main(){
        #include<instancesVertex>

        vec3 nPosition = position;

        if(uv.y <= 0.5) nPosition.z -= aAudio;

        gl_Position = viewProjection * finalWorld * vec4(nPosition, 1.0);

        vColor = aColor;
    }
`
const fragment = `
    varying vec3 vColor;

    uniform float uOpacity;

    void main(){
        gl_FragColor = vec4(vColor, uOpacity);
    }
`

BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

export default name