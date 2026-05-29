<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1"
              >¿Activar Item?</v-card-title
            >
            <v-card-title class="headline" v-if="adAccion == 2"
              >¿Anular Abono?</v-card-title
            >
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion == 1">Activar </span>
              <span v-if="adAccion == 2">Anular </span>
              el No.abono {{ adNombre }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                flat="flat"
                @click="activarDesactivarCerrar"
              >
                Cancelar
              </v-btn>
              <v-btn
                v-if="adAccion == 1"
                color="orange darken-4"
                flat="flat"
                @click="activar"
              >
                Activar
              </v-btn>
              <v-btn
                v-if="adAccion == 2"
                color="orange darken-4"
                flat="flat"
                @click="desactivar"
              >
                Anular
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-toolbar-title>Abonos</v-toolbar-title>
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
                    <v-text-field  v-model="nombre" label="Nombre del cliente">
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
                      label="Total de la deuda"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="pendiente" label="Deuda Pendiente">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="monto" label="Monto a abonar">
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
         <v-dialog v-model="comprobanteModal" max-width="500px">
          <v-card>
            <v-card-text>
             <!--  <v-btn @click="crearPDF()">
                <v-icon>print</v-icon>
              </v-btn> -->
              <v-btn  v-if="!isMobile" @click="imprimir()">
                <v-icon>print</v-icon>
              </v-btn>
              <v-btn v-if="isMobile" @click="printBluetoothAbono()" color="teal" dark>
                <v-icon left>bluetooth</v-icon> Imprimir Ticket
              </v-btn>

              <!-- PREVIEW ESTÉTICO PARA MÓVIL (ABONOS) -->
              <div v-if="isMobile" class="mobile-ticket-preview mt-3">
                <v-card flat class="pa-3 text-xs-center" style="background: #fbfbfb; border: 1px dashed #ccc; border-radius: 8px;">
                  <img src="@/assets/logo.png" alt="Logo" style="max-height: 70px; margin-bottom: 8px;">
                  <h3 class="mb-0 font-weight-bold" style="font-size: 18px; color: #333;" v-if="deudaInicial == 0">CANCELACION</h3>
                  <h3 class="mb-0 font-weight-bold" style="font-size: 18px; color: #333;" v-else>RECIBO DE ABONO</h3>
                  
                  <div class="grey--text text--darken-1 mb-2" style="font-size: 14px;">NO. {{ num_factura }}</div>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <div class="text-xs-left px-2">
                    <div style="font-size: 14px; color: #444;"><strong>Cliente:</strong> {{ nombreCliente }}</div>
                    <div style="font-size: 13px; color: #666;"><strong>Fecha:</strong> {{ Fecha | moment("DD/MM/YYYY") }} | {{ Fecha | moment("LT") }}</div>
                  </div>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <div class="text-xs-left px-2">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px; color: #555;">
                      <span>Total Deuda:</span>
                      <span v-if="deudaInicial > 0">{{ deudaInicial | currency }}</span>
                      <span v-else>{{ totalabonado | currency }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px; color: #555;">
                      <span>Total Abonado:</span>
                      <span>{{ totalabonado | currency }}</span>
                    </div>
                  </div>
                  
                  <v-divider class="my-2"></v-divider>

                  <div class="text-xs-right px-2 mt-2">
                    <div style="font-size: 15px; color: #333;">Abono Actual: <span class="font-weight-bold">{{ Monto | currency }}</span></div>
                    <div class="red--text text--darken-2 font-weight-bold mt-1" style="font-size: 16px;">
                      Saldo Pendiente: {{ pendiente | currency }}
                    </div>
                  </div>
                  
                  <v-divider class="my-3"></v-divider>
                  <div class="grey--text text--darken-1" style="font-size: 12px;">Atendido por: {{ nombreVendedor }}</div>
                  <div class="mt-2 font-weight-bold" style="font-size: 15px; color: #333;">Gracias por su pago</div>
                </v-card>
              </div>

              <!-- VIEW DE DESKTOP (impresión real por window.print) -->
              <div id="ticket" v-show="!isMobile">
               <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css" media="print">
               
                <div id="logo"> 
                    <img style="text-align:center;
  margin-top: 0px;
  margin-bottom: 0px;" id="imagen" src="@/assets/logo.png" alt="Gema Moda" />
                  </div>
              
      
           
                    <div >

                    
                    <h5 style="font-weight: bold; font-size:25px;">NO.Abono: {{ num_factura }}</h5>
        
                    <h5 style="font-weight: bold; font-size:25px;">FECHA: {{ Fecha | moment("DD/MM/YYYY") }} |  {{ Fecha | moment("LT") }}  </h5>
                    <!-- <h5 style="margin-left: 10px">{{ fecha_hora | moment("LT") }}</h5> -->
                     <h5 style="font-weight: bold; font-size:25px;">Nombre del cliente: {{ nombreCliente }} </h5>
                    
                    <div style="font-weight: bold; font-size:25px; " class="okas">-------------------------------------------------</div>
                    </div>
                    <br>
                    <div>
         
         <div class = "flow-text">
             
                           <!--  <h5 style="font-weight: bold; font-size:20px;">Nombre del cliente: {{ nombreCliente }} </h5> -->
                            <!-- <h5 style="font-weight: bold; font-size:20px;">Documento: </h5>
                            <h5 style="font-weight: bold; font-size:20px;">Dirección: </h5>
                            <h5 style="font-weight: bold; font-size:20px;">Telefono:</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Email: </h5> -->
                      
         </div>
      </div>	
      <!-- <div class="okas">-----------------------------------------------------------------------------------</div> -->

                  
            <table>
                <thead>
                    <tr>
                     
                        
                    </tr>
                </thead>
                <tbody>
                       <tr>
                          <div v-if="deudaInicial == 0">
                              <h5 style="font-weight: bold; font-size:30px;">CANCELACION</h5>
                               <h5 style="font-weight: bold; font-size:30px;">Total Deuda:&nbsp; {{ totalabonado | currency }}</h5>
                         </div>
                         <div v-if="deudaInicial > 0">
                           <h5 style="font-weight: bold; font-size:30px;">ABONO</h5>
                              <h5 style="font-weight: bold; font-size:30px;">Total Deuda:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {{ deudaInicial | currency }}</h5>
                         </div>
                        </tr>
                        <tr>
                          
                         
                         <h5 style="font-weight: bold; font-size:30px;">Saldo Abonado:&nbsp; {{ totalabonado | currency }}</h5>
                        </tr>
                       <tr>
                          
                         <h5 style="font-weight: bold; font-size:30px;">SALDO A ABONAR:&nbsp; {{ Monto | currency }}</h5>
                        </tr>
                       <tr>
                          
                         <h5 style="font-weight: bold; font-size:30px;">Saldo Pendiente: {{ pendiente | currency }}</h5>
                        </tr>
                        
                </tbody>
                <tfoot>
                       <!--  <br />
                        <br />
                        <tr>
                        
                          <th></th>
                           <th></th>
                         
                          <th style="font-weight: bold; font-size:20px;">TOTAL DEUDA: {{ deudaInicial | currency }}</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            
                          </th>
                        </tr>
                        <tr>
                          <th>
                          </th>
                          <th>
                          </th>
                           <th></th>
                          <th style="font-weight: bold; font-size:20px;">TOTAL ABONADO: {{ totalabonado  | currency }}</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                           <th></th>
                            <th></th>
                          <th style="font-weight: bold; font-size:20px;">PENDIENTE: {{ pendiente | currency }}</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            
                          </th>
                        </tr> -->
                  
                      </tfoot>
            </table>
            <br>
            <strong style="font-weight: bold; font-size:20px;">Atendido por: {{ nombreVendedor }} </strong>
            <br><br>
            <div class="div" style="text-align: center">
                <strong style="font-weight: bold; font-size:30px;" class="text-bold centrado">¡GRACIAS POR SU COMPRA!</strong>
            </div>
            
        </div>
             <!--  <v-btn @click="ocultarComprobante" color="blue darken-1"  flat
                >Cancelar</v-btn
              > -->
              <v-btn  color="blue darken-1"  flat @click.native="ocultarComprobante"
                >Cancelar</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="abonos"
        :search="search"
        :custom-sort="customSort"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
           <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">
              print
            </v-icon>

             <template v-if="props.item.idEstado == 0">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                block
              </v-icon>
            </template>
          </td> 
          
          <!-- <td>{{ props.item.id_Credito }}</td> -->
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.nombreCliente }}</td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.fecha | moment("DD/MM/YYYY") }}</td>
          <td>{{ props.item.montoAbono | currency }}</td>      
          <td>{{ props.item.deudaInicial | currency }}</td>
          <td>{{ props.item.montoAbonado | currency}}</td>
          <td>{{ props.item.pendiente | currency }}</td>
          <td>
          <div v-if="props.item.idEstado == 0">
              <span class="blue--text">Realizado</span>
            </div>
          <div v-if="props.item.idEstado == 2">
              <span class="red--text">Anulado</span>
            </div>
            </td>
          <!-- <td>{{ props.item.tipo_persona }}</td>
          <td>{{ props.item.tipo_documento }}</td>
          <td>{{ props.item.num_documento }}</td>
          <td>{{ props.item.direccion }}</td>
          <td>{{ props.item.telefono }}</td>
          <td>{{ props.item.email }}</td> -->
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>

   
  </v-layout>

  
