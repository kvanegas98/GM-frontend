<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Cuentas por cobrar</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <!-- <v-btn slot="activator" color="primary" dark class="mb-2"
            >Nuevo</v-btn
          > -->
          <v-spacer slot="activator"
            > </v-spacer
          >
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field  disabled v-model="nombre" label="Nombre del cliente">
                    </v-text-field>
                  </v-flex>
                   <!-- <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select v-model="idusuario" :items="vendedores" label="Vendedor" autocomplete="on">
            </v-select>
          </v-flex> -->
                  <!--  <v-flex xs12 sm4 md4 lg4 xl4> -->
                   <v-flex xs12 sm12 md12>
            <v-select v-model="idusuario" :items="vendedores" label="Vendedor">
            </v-select>
          </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="totalDeuda"
                      disabled
                      label="Total de la deuda"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="pendiente" disabled label="Deuda Pendiente">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field type="number" v-model="monto" label="Monto a abonar">
                    </v-text-field>
                  </v-flex>
                  
                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" flat @click.native="guardar"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

       <!--  Ver Facturas -->
       <v-dialog v-model="dialogFactura" max-width="500px">
          
          <v-spacer slot="activator"
            > </v-spacer
          >
          <v-card>
            <v-card-title>
              <span class="headline">Lista de Facturas Pendientes </span>
            </v-card-title>

            <v-data-table
        :headers="facturas"
        :items="_facturas"
        
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          
          <!-- <td>{{ props.item.id_Credito }}</td> -->
          <td>{{ props.item.codigoFactura }}</td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.fecha| moment("DD/MM/YYYY")  }}</td>
          <td>{{ props.item.total }}</td>        
        
        </template>
        <!-- <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template> -->
      </v-data-table>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="closeFactura"
                >Cerrar</v-btn
              >
              
            </v-card-actions>
          </v-card>
        </v-dialog>

       <!--  fin ver facturas -->

          <!--  Ver Facturas -->
       <v-dialog v-model="dialogAbono" max-width="500px">
          
          <v-spacer slot="activator"
            > </v-spacer
          >
          <v-card>
            <v-card-title>
              <span class="headline">Lista de Abonos </span>
            </v-card-title>

            <v-data-table
        :headers="Abon"
        :items="_abonos"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          
          <!-- <td>{{ props.item.id_Credito }}</td> -->
          <td>{{ props.item.codigoAbono }}</td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.fechaPago| moment("DD/MM/YYYY")  }}</td>
          <td>{{ props.item.monto }}</td>        
        
        </template>
        <!-- <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template> -->
      </v-data-table>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="closeAbono"
                >Cerrar</v-btn
              >
              
            </v-card-actions>
          </v-card>
        </v-dialog>
   <!--  fin ver abonos -->
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="abonos"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" color="success" @click="editItem(props.item)">
              add
            </v-icon>
          </td>
          <!-- <td>{{ props.item.id_Credito }}</td> -->
          <td>{{ props.item.nombreDeCliente }}</td>
          <td>{{ props.item.totalAPagar | currency }}</td>
          <td class="green--text">{{ props.item.abono | currency }}</td>        
          <td class="red--text">{{ props.item.pendiente | currency }}</td>
         <!--  <td class="red--text">{{ props.item.dias}}</td> -->
         <!--  <td v-if="props.item.dias <= 0" class="red--text">{{ props.item.dias}} {{ FacturasVencidas() }}</td>
          <td v-else-if="props.item.dias >=1 && props.item.dias<=5" class="orange--text">{{ props.item.dias}} {{ FacturasAVencer(props.item.dias, props.item.nombreDeCliente) }}</td>
          <td v-else  class="green--text">{{ props.item.dias}}</td> -->
          
           <!-- <div v-if="props.item.dias > 65">
             <td class="red--text">{{ props.item.dias}}</td>
            </div>
            <div v-if="props.item.dias < 65">
              <td class="green--text">{{ props.item.dias}}</td>
            </div> -->
          <td>  <v-icon small class="mr-2" color="primary"  @click="mostrarFacturas(props.item)">
              visibility
            </v-icon>
          </td>
          <td>  <v-icon small class="material-icons-two-tone" color="primary" @click="mostrarAbonos(props.item)">
              zoom_out
            </v-icon>
          </td>

          
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>

<!--   Ver detalles -->


  </v-layout>



</template>
<script>
import axios from "axios";
import swal from "sweetalert";
import router from "vue-router";

