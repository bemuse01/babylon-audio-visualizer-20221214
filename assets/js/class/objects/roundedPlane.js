import Method from '../../method/method.js'

export default class{
    constructor({width, height, radius, seg, scene, engine}){
        this.width = width
        this.height = height
        this.radius = radius
        this.seg = seg
        this.scene = scene
        this.engine = engine

        this.init()
    }


    // init
    init(){
        this.create()
    }
    

    // create
    create(){
        const shape = this.createShape()
        const name = Method.uuidv4()
        const material = this.createMaterial()

        this.mesh = BABYLON.MeshBuilder.CreatePolygon(
            name,
            {
                shape, 
                sideOrientation: BABYLON.Mesh.DOUBLESIDE, 
                updatable: true
            },
            this.scene
        )

        this.mesh.material = material
    }
    createShape(){
        const {width, height, radius, seg} = this
        const shape = []

        const dTheta = Math.PI / seg

        //bottom left corner
        let centerX = -(0.5 * width - radius)
        let centerZ = -(0.5 * height - radius)
        
        for (let theta = Math.PI; theta <= 1.5 * Math.PI; theta += dTheta){
            shape.push(new BABYLON.Vector3(centerX + radius * Math.cos(theta), 0, centerZ + radius * Math.sin(theta)))
        }

        //bottom right corner
        centerX = 0.5 * width - radius
        for (let theta = 1.5 * Math.PI; theta <= 2 * Math.PI; theta += dTheta) {
            shape.push(new BABYLON.Vector3(centerX + radius * Math.cos(theta), 0, centerZ + radius * Math.sin(theta)))
        }

        //top right corner
        centerZ = 0.5 * height - radius
        for (let theta = 0; theta <= 0.5 * Math.PI; theta += dTheta) {
            shape.push(new BABYLON.Vector3(centerX + radius * Math.cos(theta), 0, centerZ + radius * Math.sin(theta)))
        }

        //top left corner
        centerX = -(0.5 * width - radius)
        for (let theta = 0.5 * Math.PI; theta <= Math.PI; theta += dTheta) {
            shape.push(new BABYLON.Vector3(centerX + radius * Math.cos(theta), 0, centerZ + radius * Math.sin(theta)))
        }

        return shape
    }
    createMaterial(){
        const name = Method.uuidv4()

        const material = new BABYLON.StandardMaterial(name, this.scene)
        material.emissiveColor = new BABYLON.Color3(1, 1, 1)

        return material
    }


    // get
    get(){
        return this.mesh
    }
    getAttribute(name){
        return this.mesh.getVerticesData(name)
    }


    // set
    setMaterial(material){
        this.mesh.material = material
    }
    setAttribute(name, data, size, instanced = false){
        const buffer = new BABYLON.VertexBuffer(this.engine, data, name, false, false, size, instanced);
        this.mesh.setVerticesBuffer(buffer)
    }
}