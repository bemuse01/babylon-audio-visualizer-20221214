import Bar from './build/bar.js'
import Method from '../../method/method.js'

export default class{
    constructor({app, audio}){
        this.engine = app.engine
        this.audio = audio

        this.scene = null
        this.camera = null
        this.cameraName = 'visualizerCamaera'
        this.cameraPos = new BABYLON.Vector3(0, 100, 0)
        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.vw = null
        this.vh = null

        this.modules = {
            Bar
        }
        this.comps = {}

        this.init()
    }


    // init
    init(){
        this.create()
        this.run()

        window.addEventListener('resize', this.resize, false)
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
        
        this.vw = Method.getVisibleWidth(this.camera, this.rw / this.rh, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

        this.rtt = new BABYLON.RenderTargetTexture(Method.uuidv4(), {width: this.rw, height: this.rh}, this.scene)
        this.scene.customRenderTargets.push(this.rtt)
    }
    createObject(){
        for(const key in this.modules){
            const instance = this.modules[key]

            this.comps[key] = new instance({scene: this.scene, engine: this.engine, audio: this.audio, camera: this.camera, rtt: this.rtt})
        }
    }
    createPostProcess(){
        this.createVLS()
    }
    createVLS(){
        const sample = 100
        const vls = new BABYLON.VolumetricLightScatteringPostProcess(
            'vls1', 
            1.0, 
            this.camera, 
            null,
            sample, 
            BABYLON.Texture.BILINEAR_SAMPLINGMODE, 
            this.engine, 
            false
        )
        vls.mesh.material.diffuseTexture = this.rtt
        vls.mesh.material.diffuseTexture.hasAlpha = true
        vls.mesh.position = new BABYLON.Vector3(0, 0, 0)
    	vls.mesh.scaling = new BABYLON.Vector3(this.vw * 1, this.vh * 1, 1)

        // this.rtt.addPostProcess(vls)
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
        this.rw = engine.getRenderWidth()
        this.rh = engine.getRenderHeight()
        this.vw = Method.getVisibleWidth(this.camera, this.rw / this.rh, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)
    }
}