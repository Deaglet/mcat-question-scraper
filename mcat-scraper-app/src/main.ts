import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import BalmUI from 'balm-ui'
import BalmUIPlus from 'balm-ui-plus'
import 'balm-ui-css'

const i18n = createI18n({
    legacy: false,
    locale:'en-US',
    fallbackLocale: 'en'
})
const app = createApp(App)

app.use(router);
app.use(BalmUI);
app.use(BalmUIPlus);
app.use(i18n)

app.mount('#app')
