<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-tile :to="{ name: 'home' }">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-title class="letraHome"> Inicio </v-list-tile-title>
          </v-list-tile>
        </template>
        
        <br>
        <!-- <v-card-text  v-if="logueado">
        <v-icon>account_circle</v-icon> {{usuario}}
      </v-card-text> -->
        <template>
          <v-list-group class="espacio">
            <v-list-tile slot="activator" >
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue"> house </v-icon> Almacén </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="esAdministrador" :to="{ name: 'categorias' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Categorías </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'articulos' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Artículos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile  v-if="esAdministrador" :to="{ name: 'movimientosArticulos' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Movimiento Articulos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
       <!--  <br /> -->
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">shopping_cart</v-icon> Compras </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'ingresos' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Ingresos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="esAdministrador" :to="{ name: 'proveedores' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Proveedores </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile  v-if="esAdministrador" :to="{ name: 'cuentasporpagar' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Cuentas por Pagar </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile  v-if="esAdministrador" :to="{ name: 'listaabonosproveedor' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Lista de Pagos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
      
          </v-list-group>
        </template>
      <!--   <br /> -->
        <template v-if="esAdministrador || esVendedor || esAlmacenero">
          <v-list-group class="espacio">
            <v-list-tile slot="activator" class="">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">request_page</v-icon>  Ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="esAdministrador || esVendedor" :to="{ name: 'ventas' }">
              <v-list-tile-action>
                <v-icon>real_estate_agent</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>  Ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile  v-if="esAdministrador" :to="{ name: 'AnularVenta' }">
              <v-list-tile-action>
                <v-icon>remove_shopping_cart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>  Anular Ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="esAdministrador || esVendedor" :to="{ name: 'clientes' }">
              <v-list-tile-action>
                <v-icon>person_outline</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Clientes </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-if="esAdministrador || esAlmacenero" :to="{ name: 'traslados' }">
              <v-list-tile-action >
                <v-icon>move_up</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Traslados </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
               <v-list-tile v-if="esAdministrador" :to="{ name: 'anularTraslados' }">
              <v-list-tile-action >
                <v-icon>move_down</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Anular Traslados </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile v-if="esAdministrador" :to="{ name: 'abonos' }">
              <v-list-tile-action>
                <v-icon>attach_money</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Cuentas por Cobrar </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="esAdministrador" :to="{ name: 'listaabonos' }">
              <v-list-tile-action>
                <v-icon>payments</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Lista de abonos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
     <!--    <br /> -->
        <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue"> monetization_on </v-icon> Gastos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'categoriagastos' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Categorias </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'gastos' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Gastos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      <!--   <br /> -->
        <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">people</v-icon> Accesos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'roles' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Roles </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'usuarios' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Usuarios </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      <!--   <br /> -->
        <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">receipt</v-icon>    Reportes Ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'CategoriasVendidas' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Categorias Vendidas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'consultaventas' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Consultas todas las ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile :to="{ name: 'consultaventasContado' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Consultas ventas contado</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile :to="{ name: 'consultaventasCredito' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Consultas ventas credito </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
      
            <v-list-tile :to="{ name: 'consultaabonos' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Consultas Abonos </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          
            <v-list-tile :to="{ name: 'estadisticaventa' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                
                <v-list-tile-title> Estadisticas ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>

         <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">receipt</v-icon>    Reportes Inventario </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile :to="{ name: 'consultainventario' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Consulta Inventario </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: 'consultainventarioagotado' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Inventario Agotado </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            
          </v-list-group>
        </template>


 <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">receipt</v-icon>    Reportes Compras </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
            <v-list-tile :to="{ name: 'consultaingresos' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Consultas compras </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile> 
          
          </v-list-group>
        </template>

         <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">receipt</v-icon>    Reportes Vendedores </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
            
             <v-list-tile :to="{ name: 'consultavendedores' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Todas las ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :to="{ name: 'consultavendedorescontado' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> ventas contado </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :to="{ name: 'consultavendedorescredito' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> ventas crédito </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            
          </v-list-group>
        </template>


         <template v-if="esAdministrador">
          <v-list-group class="espacio">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="letra"> <v-icon color="blue">receipt</v-icon> Mejores Clientes </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
            
             <v-list-tile :to="{ name: 'consultaclientes' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Mejores Clientes total ventas </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :to="{ name: 'consultaclientescontado' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Mejores Clientes Contado </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :to="{ name: 'consultaclientescredito' }">
              <v-list-tile-action>
                <v-icon>today</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title> Mejores Clientes Crédito </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>



        
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon
          v-if="logueado"
          @click.stop="drawer = !drawer"
        ></v-toolbar-side-icon>
        <span v-if="logueado" class="hidden-sm-and-down">Gema Moda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-card-text justify-center v-if="logueado" style="text-align: right; margin-right: 5px;">
     <v-icon>account_circle</v-icon> {{usuario}} 
      </v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="salir" v-if="logueado" icon>
        <v-icon>logout</v-icon> Salir
      </v-btn>
      <v-btn :to="{ name: 'login' }" v-else>
        <v-icon>apps</v-icon> Login
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text id="fecha" class="white--text pt-0 pie">
              &copy; Todos los derechos reservados Gema Moda {{ new Date().getFullYear() }}
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>


import Vue from "vue";
import {AutoCompletePlugin} from "@syncfusion/ej2-vue-dropdowns";
Vue.use(AutoCompletePlugin);
new Vue({
  this: '#fecha'
});
export default {
  name: "App",
  data() {
    /*  return{
      miVariable: Date.getfullyear()
    } */
    return {
      usuario:"",
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Inspire",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };

  },
  computed: {
    logueado() {
      return this.$store.state.usuario;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Administrador"
      );
    },
    esAlmacenero() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Almacenero"
      );
    },
    esVendedor() {
      return (
        this.$store.state.usuario && this.$store.state.usuario.rol == "Vendedor"
      );
    },

    /*enviarInicio(err) {
      if (err.response == 401) {
        alert("Sesion caducada");
        console.log("Hola mundo");
        this.$router.push({ name: "home" });
      }
    },*/
  },
  created() {
    this.$store.dispatch("autoLogin");
    this.usuario = this.$store.state.usuario.nombre;
   // console.log("Usuario: ",this.$store.state.usuario);
  },
  methods: {
    salir() {
      this.$store.dispatch("salir");
    },
  },
};

</script>

<style>
.letra {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-style: italic;
  font-size: 19px;
  margin-left: 2px;  
  margin-bottom: 10px;
  color: #1565C0;
}

.letraHome {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-style: italic;
  font-size: 19px;
 color: #1565C0;
}



.pie {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  text-align: center;
  /*margin-left: 140px;*/
}
.espacio{
  margin-bottom: 11px;
}
</style>
