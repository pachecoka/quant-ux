import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'

import Services from 'services/Services'



async function start() {
  await Services.initConfig()
  let conf = await Services.getConfig()
  if (conf.auth === 'keycloak') {
    const keycloakService = Services.getUserService()
    await keycloakService.init(conf)
  }

  Vue.use(VueI18n)
  Vue.config.productionTip = false
  
  new Vue({
    router,
    i18n: new VueI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        'en': require('./nls/en.json'),
        'en-uk': require('./nls/en.json'),
        'en-us': require('./nls/en.json'),
        'cn': require('./nls/cn.json'),
        'de': require('./nls/de.json'),
      }
    }),
    render: h => h(App)
  }).$mount('#app')
  
}

start()

