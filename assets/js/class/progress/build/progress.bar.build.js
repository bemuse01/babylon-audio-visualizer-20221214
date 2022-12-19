export default class{
    constructor(){
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.style = {
            transform: 'scaleX(0)'
        }
    }


    // animate
    animate({audio}){
        const {currentTime, duration} = audio
        if(duration === 0) return
        const scale = (currentTime / duration) * 100
        this.style.transform = `scaleX(${scale}%)`
    }


    // get
    get(){
        return this.style
    }
}