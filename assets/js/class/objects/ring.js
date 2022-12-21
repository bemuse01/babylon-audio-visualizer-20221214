import Method from '../../method/method.js'

export default class{
    constructor({innerRadius, outerRadius, seg, scene}){
        this.innerRadius = innerRadius
        this.outerRadius = outerRadius
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
        const {
            innerRadius,
            outerRadius,
            seg,
            phiSegments = 1,
            thetaStart = 0,
            thetaLength = Math.PI * 2,
            scene,
        } = this

        const mesh = new BABYLON.Mesh(Method.uuidv4(), scene)
    
        const vertices = []
        const indices = []
        const normals = []
        const uvs = []
    
        const radiusStep = (outerRadius - innerRadius) / phiSegments
        const vertex = new BABYLON.Vector3()
        const uv = new BABYLON.Vector2()
    
        let radius = innerRadius
        for(let j = 0; j <= phiSegments; j++){
            for(let i = 0; i <= seg; i++){
                const segment = thetaStart + (i / seg) * thetaLength
        
                vertex.x = radius * Math.cos(segment)
                vertex.y = radius * Math.sin(segment)
                vertices.push(vertex.x, vertex.y, vertex.z)
        
                normals.push(0, 0, 1)
        
                uv.x = (vertex.x / outerRadius + 1) / 2
                uv.y = (vertex.y / outerRadius + 1) / 2
                uvs.push(uv.x, uv.y)
            }
        
            radius += radiusStep
        }
    
        for(let j = 0; j < phiSegments; j++){
            const thetaSegmentLevel = j * (seg + 1)
    
            for(let i = 0; i < seg; i++){
                const segment = i + thetaSegmentLevel
        
                const a = segment
                const b = segment + seg + 1
                const c = segment + seg + 2
                const d = segment + 1
        
                // faces
                indices.push(a, b, d)
                indices.push(b, c, d)
            }
        }
        
        const vertexData = new BABYLON.VertexData()
        BABYLON.VertexData.ComputeNormals(vertices, indices, normals)
        
        vertexData.positions = vertices
        vertexData.indices = indices
        vertexData.normals = normals
        vertexData.uvs = uvs
        vertexData.applyToMesh(mesh)

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