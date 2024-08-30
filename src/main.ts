// import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Noir from './presets/Noir';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import './index.css';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    }
});
app.use(ToastService);

app.mount('#app');
