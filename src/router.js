import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Categoria from "./components/Categoria.vue";
import Articulo from "./components/Articulo.vue";
import Rol from "./components/Rol.vue";
import Usuario from "./components/Usuario.vue";
import Cliente from "./components/Cliente.vue";
import Abono from "./components/Abono.vue";
import ConsultaAbono from "./components/ConsultaAbono.vue";
import ListaAbonos from "./components/ListaAbonos.vue";
import ListaAbonosProveedor from "./components/ListaAbonosProveedor.vue";
import Proveedor from "./components/Proveedor.vue";
import Login from "./components/Login.vue";
import Ingreso from "./components/Ingreso.vue";
import CuentasPorPagar from "./components/CuentasPorPagar.vue";
import Venta from "./components/Venta.vue";
import CategoriaGastos from "./components/CategoriaGastos.vue";
import Gasto from "./components/Gasto.vue";
import ConsultaVenta from "./components/ConsultaVenta.vue";
import ConsultaVentaContado from "./components/ConsultaVentaContado.vue";
import ConsultaVentaCredito from "./components/ConsultaVentaCredito.vue";
import ConsultaIngreso from "./components/ConsultaIngreso.vue";
import ConsultaInventario from "./components/ConsultaInventario.vue";
import ConsultaInventarioAgotado from "./components/ConsultaInventarioAgotado.vue";
import ConsultaGasto from "./components/ConsultaGasto.vue";
import ConsultaVendedores from "./components/ConsultaVendedores.vue";
import ConsultaVendedoresContado from "./components/ConsultaVendedoresContado.vue";
import ConsultaVendedoresCredito from "./components/ConsultaVendedoresCredito.vue";
import EstadisticaVenta from "./components/EstadisticaVenta.vue";
import ConsultaCliente from "./components/ConsultaCliente.vue";
import ConsultaClienteContado from "./components/ConsultaClienteContado.vue";
import ConsultaClienteCredito from "./components/ConsultaClienteCredito.vue";
import Traslados from "./components/traslados/Traslados.vue";
import AnularTraslados from "./components/traslados/AnularTraslados.vue";
import AnularVenta from "./components/AnularVenta.vue";
import MovimientoArticulo from "./components/MovimientoArticulo.vue";
import CategoriasVendidas from "./components/CategoriasVendidas.vue";


//import HelloWordl from "./components/HelloWordl.vue";
import store from "./store";

Vue.use(Router);

var router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: "/",
            name: "home",
            component: Home,
            meta: {
                administrador: true,
                almacenero: true,
                vendedor: true,
                movil: true,
            },
        },
        {
            path: "/categorias",
            name: "categorias",
            component: Categoria,
            meta: {
                administrador: true,
                vendedor: true,
                almacenero: true,
            },
        },
        {
            path: "/articulos",
            name: "articulos",
            component: Articulo,
            meta: {
                administrador: true,
                vendedor: true,
                almacenero: true,
                movil: true,
            },
        },
        {
            path: "/movimientosArticulos",
            name: "movimientosArticulos",
            component: MovimientoArticulo,
            meta: {
                administrador: true
            },
        },
        {
            path: "/ingresos",
            name: "ingresos",
            component: Ingreso,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },
        {
            path: "/roles",
            name: "roles",
            component: Rol,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/usuarios",
            name: "usuarios",
            component: Usuario,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/clientes",
            name: "clientes",
            component: Cliente,
            meta: {
                administrador: true,
                vendedor: true,
            },
        },
        {
            path: "/abonos",
            name: "abonos",
            component: Abono,
            meta: {
                administrador: true,
                vendedor: true,
            },
        },
        {
            path: "/listaabonos",
            name: "listaabonos",
            component: ListaAbonos,
            meta: {
                administrador: true,
                vendedor: true,
            },
        },
        {
            path: "/listaabonosproveedor",
            name: "listaabonosproveedor",
            component: ListaAbonosProveedor,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },
        {
            path: "/ventas",
            name: "ventas",
            component: Venta,
            meta: {
                administrador: true,
                vendedor: true,
            },
        },
        {
            path: "/AnularVenta",
            name: "AnularVenta",
            component: AnularVenta,
            meta: {
                administrador: true,
               
            },
        },

        {
            path: "/consultavendedores",
            name: "consultavendedores",
            component: ConsultaVendedores,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/consultavendedorescontado",
            name: "consultavendedorescontado",
            component: ConsultaVendedoresContado,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/consultavendedorescredito",
            name: "consultavendedorescredito",
            component: ConsultaVendedoresCredito,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/consultaventas",
            name: "consultaventas",
            component: ConsultaVenta,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaabonos",
            name: "consultaabonos",
            component: ConsultaAbono,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/consultaventasContado",
            name: "consultaventasContado",
            component: ConsultaVentaContado,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/CategoriasVendidas",
            name: "CategoriasVendidas",
            component: CategoriasVendidas,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/consultaclientes",
            name: "consultaclientes",
            component: ConsultaCliente,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaclientescontado",
            name: "consultaclientescontado",
            component: ConsultaClienteContado,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaclientescredito",
            name: "consultaclientescredito",
            component: ConsultaClienteCredito,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaventasCredito",
            name: "consultaventasCredito",
            component: ConsultaVentaCredito,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaingresos",
            name: "consultaingresos",
            component: ConsultaIngreso,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultagastos",
            name: "consultagastos",
            component: ConsultaGasto,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultainventario",
            name: "consultainventario",
            component: ConsultaInventario,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultainventarioagotado",
            name: "consultainventarioagotado",
            component: ConsultaInventarioAgotado,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/categoriagastos",
            name: "categoriagastos",
            component: CategoriaGastos,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/gastos",
            name: "gastos",
            component: Gasto,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/estadisticaventa",
            name: "estadisticaventa",
            component: EstadisticaVenta,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/proveedores",
            name: "proveedores",
            component: Proveedor,
            meta: {
                administrador: true,
               // almacenero: true,
            },
        },

        {
            path: "/cuentasporpagar",
            name: "cuentasporpagar",
            component: CuentasPorPagar,
            meta: {
                administrador: true,
               // almacenero: true,
            },
        },
        {
            path: "/traslados",
            name: "traslados",
            component: Traslados,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },

        {
            path: "/anularTraslados",
            name: "anularTraslados",
            component: AnularTraslados,
            meta: {
                administrador: true
            },
        },


        /* {
             path: "*",
             name: "*",
             component: About,
             meta: {
                 libre: true,
             },
         },*/
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: {
                libre: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.libre)) {
        next();
    } else if (
        store.state.usuario &&
        store.state.usuario.rol == "Administrador"
    ) {
        if (to.matched.some((record) => record.meta.administrador)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == "Almacenero") {
        if (to.matched.some((record) => record.meta.almacenero)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == "Vendedor") {
        if (to.matched.some((record) => record.meta.vendedor)) {
            next();
        }
    }
    else if (store.state.usuario && store.state.usuario.rol == "Movil") {
        if (to.matched.some((record) => record.meta.vendedor)) {
            next();
        }
    }
    else {
        next({
            name: "login",
        });
    }
});



export default router;