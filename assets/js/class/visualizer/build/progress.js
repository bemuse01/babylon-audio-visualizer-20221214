import Ring from '../../objects/ring.js'
import ShaderName from '../shader/progress.shader.js'
import Method from '../../../method/method.js'

export default class{
    constructor({
        scene,
        engine,
        camera, 
        audio, 
        rtt,
        radius,
        linewidth,
        seg,
        color1,
        color2,
    }){
        this.scene = scene
        this.engine = engine
        this.camera = camera
        this.audio = audio
        this.rtt = rtt
        this.radius = radius
        this.linewidth = linewidth
        this.seg = seg
        this.color1 = color1
        this.color2 = color2

        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

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
        const material = new BABYLON.ShaderMaterial('progressShader', this.scene, {
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

        const material = this.ring.getMaterial()
        const p = this.audio.getProgress()

        // const progress = (1 - this.audio.getProgress()) * 360 * RADIAN
        // const progress = BABYLON.Scalar.Lerp(-90, 90, p) * RADIAN

        material.setFloat('progress', p)
    }


    // resize
    resize(){
        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

        const material = this.ring.getMaterial()

        material.setVector2('eResolution', new BABYLON.Vector2(this.rw, this.rh))
        material.setVector2('oResolution', new BABYLON.Vector2(this.vw, this.vh))
    }
}