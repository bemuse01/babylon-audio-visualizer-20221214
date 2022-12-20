import ShaderName from '../shader/bar.shader.js'
import RoundedPlane from '../../objects/roundedPlane.js'
import Method from '../../../method/method.js'
import Spline from '../../../lib/cubic-spline.js'

export default class{
    constructor({
        scene,
        engine,
        camera, 
        audio, 
        rtt,
        count, 
        width, 
        height, 
        radius, 
        color1, 
        color2, 
        colorOffset, 
        splineSmooth,
        audioBoost,
        audioStep,
        masterOpacity,
        effect,
        play,
        masterZ
    }){
        this.scene = scene
        this.engine = engine
        this.camera = camera
        this.audio = audio
        this.rtt = rtt
        this.count = count
        this.width = width
        this.height = height
        this.radius = radius
        this.color1 = color1
        this.color2 = color2
        this.colorOffset = colorOffset
        this.splineSmooth = splineSmooth
        this.audioBoost = audioBoost
        this.audioStep = audioStep
        this.masterOpacity = masterOpacity
        this.effect = effect
        this.play = play
        this.masterZ = masterZ

        this.edgeRadius = this.width / 2
        this.seg = 32

        this.plane = null
        this.xs = Array.from({length: this.count}, (_, i) => i * 1)

        this.init()
    }


    // init
    init(){
        this.create()
        if(this.play) this.animate()
    }


    // create
    create(){
        const {count, width, height, edgeRadius, radius, seg, scene, engine, camera} = this

        const material = this.createMaterial()
        this.plane = new RoundedPlane({width, height, radius: edgeRadius, seg, scene, engine})
        this.plane.get().isVisible = false
        this.plane.setMaterial(material)


        const {color, audio} = this.createAttribute()
        this.plane.setAttribute('aColor', new Float32Array(color), 3, true)
        this.plane.setAttribute('aAudio', new Float32Array(audio), 1, true)
        // this.plane.setAttribute('aPosition', new Float32Array(position), 3, true)

        const mesh = this.plane.get()
        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = (degree * i - 90)

            const x = Math.cos(deg * RADIAN) * radius
            const y = Math.sin(deg * RADIAN) * radius

            const name = Method.uuidv4()
            const instance = mesh.createInstance(name)

            instance.rotation.z = (90 + deg) * RADIAN

            instance.position.x = x
            instance.position.y = y
            instance.position.z = this.masterZ


            if(this.effect){
                this.scene.removeMesh(instance)
                this.rtt.renderList.push(instance)
            }
        }
    }
    createAttribute(){
        const {count, radius} = this

        const position = []
        const color = []
        const audio = []

        const degree = 360 / count
        const halfCount = count / 2

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN

            // position
            const x = Math.cos(deg) * radius
            const z = Math.sin(deg) * radius

            position.push(x, 0, z)

            // color
            const idx = i < halfCount
            const p = (i % halfCount) / halfCount
            const t =  idx ? Method.clamp(p - this.colorOffset, 0, 1) : Method.clamp(1 - this.colorOffset - p, 0, 1)
            const c = BABYLON.Color3.Lerp(this.color1, this.color2, t)

            const r = c.r
            const g = c.g
            const b = c.b

            color.push(r, g, b)

            // audio
            audio.push(0)
        }

        return{
            position,
            color,
            audio
        }
    }
    createMaterial(){
        const material = new BABYLON.ShaderMaterial('particleShader', this.scene, {
            vertex: ShaderName,
            fragment: ShaderName,
        },
        {
            attributes: ['position', 'uv', 'aColor', 'aAudio'],
            uniforms: ['worldViewProjection', 'viewProjection', 'uOpacity'],
            needAlphaBlending: true,
            needAlphaTesting: true,
            // sideOrientation: BABYLON.Mesh.DOUBLESID
        },
        )

        material.setFloat('uOpacity', this.masterOpacity)

        return material
    }


    // animate
    animate(){
        this.render()

        requestAnimationFrame(() => this.animate())
    }
    render(){
        const {audioData} = this.audio

        if(!audioData) return

        const stepData = this.createStepAudioData(audioData)
        const splinedData = this.createSplinedAudioData(stepData)

        const aAudio = this.plane.getAttribute('aAudio')
        const aAudioData = aAudio.getData()

        for(let i = 0; i < this.count; i++){
            aAudioData[i] = splinedData[i]
        }

        aAudio.update(aAudioData)
    }
    createStepAudioData(audioData){
        return Array.from({length: this.count}, (_, i) => audioData[i * this.audioStep] / 255)
    }
    createSplinedAudioData(audioData){
        const len = audioData.length
        const ats = []

        const xs = this.xs
        const ys = audioData
        // ys[0] = 0

        const spline = new Spline(xs, ys)
        
        for(let i = 0; i < len; i++){
            ats.push(spline.at(i * this.splineSmooth))
        }
        
        const avg = (ats.reduce((p, c) => p + c) / len) * 0.9
        const temp = ats.map(e => Math.max(0, e - avg) * this.audioBoost)

        // const reverse = [...temp]
        // reverse.reverse()

        // return [...temp, ...reverse]
        return temp
    }
}