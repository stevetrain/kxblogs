<template>
  <div v-bind:class="isNight ? 'nightMode' : 'dayMode'">
    <ProgressSpinner class="loader" v-if="!activeConnection" style="width:100px; height:100px" strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"/>
    <div style="display:flex">
      <span style="flex:99">
        <TabMenu :model="navbar"/>
      </span>
      <span class="toggleSpan" style="flex:1">
        <Slider v-on:click="updateCSS()" v-model="isNight"/>
      </span>
    </div>
    <router-view :calendar="calendar" :qPromise="qPromise" :ws="ws" :index="index" :startDate="startDate" :monthNames="monthNames" :scrollTimer="scrollTimer"/>
  </div>
</template>

<script>
import defineWS from '@/components/composables/defineWebsocket'
import defineCalendar from '@/components/composables/defineCalendar'
import TabMenu from 'primevue/tabmenu';
import ProgressSpinner from 'primevue/progressspinner';
import Slider from '@/components/Slider.vue';

export default {
  name: 'vueProject',
  components:[TabMenu, Slider, ProgressSpinner],
  data: function() {
    return {
      isNight: false,
      navbar:[
        {label: 'Calendar', to: '/'},
        {label: 'OtherTab', to: '/otherTab'}
      ]
    }
  },
  setup() {
    console.log('Setting up');

    const {
      ws,
      qPromise,
      activeConnection
    } = defineWS()

    const {
      calendar,
      startDate,
      index,
      scrollTimer,
      monthNames,
      getHeight,
      onWheel,
      onKeyDown,
      height
    } = defineCalendar(ws, qPromise, activeConnection)

    return {
      ws,
      qPromise,
      activeConnection,
      calendar,
      startDate,
      index,
      scrollTimer,
      monthNames,
      getHeight,
      onWheel,
      onKeyDown,
      height
    }
  },
  methods: {
    updateCSS: function(){
      let bg = this.isNight ? '#121212f5' : 'white';
      document.body.style.backgroundColor = bg;
    },
    init: function(){
      if(0<=[undefined,0].indexOf(this.ws.readyState)){setTimeout(this.init,50); return}
      this.getHeight();
    }
  },
  created: function(){this.init()}
}
</script>

<style scoped>
.dayMode {background-color: white}

.nightMode {
    color: #fff;
}
</style>

<style>
body {font-family: Arial}
.toggleSpan {
    border: 1px solid #dee2e6;
    border-width: 0 0 2px 0;
}
.dayMode .toggleSpan {background-color: #0070cd}
.nightMode .toggleSpan {background-color: #121212f5}
.dayMode .p-tabmenu .p-tabmenu-nav {background: #0070cd!important}
.nightMode .p-tabmenu .p-tabmenu-nav {background: #121212f5!important}
.dayMode .p-tabmenu .p-tabmenu-nav .p-menuitem-link {background: #0070cd!important}
.nightMode .p-tabmenu .p-tabmenu-nav .p-menuitem-link {background: #121212f5!important}
.p-tabmenu .p-tabmenu-nav .p-menuitem-link {color: #dccece!important}
.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link {color: white!important}
.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):focus {box-shadow: none!important}
.loader {
    position: absolute;
    top: 35%;
    left: 44%;
}
</style>