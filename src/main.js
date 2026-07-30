import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./plugins/materialize"


import excel from "vue-excel-export";

Vue.use(excel);

import VueExcelXlsx from "vue-excel-xlsx";
// import Vue from "vue";

Vue.use(VueExcelXlsx);


import VueCurrencyFilter from "vue-currency-filter";
import './registerServiceWorker';




Vue.use(VueCurrencyFilter, {
    symbol: "C$",
    thousandsSeparator: ",",
    fractionCount: 2,
    fractionSeparator: ".",
    symbolPosition: "front",
    symbolSpacing: true,
});
Vue.filter('toCurrency', function(value) {
    if (typeof value !== "number") {
        return value;
    }
    var formatter = new Intl.NumberFormat('EN-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,

    });
    return formatter.format(value);
});

Vue.use(require("vue-moment"));
Vue.config.productionTip = false;
axios.defaults.baseURL = "https://kvanegas98-001-site1.gtempurl.com/";
// axios.defaults.baseURL = "https://localhost:44388/";

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");