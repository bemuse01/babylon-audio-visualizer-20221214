import Ring from '../../objects/ring.js'

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

        this.radius = 22
        this.linewidth = 2
        this.seg = 64

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {radius, linewidth, seg, scene} = this

        this.ring = new Ring({
            innerRadius: radius,
            outerRadius: radius + linewidth,
            seg,
            scene
        })

        // this.ring.get().rotation.x = 90 * RADIAN
    }
}