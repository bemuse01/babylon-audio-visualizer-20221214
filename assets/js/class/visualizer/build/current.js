import Ring from '../../objects/ring.js'
import Method from '../../../method/method.js'

export default class{
    constructor({
        scene,
        engine,
        camera, 
        audio, 
        rtt,
    }){
        this.scene = scene
        this.engine = engine
        this.camera = camera
        this.audio = audio
        this.rtt = rtt

        this.planeHeight = 20
        this.fontSize = 512
        this.font = `${this.fontSize}px RobotoLight`
        this.color1 = BABYLON.Color3.FromHexString('#4dfff9')
        this.color2 = BABYLON.Color3.FromHexString('#4d33ea')

        this.textTexture = null

        this.init()
    }


    // init
    init(){
        this.create()
        this.animate()
        
        window.addEventListener('resize', () => this.resize(), false)
    }


    // create
    create(){
        const {planeHeight} = this
        const {planeWidth} = this.createTexture()
      
        const mat = new BABYLON.StandardMaterial(Method.uuidv4(), this.scene)
        mat.diffuseTexture = this.textTexture
        mat.diffuseTexture.hasAlpha = true
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1)

        const plane = BABYLON.MeshBuilder.CreatePlane('plane1', {width: planeWidth, height: planeHeight}, this.scene)
        plane.material = mat

        this.scene.removeMesh(plane)
        this.rtt.renderList.push(plane)
    }
    createTexture(){
        const text = '0:00'
        const textureHeight = 1.5 * this.fontSize
    
        const ratio = this.planeHeight / textureHeight
        
        const temp = new BABYLON.DynamicTexture('temp', 64, this.scene)
        const tmpctx = temp.getContext()
        tmpctx.font = this.font
        const textureWidth = tmpctx.measureText(text).width + 8

        const planeWidth = textureWidth * ratio

        this.textTexture = new BABYLON.DynamicTexture(Method.uuidv4(), {width: textureWidth, height: textureHeight}, this.scene, false)
        this.textTexture.drawText(text, null, null, this.font, '#ffffff', 'transparent', true)

        return {planeWidth}
    }
    createMaterial(){
        const material = new BABYLON.ShaderMaterial('particleShader', this.scene, {
                vertex: ShaderName,
                fragment: ShaderName,
            },
            {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'viewProjection', 'eResolution', 'oResolution', 'progress', 'color1', 'color2', 'radius', 'size'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            },
        )

        material.setVector2('eResolution', new BABYLON.Vector2(this.rw, this.rh))
        material.setVector2('oResolution', new BABYLON.Vector2(this.vw, this.vh))
        material.setColor3('color1', this.color1)
        material.setColor3('color2', this.color2)
        material.setFloat('radius', this.radius + this.linewidth / 2)
        material.setFloat('size', this.linewidth / 2)

        return material
    }


    // animate
    animate(){
        this.render()

        requestAnimationFrame(() => this.animate())
    }
    render(){
        if(!this.audio.isReady()) return
    }


    // resize
    resize(){
    }
}