import Vue from 'vue'
import App from './App'
import store from "./store/index"
import "./static/font/iconfont.css"

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
