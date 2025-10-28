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
              <v-btn v-if="isMobile" @click="generatePDF()">
                <v-icon>print</v-icon>
              </v-btn>
  <div id="ticket">
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
    generatePDF() {

  const pdf = new jsPDF({
    unit: "mm",
    format: [58, 297], // Ancho: 58mm, altura dinámica
  });

  // Configuración inicial
  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(10);

  const margin = 5; // Margen izquierdo
  let y = margin; // Posición vertical inicial

    // Detalles del recibo
  pdf.setFontSize(10);
  y += 5;  // Espacio después del texto
  pdf.text(`No. Abono: ${this.num_factura}`, margin, y);
  y += 5;

  pdf.text(`Fecha: ${new Date(this.Fecha).toLocaleString()}`, margin, y);
  y += 5;

  pdf.text(`Cliente: ${this.nombreCliente}`, margin, y);
  y += 5;

  pdf.text(`Usuario: ${this.nombreVendedor}`, margin, y);
  y += 8;

  // Detalles de pago
  pdf.setFontSize(10);
  pdf.text("Detalles del Pago:", margin, y);
  
  y += 5;
  if (parseFloat(this.totalabonado) !== parseFloat(this.Monto)) {
  // Si los montos son diferentes, restar deudaInicial - montoAbono
  const saldoCalculado = parseFloat(this.pendiente) + parseFloat(this.Monto);
  pdf.text(`Saldo Anterior: ${this.formatCurrency(saldoCalculado)}`, margin, y);
} else {
  // Si son iguales, mostrar deudaInicial directamente
  pdf.text(`Saldo Anterior: ${this.formatCurrency(this.deudaInicial)}`, margin, y);
}
y += 5;
  pdf.text(`Abono: ${this.formatCurrency(this.Monto)}`, margin, y);
  y += 5;

  pdf.text(`Saldo Pendiente: ${this.formatCurrency(this.pendiente)}`, margin, y);
  y += 8;

  // Mensaje adicional
  pdf.setFontSize(10);
  pdf.text("Gracias por su pago.", margin, y);
  y += 5;

  pdf.text("Por favor conserve este recibo.", margin, y);

  // Descargar el PDF
  pdf.save(`recibo-${this.num_factura}.pdf`);
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
