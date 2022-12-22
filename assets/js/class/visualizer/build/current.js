import Plane from '../../objects/plane.js'
import Method from '../../../method/method.js'
import ShaderName from '../shader/current.shader.js'

export default class{
    constructor({
        scene,
        engine,
        camera, 
        audio, 
        rtt,
        planeHeight,
        color1,
        color2,
        fontFamily
    }){
        this.scene = scene
        this.engine = engine
        this.camera = camera
        this.audio = audio
        this.rtt = rtt
        this.planeHeight = planeHeight
        this.color1 = color1
        this.color2 = color2

        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.fontSize = 512
        this.font = `${this.fontSize}px ${fontFamily}`

        this.plane = null
        this.textTexture = null
        this.textureWidth = 0
        this.textureHeight = 0

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
        const {planeHeight, scene} = this
        const {planeWidth} = this.createTexture()
        const material = this.createMaterial()
      
        this.plane = new Plane({width: planeWidth, height: planeHeight, scene})
        this.plane.setMaterial(material)

        this.scene.removeMesh(this.plane.get())
        this.rtt.renderList.push(this.plane.get())
    }
    createTexture(){
        const text = '0:00'
        this.textureHeight = 1.5 * this.fontSize
    
        const ratio = this.planeHeight / this.textureHeight
        
        const temp = new BABYLON.DynamicTexture('temp', 64, this.scene)
        const tmpctx = temp.getContext()
        tmpctx.font = this.font
        this.textureWidth = tmpctx.measureText(text).width + 8

        const planeWidth = this.textureWidth * ratio

        this.textTexture = new BABYLON.DynamicTexture(Method.uuidv4(), {width: this.textureWidth, height: this.textureHeight}, this.scene, false)
        this.textTexture.hasAlpha = true

        return {planeWidth}
    }
    createMaterial(){
        const material = new BABYLON.ShaderMaterial('currentShader', this.scene, {
                vertex: ShaderName,
                fragment: ShaderName,
            },
            {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'viewProjection', 'tText', 'eResolution', 'color1', 'color2'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            },
        )

        material.setVector2('eResolution', new BABYLON.Vector2(this.rw, this.rh))
        material.setTexture('tText', this.textTexture)
        material.setColor3('color1', this.color1)
        material.setColor3('color2', this.color2)

        return material
    }


    // animate
    animate(){
        this.render()

        requestAnimationFrame(() => this.animate())
    }
    render(){
        if(!this.audio.isReady()) return

        const ctx = this.textTexture.getContext()

        const crtTime = this.audio.getCurrentTime()
        const min = ~~(crtTime / 60)
        const oSec = ~~(crtTime % 60)
        const pSec = oSec < 10 ? '0' + oSec : oSec
        const text = `${min}:${pSec}`

        ctx.clearRect(0, 0, this.textureWidth, this.textureHeight)
        this.textTexture.drawText(text, null, null, this.font, '#ffffff', 'transparent', true)
    }


    // resize
    resize(){
    }
}