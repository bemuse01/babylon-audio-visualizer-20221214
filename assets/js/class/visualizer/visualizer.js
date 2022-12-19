import Bar from './build/bar.js'

export default class{
    constructor({app, audio}){
        this.engine = app.engine
        this.audio = audio

        this.cameraName = 'visualizerCamaera'
        this.cameraPos = new BABYLON.Vector3(0, 100, 0)

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
    }
    createRenderObject(){
        this.scene = new BABYLON.Scene(this.engine)
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

        this.camera = new BABYLON.FreeCamera(this.cameraName, this.cameraPos, this.scene)
        this.camera.setTarget(BABYLON.Vector3.Zero())
    }
    createObject(){
        for(const key in this.modules){
            const instance = this.modules[key]

            this.comps[key] = new instance({scene: this.scene, engine: this.engine, audio: this.audio})
        }
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

    }
}