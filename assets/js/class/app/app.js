export default class{
    constructor(canvas){
        this.canvas = canvas

        this.init()
    }


    // init
    init(){
        this.create()

        window.addEventListener('resize', () => this.resize(), false)
    }


    // create
    create(){
        this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true})

        // this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3.Zero(), this.scene)
        // this.camera.setTarget(BABYLON.Vector3.Zero())
        // this.camera.attachControl(canvas, true)
    }


    // animate
    animate(){
        this.render()
    }
    render(){
    }


    // resize
    resize(){
        this.engine.resize()
    }
}