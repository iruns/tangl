<template>
  <div id = "spreadDisplay"
    @mousedown.left.self.prevent = "startDrag"
    @wheel.ctrl.prevent = "zoom"
    ref = "element"
  >
    <div id = "background"
      :style = "{
        'background-size':
          (scale.s * 100) + 'px ' +
          (scale.s * 100) + 'px',
        'background-position':
          (position.x + scale.dx) + 'px ' +
          (position.y + scale.dy) + 'px'
        }"
    />
    <items
      :activeItems = "filtered.items"
      :position = "position"
      :scale = "scale"
    />
    <!-- <connector-drawing
      :activeItems = "filtered.items"
      :position = "position"
      :scale = "scale"
    /> -->
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex'

import Items from './Items'
// import ConnectorDrawing from './ConnectorDrawing'

export default {

  name: 'spread-display',

  components: {
    Items,
    // ConnectorDrawing
  },

  data () {
    return {
      mouseStart: {x: null, y: null},
      elementStart: {x: null, y: null},
      position: {x: 0, y: 0},
      scale: {
        s: 1,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
      },
      dragged: false
    }
  },
  computed: {
    ...mapState('spread', [
      'filtered'
    ]),
  },
  methods: {
    startDrag (e) {
      this.dragged = true

      this.mouseStart.x = e.clientX
      this.mouseStart.y = e.clientY

      this.elementStart.x =
          parseInt(this.position.x, 10)
      this.elementStart.y =
          parseInt(this.position.y, 10)

      document.onmousemove = this.drag
      document.onmouseup =
          () => {
            // this.$store.dispatch('spread/setResolveLayout', true)
            this.dragged = false
            document.onmousemove = null
            document.onmouseup = null
          }
    },
    drag (e) {
      e.preventDefault()

      this.position = {
        x: this.elementStart.x +
          (e.clientX - this.mouseStart.x),
        y: this.elementStart.y +
          (e.clientY - this.mouseStart.y)
      }
    },
    zoom (e) {
      const rect = this.$refs.element.getBoundingClientRect()

      const {scale} = this
      const dm = (e.deltaY < 0 ? 1.03 : 1 / 1.03)

      scale.x = (e.clientX - rect.x - scale.dx) / scale.s
      scale.y = (e.clientY - rect.y - scale.dy) / scale.s

      const prevS = scale.s
      scale.s *= dm
      const d = prevS - scale.s

      scale.dx += d * scale.x
      scale.dy += d * scale.y
    }
  }
}

</script>

<style>
  #spreadDisplay{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #background{
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: repeat;
    background-image: url("../../assets/grid.png");
  }
</style>
