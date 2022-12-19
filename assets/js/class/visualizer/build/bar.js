import ShaderName from '../shader/bar.shader.js'
import RoundedPlane from '../../objects/roundedPlane.js'
import Method from '../../../method/method.js'

export default class{
    constructor({scene, engine, audio}){
        this.scene = scene
        this.engine = engine
        this.audio = audio

        this.count = 100
        this.width = 1.25
        this.height = 1.25
        this.edgeRadius = this.width / 2
        this.seg = 32
        this.radius = 25
        this.color1 = BABYLON.Color3.FromHexString('#4dfff9')
        this.color2 = BABYLON.Color3.FromHexString('#4d33ea')

        this.init()
    }


    // init
    init(){
        this.create()
        this.animate()
    }


    // create
    create(){
        const {count, width, height, edgeRadius, radius, seg, scene, engine} = this

        const material = this.createMaterial()
        const plane = new RoundedPlane({width, height, radius: edgeRadius, seg, scene, engine})
        plane.get().isVisible = false
        plane.setMaterial(material)


        const {color} = this.createAttribute()
        plane.setAttribute('aColor', new Float32Array(color), 3, true)

        // plane.setAttribute('aPosition', new Float32Array(position), 3, true)

        const mesh = plane.get()
        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = (degree * i - 90)

            const x = Math.cos(deg * RADIAN) * radius
            const z = Math.sin(deg * RADIAN) * radius

            const name = Method.uuidv4()
            const instance = mesh.createInstance(name)

            instance.rotation.y = -(90 + deg) * RADIAN

            instance.position.x = x
            instance.position.z = z
        }
    }
    createAttribute(){
        const {count, radius} = this

        const position = []
        const color = []

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
            const t =  idx ? p : 1 - p
            const c = BABYLON.Color3.Lerp(this.color1, this.color2, t)

            const r = c.r
            const g = c.g
            const b = c.b

            color.push(r, g, b)
        }

        return{
            position,
            color
        }
    }
    createMaterial(){
        const material = new BABYLON.ShaderMaterial('particleShader', this.scene, {
            vertex: ShaderName,
            fragment: ShaderName,
        },
        {
            attributes: ['position', 'uv', 'aColor'],
            uniforms: ['worldViewProjection', 'viewProjection', 'uColor'],
            needAlphaBlending: true,
            needAlphaTesting: true,
        },
        )

        // material.setColor3('uColor', BABYLON.Color3.FromHexString('#ffffff'))

        return material
    }


    // animate
    animate(){
        this.render()

        requestAnimationFrame(() => this.animate())
    }
    render(){
    }
}