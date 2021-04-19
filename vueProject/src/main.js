import { createApp } from "vue";
import router from './components/router';
import App from './App.vue';
const app = createApp(App);
app.use(router);
import PrimeVue from 'primevue/config';
app.use(PrimeVue);
import TabMenu from 'primevue/tabmenu';
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import Slider from '../src/components/Slider.vue'
app.component('TabMenu', TabMenu);
app.component('Slider', Slider);
app.mount("#app");