import Method from '../../method/method.js'

export default class{
    constructor({width, height, scene}){
        this.width = width
        this.height = height
        this.seg = seg
        this.scene = scene

        this.init()
    }

    
    // init
    init(){
        this.create()
    }


    // create
    create(){
        const material = this.createMaterial()
        this.mesh = this.createMesh()
        this.mesh.material = material
    }
    createMesh(){
        const mesh = BABYLON.MeshBuilder.CreatePlane(Method.uuidv4(), {width: this.width, height: this.height}, this.scene)
        return mesh
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial(Method.uuidv4(), this.scene)
        material.emissiveColor = new BABYLON.Color3(1, 1, 1)
        return material
    }


    // set
    setMaterial(material){
        this.mesh.material = material
    }


    // get
    get(){
        return this.mesh
    }
    getMaterial(){
        return this.mesh.material
    }
}