//Vue.use(Router);
export default {
  data() {
    
    return {
      
      abonos: [],
      _facturas: [],
      _abonos: [],
      dialog: false,
      dialogFactura: false,
      dialogAbono: false,
      headers: [
        { text: "Agregar Pago", value: "opciones", sortable: false },
        { text: "Nombre", value: "nombreDeCliente" },
        { text: "Total Deuda", value: "totalAPagar" },
        { text: "Total Abonado", value: "Abonado" },
        { text: "Deuda Pendiente", value: "pendiente" },
      //  { text: "Dias restantes", value: "Dias" },
        { text: "Ver Facturas", value: "opciones", sortable: false },
        { text: "Ver Abonos", value: "opciones", sortable: false },
       
      ],

      facturas: [
        { text: "No. Factura", value: "codigoFactura" },          
        { text: "Vendedor", value: "usuario" },          
        { text: "Fecha", value: "fecha_hora" },
        { text: "Total", value: "total", sortable: false },
      ],

      Abon: [
        { text: "No. Abono", value: "codigo" },          
        { text: "Vendedor", value: "usuario" },          
        { text: "Fecha", value: "fecha_hora" },
        { text: "Total", value: "total", sortable: false },
      ],
       verNuevo: 0,
      search: "",
      editedIndex: -1,
      idusuario: "",
      vendedores: [],
      id: "",
      nombre: "",
      totalDeuda:0,
      totalabonado:0,
      monto:0,
      pendiente:0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  computed: {
    formTitle() {
     // return this.editedIndex === -1 ? "Nuevo cliente" : "Actualizar cliente";
      return  "Nuevo abono";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
     dialogFactura(val) {
      val || this.close();
    },
     dialogAbono(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    /* this.FacturasVencidas();
    this.FacturasAVencer(); */
     this.selectUsuario();
  },
  methods: {
    redirigir() {
      // this.$router.push({ name: "login" });
      this.$store.dispatch("salir");
    },
   /* FacturasVencidas:function(){
      // alert(event.target.value);
        swal(
              "Facturas Vencidas",
              "Tiene Facturas Pendientes con sus proveedores",
              "error"
            );
    },

    FacturasAVencer:function(Dias, Proveedor){
        
        swal(
              "Facturas a vencer",
              "Tiene "+Dias+" días restantes para pagar de su proveedor: "+Proveedor,
              "warning"
            );
    },
 */
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
 
    listar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
       .get("/api/Creditos/Listar", configuracion)
       // .get("/api/CreditosIngreso/Listar", configuracion)
        .then(function (response) {
          console.log(response.data);
          me.abonos = response.data;
          console.log(me.abonos);
        })
        .catch(function (error) {
          console.log(error);
           if (error.response.status == "401") {
            //alert("Nice");
            swal(
              "Sesión caducada",
              "Su sesión ha expirado favor volver a iniciar sesión",
              "warning"
            );
            
           // me.redirigir();

            //router.push("login");
            // ation.href = "http://localhost8080/login";
          }
        });
    },

      selectUsuario() {
      let me = this;
      var usuariosArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Usuarios/Select", configuracion)
        .then(function(response) {
          usuariosArray = response.data;
          //console.log('HOLAAAAAAAAAAAAAAAA'+response.data);
        
          usuariosArray.map(function(x) {
            me.vendedores.push({ text: x.nombre, value: x.idusuario });
          });
         // console.log('HOLAAAAAAAAAAAAAAAA'+me.vendedores);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    editItem(item) {
      this.id = item.id_Credito;
      this.nombre = item.nombreDeCliente;
      this.totalDeuda = item.totalAPagar;
      this.pendiente = item.pendiente;
      this.totalabonado = item.abono;
      this.dialog = true;
    },

     mostrarFacturas(item) {
      this._facturas = item.ventas;
       this.dialogFactura = true;
    },

     mostrarAbonos(item) {     
      this._abonos = item.abonos;
       this.dialogAbono = true;
    },
    close() {
      this.dialog = false;
      this.limpiar();
    },

     closeFactura() {
      this.dialogFactura = false;
      this.limpiar();
    },
     closeAbono() {
      this.dialogAbono = false;
      this.limpiar();
    },
    limpiar() {
      this.id = "";
      this.nombre = "";
      this.totalabonado = "";
      this.totalAPagar = "";
      this.monto = 0;
      this.pendiente = "";
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    guardar() {
      if (this.validar()) {
        return;
      }
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      /* if (this.editedIndex > -1) {
        //Código para editar
        let me = this;
        axios
          .put(
            "api/Personas/Actualizar",
            {
              idpersona: me.id,
              tipo_persona: "Cliente",
              nombre: me.nombreDeCliente,
              tipo_documento: me.tipo_documento,
              num_documento: me.num_documento,
              direccion: me.direccion,
              telefono: me.telefono,
              email: me.email,
            },
            configuracion
          )
          .then(function (response) {
            swal(
              "Cliente Editado",
              "El cliente se ha editado correctamente",
              "success"
            );
            me.close();
            me.listar();
            me.limpiar();
          })
          .catch(function (error) {
            swal(
              "Edición Fallida",
              "El cliente no se ha editado correctamente",
              "error"
            );
            console.log(error);
          });
      } else {
        */ //Código para guardar
        let me = this;
        axios
          .post(
            "api/Creditos/Crear",
            {
             /* id: "Cliente",
              nombre: me.nombre,
              tipo_documento: me.tipo_documento,
              num_documento: me.num_documento,
              direccion: me.direccion,
              telefono: me.telefono,
              email: me.email,*/
              Id_Usuario: me.idusuario,
              id_Credito: me.id,
              Monto: me.monto,
            },
            configuracion
          )
          .then(function (response) {
            swal(
              "Generar Abono",
              "El Abono se ha creado correctamente",
              "success"
            );
          // router.push({ path: 'listaabonos' });
         
            me.close();
            me.listar();
            me.limpiar();
          })
          .then((data) => {
        
          this.$router.push({ name: "listaabonos" });
        })
          
          .catch(function (error) {
            swal(
              "Error al crear",
              "El Abono no se ha podido crear",
              "error"
            );
            console.log(error);
          });
      
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      let _deuda = parseFloat(this.pendiente);
      let _abono = parseFloat(this.monto);

    if (!this.idusuario) {
        this.validaMensaje.push("Seleccione un vendedor.");
      }
      if (this.monto <=0 || this.monto == undefined) {
        this.validaMensaje.push(
          "Ingrese un monto a abonar válido"
        );
      }

      if (_abono > _deuda) {
        this.validaMensaje.push(
          "El abono no puede ser mayor a la deuda"
        );
      }
      
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
  },
};
</script>
