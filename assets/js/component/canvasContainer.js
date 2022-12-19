import App from '../class/app/app.js'

export default {
    template: `
        <div 
            id="canvas-container"
            :style="containerStyle"
        >
            <canvas 
                :ref="el => canvas = el" 
                :style="canvasStyle"
            />
        </div>
    `,
    setup(){
        const {ref, onMounted, nextTick} = Vue
        const {useStore} = Vuex


        // store
        const store = useStore()


        // variables
        const canvas = ref()
        const containerStyle = ref({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        })
        const canvasStyle = ref({
            width: '100%',
            height: '100%'
        })


        // life cycle
        onMounted(() => {
            store.dispatch('app/setApp', new App(canvas.value))
        })


        return {
            canvas,
            containerStyle,
            canvasStyle
        }
    }
}