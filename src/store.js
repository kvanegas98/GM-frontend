import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: null,
        usuario: null,
        dataInvoice:null
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        setUsuario(state, usuario) {
            state.usuario = usuario
        },
        setDataInvoice(state, dataInvoice) {
            state.dataInvoice = dataInvoice
        }
    },
    actions: {
        guardarToken({ commit }, token) {
            commit("setToken", token)
            commit("setUsuario", decode(token))
            localStorage.setItem("token", token)
        },
        saveDataInvoice({ commit }, data) {
            commit("setDataInvoice", data)
            localStorage.setItem("dataInvoice", data)
        },
        autoLogin({ commit }) {
            let token = localStorage.getItem("token")
            if (token) {
                commit("setToken", token);
                commit("setUsuario", decode(token));
                router.push({ name: 'home' });
            }
            /*else if (!token) {
                           swal(
                               "Sesión caducada",
                               "Su sesión ha expirado favor volver a iniciar sesión",
                               "warning"
                           );
                           commit("setToken", null);
                           commit("setUsuario", null);
                           localStorage.removeItem("token");
                           router.push({ name: 'login' });
                       }*/
            router.push({ name: 'home' });
        },
        salir({ commit }) {
            commit("setToken", null)
            commit("setUsuario", null)
            localStorage.removeItem("token")
            localStorage.removeItem("dataInvoice")
            router.push({ name: 'login' })
        }
    }
})