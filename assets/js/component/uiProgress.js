export default {
    template: `
        <div 
            class="ui-progress"
            :style="rootStyle"
            :ref="el => root = el"
        >
            <div 
                class="progress-box" 
                :style="boxStyle"
                @mouseenter="onMouseenter"
                @mouseleave="onMouseleave"
                @mousemove="onMousemove"
                @click="onClick"
            >

                <div 
                    class="progress-transform"
                    :style="transformStyle"
                >

                    <div
                        class="track-bar"
                        :style="trackStyle"
                    ></div>

                    <div 
                        class="progress-bar"
                        :style="progressStyle"
                    ></div>

                </div>

            </div>

        </div>
    `,
    setup(){
        const {ref, onMounted, computed} = Vue
        const {useStore} = Vuex


        // variables
        const store = useStore()
        const audio = computed(() => store.getters['audio/getAudio'])
        const root = ref()


        // styles
        const rootStyle = ref({
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '60px'
        })
        const boxStyle = ref({
            position: 'absolute',
            width: '100%',
            height: '100%'
        })
        const transformStyle = ref({
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '3px',
            transform: 'scaleY(1)',
            transformOrigin: 'bottom',
            transition: 'transform 0.3s'
        })
        const progressStyle = ref({
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'white',
            transform: 'scaleX(0)',
            transformOrigin: 'left'
        })
        const trackStyle = ref({
            position: 'absolute',
            width: '0',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.5)',
            transition: 'opacity 0.3s'
        })


        // methods
        const onClick = (e) => {
            if(!root.value) return

            const {width} = root.value.getBoundingClientRect()
            const currentX = e.clientX
            const ratio = currentX / width

            audio.value.setCurrentTime(ratio)
        }
        const onMousemove = (e) => {
            const width = e.clientX
            
            trackStyle.value.width = `${width}px`
        }
        const onMouseenter = () => {
            transformStyle.value.transform = 'scaleY(5)'
            trackStyle.value.opacity = '1'
        }
        const onMouseleave = () => {
            transformStyle.value.transform = 'scaleY(1)'
            trackStyle.value.opacity = '0'
        }
        const setProgress = () => {
            const progress = audio.value.getProgress()
            progressStyle.value.transform = `scaleX(${progress})`
        }
        const animate = () => {
            if(!audio.value) return

            setProgress()

            requestAnimationFrame(animate)
        }


        // life cycle
        onMounted(() => {
            animate()
        })


        return{
            root,
            rootStyle,
            boxStyle,
            progressStyle,
            transformStyle,
            trackStyle,
            onMouseenter,
            onMouseleave,
            onMousemove,
            onClick
        }
    }
}