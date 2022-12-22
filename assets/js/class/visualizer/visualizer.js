import Bar from './build/bar.js'
import Progress from './build/progress.js'
import Current from './build/current.js'
import Method from '../../method/method.js'

export default class{
    constructor({app, audio}){
        this.engine = app.engine
        this.audio = audio

        this.scene = null
        this.camera = null
        this.cameraName = 'visualizerCamaera'
        this.cameraPos = new BABYLON.Vector3(0, 0, -100)
        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.vw = null
        this.vh = null
        this.vlsSample = 100
        this.rttSamples = 2 ** 3
        
        const color1 = BABYLON.Color3.FromHexString('#4dfff9')
        const color2 = BABYLON.Color3.FromHexString('#4d33ea')
        const scale = 0.85

        this.params = [
            {
                module: Bar,
                count: 100,
                width: 1.25 * scale,
                height: (1.25 + 2) * scale,
                radius: (25 - 2 / 2) * scale,
                splineSmooth: 0.2,
                audioBoost: 30,
                audioStep: 30,
                color1,
                color2,
                colorOffset: 0.0,
                masterOpacity: 0.275,
                effect: false,
                play: false,
                masterZ: 0.001
            },
            {
                module: Bar,
                count: 100,
                width: 1.25 * scale,
                height: 1.25 * scale,
                radius: 25 * scale,
                splineSmooth: 0.2,
                audioBoost: 30,
                audioStep: 30,
                color1,
                color2,
                colorOffset: 0.0,
                masterOpacity: 1.0,
                effect: true,
                play: true,
                masterZ: 0
            },
            {
                module: Progress,
                color1,
                color2,
                radius: 21.5 * scale,
                linewidth: 2 * scale,
                seg: 64
            },
            {
                module: Current,
                planeHeight: 20 * scale,
                color1,
                color2,
            }
        ]
        this.comps = []

        this.init()
    }


    // init
    init(){
        this.create()
        this.run()

        window.addEventListener('resize', () => this.resize(), false)
    }


    // create
    create(){
        this.createRenderObject()
        this.createObject()
        this.createPostProcess()
    }
    createRenderObject(){
        this.scene = new BABYLON.Scene(this.engine)
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

        this.camera = new BABYLON.FreeCamera(this.cameraName, this.cameraPos, this.scene)
        this.camera.setTarget(BABYLON.Vector3.Zero())
        
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

        this.rtt = new BABYLON.RenderTargetTexture(Method.uuidv4(), {width: this.rw, height: this.rh}, this.scene)
        this.rtt.samples = this.rttSamples
        console.log(this.rttSamples)
        this.scene.customRenderTargets.push(this.rtt)
    }
    createObject(){
        for(const param of this.params){
            const instance = param.module

            this.comps.push(
                new instance({
                    scene: this.scene, 
                    engine: this.engine, 
                    audio: this.audio, 
                    camera: this.camera, 
                    rtt: this.rtt,
                    ...param
                })
            )
        }
    }
    createPostProcess(){
        this.createVLS()
    }
    createVLS(){
        this.vls = new BABYLON.VolumetricLightScatteringPostProcess(
            'vls1', 
            1.0, 
            this.camera, 
            null,
            this.vlsSample, 
            BABYLON.Texture.BILINEAR_SAMPLINGMODE, 
            this.engine, 
            false
        )
        this.vls.mesh.material.diffuseTexture = this.rtt
        this.vls.mesh.material.diffuseTexture.hasAlpha = true
        this.vls.mesh.position = new BABYLON.Vector3(0, 0, 0)
    	this.vls.mesh.scaling = new BABYLON.Vector3(this.vw, this.vh, 1)
        // console.log(this.vw, this.vh)
    }


    // run
    run(){
        this.engine.runRenderLoop(() => {
            this.runRender()
        })
    }
    runRender(){
        this.scene.render()
    }


    // resize
    resize(){
        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.rw / this.rh, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

        this.rtt.resize({width: this.rw, height: this.rh})
    	this.vls.mesh.scaling = new BABYLON.Vector3(this.vw, this.vh, 1)
    }
}