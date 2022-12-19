import Visualizer from '../class/visualizer/visualizer.js'

export default {
    template: `
        <div id="object-container"></div>
    `,
    setup(){
        const {ref, onMounted, watch, computed} = Vue
        const {useStore} = Vuex


        // store
        const store = useStore()


        // variables
        const app = computed(() => store.getters['app/getApp'])
        const audio = computed(() => store.getters['audio/getAudio'])

        let visualizer = null


        // life cycle
        onMounted(() => {
        })

        watch([app, audio], ([curApp, curAudio], [preApp, preAudio]) => {
            if(curApp && curAudio){
                visualizer = new Visualizer({app: app.value, audio: audio.value})
            }
        })


        return {
        }
    }
}