</template>
<script>
import axios from "axios";
import swal from "sweetalert";
import jsPDF from "jspdf";
import printerService from "../services/BluetoothPrinterService";
export default {
  data() {
    
    return {
      
      abonos: [],
      dialog: false,
      isMobile: false,
      headers: [
       { text: "Acciones", value: "opciones", sortable: false },
        { text: "No. Abono", value: "codigo",sortable: true },
        { text: "Nombre Cliente", value: "nombreCliente" },
        { text: "Nombre Vendedor", value: "usuario" },
        { text: "Fecha", value: "fecha" },
        { text: "Abono", value: "montoAbono" },
        { text: "Total Deuda", value: "deudaInicial" },
        { text: "Total Abonado", value: "montoAbonado" },
        { text: "Deuda pendiente", value: "deudaPendiente" },
        { text: "Estado", value: "IdAbono" },
        
       /* { text: "Tipo Persona", value: "tipo_persona" },
        { text: "Tipo Documento", value: "tipo_documento" },
        { text: "Número Documento", value: "num_documento", sortable: false },
        { text: "Dirección", value: "direccion", sortable: false },
        { text: "Teléfono", value: "telefono", sortable: false },
        { text: "Email", value: "email", sortable: false },*/
      ],
      
      search: "",
      editedIndex: -1,
      idusuario: "",
      vendedores: [],
      id: "",
      nombre: "",
      num_factura: "",
      nombreCliente:"",
      nombreVendedor: "",
      comprobanteModal: 0,
      deudaInicial: 0,
      totalabonado:0,
      totalDeuda:0,
      monto:0,
      Fecha: "",
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
  },

  created() {
    this.listar();
     //this.selectUsuario();
  },
  mounted() {
    this.checkDevice(); // Verificar al cargar
    window.addEventListener("resize", this.checkDevice); // Escuchar cambios de tamaño de ventana
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkDevice); // Limpiar el listener al destruir el componente
  },
  methods: {
    checkDevice() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|windows phone|opera mini|iemobile/i.test(userAgent.toLowerCase());
      
      // Detectar si el ancho es pequeño como para móvil
      const isSmallScreen = window.innerWidth <= 768; // Ejemplo de límite de ancho
      
      // Combinar ambas verificaciones
      this.isMobile = isMobileDevice || isSmallScreen;
    },
    formatCurrency(amount) {
      return `C$ ${new Intl.NumberFormat("es-NI").format(amount)}`;
    },
    async printBluetoothAbono() {
      try {
        const abonoData = {
          codigoAbono: this.num_factura,
          fecha: this.Fecha,
          nombreCliente: this.nombreCliente,
          nombreVendedor: this.nombreVendedor,
          deudaInicial: this.deudaInicial,
          totalAbonado: this.totalabonado,
          montoAbono: this.Monto,
          pendiente: this.pendiente,
        };

        // Mostrar SweetAlert de carga persistente
        swal({
          title: "Imprimiendo...",
          text: "Enviando datos a la impresora Bluetooth, por favor espere.",
          icon: "info",
          buttons: false,
          closeOnClickOutside: false,
          closeOnEsc: false,
        });

        // Imprimir vía Bluetooth
        await printerService.printAbono(abonoData);

        swal("Impresión exitosa", "El recibo de abono se imprimió correctamente.", "success");
      } catch (error) {
        console.error("Error al imprimir abono Bluetooth:", error);
        swal("Error de impresión", error.message || "No se pudo imprimir el recibo.", "error");
      }
    },
    redirigir() {
      // this.$router.push({ name: "login" });
      this.$store.dispatch("salir");
    },
customSort(items, index, isDesc) {
  items.sort((a, b) => {
    if (index === "date") {
      if (!isDesc) {
        return compare(a.date, b.date);
      } else {
        return compare(b.date, a.date);
      }
    }
  });
  return items;
},

activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.codigo;
      this.adId = item.idAbono;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    
    

  desactivar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("api/Creditos/RevertirAbono/" + this.adId, {}, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },

mostrarComprobante(item) {
      this.limpiar();
      this.id = item.id_Credito;
      this.num_factura = item.codigo;
     // this.nombreCliente = item.nombreDeCliente;
      this.nombreCliente = item.nombreCliente;
      this.nombreVendedor = item.usuario;
      this.Fecha = item.fecha;
      this.Monto = item.montoAbono;
      this.totalabonado = item.montoAbonado;
      this.pendiente = item.pendiente;
      this.deudaInicial = item.deudaInicial;
     this.comprobanteModal = 1;
    },
    ocultarComprobante() {
      this.comprobanteModal = 0;
      this.limpiar();
    },

  imprimir() {
      //window.print();
      var divToPrint=document.getElementById('ticket');
      console.log(divToPrint);
     var newWin=window.open('','Print-Window');

     newWin.document.open();
      
     newWin.document.write('<html><body font color="red" face="Times New Roman" size="+1" onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
    
     newWin.document.close();
    setTimeout(function(){ newWin.print(); newWin.close();},1000);
     //setTimeout(function(){newWin.close();},10);
    },
    listar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("/api/Creditos/ObtenerAbonos", configuracion)
        //.get("/api/CreditosIngreso/ObtenerAbonos", configuracion)
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
            me.redirigir();

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
     /* this.id = item.idpersona;
      this.nombre = item.nombre;
      this.tipo_documento = item.tipo_documento;
      this.num_documento = item.num_documento;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.editedIndex = 1;*/
      this.id = item.id_Credito;
      this.nombre = item.nombreDeCliente;
      this.totalDeuda = item.totalAPagar;
      this.pendiente = item.pendiente;
      this.totalabonado = item.abono;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.limpiar();
    },
    limpiar() {
      this.id = "";
      this.nombre = "";
      this.totalabonado = "";
      this.totalAPagar = "";
      this.monto = "";
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
              "Genear Abono",
              "El Abono se ha creado correctamente",
              "success"
            );
            me.close();
            me.listar();
            me.limpiar();
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
