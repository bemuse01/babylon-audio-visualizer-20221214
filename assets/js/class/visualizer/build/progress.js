import Ring from '../../objects/ring.js'
import ShaderName from '../shader/progress.shader.js'

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

        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.radius = 21.5
        this.linewidth = 2
        this.seg = 64

        this.init()
    }


    // init
    init(){
        this.create()
        this.animate()
    }


    // create
    create(){
        const {radius, linewidth, seg, scene} = this

        const material = this.createMaterial()

        this.ring = new Ring({
            innerRadius: radius,
            outerRadius: radius + linewidth,
            seg,
            scene
        })

        // this.ring.get().rotation.z = 90 * RADIAN

        this.ring.setMaterial(material)

        this.scene.removeMesh(this.ring.get())
        this.rtt.renderList.push(this.ring.get())
    }
    createMaterial(){
        const material = new BABYLON.ShaderMaterial('particleShader', this.scene, {
                vertex: ShaderName,
                fragment: ShaderName,
            },
            {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'viewProjection', 'eResolution', 'progress'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            },
        )

        material.setVector2('eResolution', new BABYLON.Vector2(this.rw, this.rh))

        return material
    }


    // animate
    animate(){
        this.render()

        requestAnimationFrame(() => this.animate())
    }
    render(){
        if(!this.audio.isReady()) return

        const material = this.ring.getMaterial()

        const progress = (1 - this.audio.getProgress()) * 360 * RADIAN

        material.setFloat('progress', progress)
    }
}