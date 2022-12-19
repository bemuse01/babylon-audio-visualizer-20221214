import ShaderMethod from '../../../method/method.shader.js'

const name = 'VisualizerParticle'

const vertex = `
    #include<instancesDeclaration>

    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 aColor;

    // uniform mat4 worldViewProjection;
    // uniform float time;
    uniform mat4 viewProjection;

    varying vec3 vColor;

    void main(){
        #include<instancesVertex>

        gl_Position = viewProjection * finalWorld * vec4(position, 1.0);

        vColor = aColor;
    }
`
const fragment = `
    varying vec3 vColor;

    void main(){
        gl_FragColor = vec4(vColor, 1.0);
    }
`

BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

export default name