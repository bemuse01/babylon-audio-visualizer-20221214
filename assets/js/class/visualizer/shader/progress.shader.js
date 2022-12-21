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
    uniform vec2 oResolution;    
    uniform float progress;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float radius;
    uniform float size;

    ${ShaderMethod.executeNormalizing()}

    void main(){
        vec2 coord1 = gl_FragCoord.xy - eResolution * 0.5;
        vec2 coord2 = oResolution * (gl_FragCoord.xy / eResolution) - oResolution * 0.5;

        float radian = atan(coord1.x, -coord1.y);
        float p1 = radians(mix(180.0, -180.0, progress));
        float p2 = radians(mix(90.0, -270.0, progress));
        float opacity = 0.0;

        if(radian >= p1) opacity = 1.0;

        float degree = degrees(radian);
        float d1 = executeNormalizing(degree, 0.0, 1.0, 0.0, 180.0);
        float d2 = executeNormalizing(degree, 0.0, 1.0, -180.0, 0.0);
        vec3 color = vec3(1);

        if(degree <= 180.0 && degree >= 0.0) color = mix(color2, color1, d1);
        else color = mix(color1, color2, d2);

        // rounded edge
        float x1 = cos(p2) * radius;
        float y1 = sin(p2) * radius;
        float x2 = cos(radians(90.0)) * radius;
        float y2 = sin(radians(90.0)) * radius;
        float dist1 = distance(vec2(x1, y1), coord2);
        float dist2 = distance(vec2(x2, y2), coord2);
        
        if(dist1 < size) opacity = 1.0;
        if(dist2 < size) opacity = 1.0;

        gl_FragColor = vec4(color, opacity);
    }
`

BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

export default name