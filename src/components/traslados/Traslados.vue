<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Traslados</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          v-if="verNuevo == 0"
          @click="listar()"
          color="primary"
          dark
          class="mb-2"
          >Buscar</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          v-if="verNuevo == 0"
          @click="mostrarNuevo"
          color="primary"
          dark
          class="mb-2"
          >Nuevo</v-btn
        >
        <v-dialog v-model="verArticulos" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      append-icon="search"
                      class="text-xs-center"
                      v-model="texto"
                      label="Ingrese artículo a buscar"
                      @keyup="listarArticulo()"
                    >
                    </v-text-field>
                    <template>
                      <v-data-table
                        :headers="cabeceraArticulos"
                        :items="articulos"
                        class="elevation-1"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="justify-center layout px-0">
                            <v-icon
                              small
                              class="mr-2 green--text"
                              @click="agregarDetalle(props.item)"
                            >
                              add
                            </v-icon>
                          </td>
                          <td>{{ props.item.nombre }}</td>
                          <td>{{ props.item.stock }}</td>
                        </template>
                        <template slot="no-data">
                          <h3>No hay artículos para mostrar.</h3>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="ocultarArticulos()" color="blue darken" flat>
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1"
              >¿Activar Item?</v-card-title
            >
            <v-card-title class="headline" v-if="adAccion == 2"
              >¿Anular Venta?</v-card-title
            >
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion == 1">Activar </span>
              <span v-if="adAccion == 2">Anular </span>
              el ítem {{ adNombre }}
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
        <v-dialog v-model="comprobanteModal" max-width="500px">
          <v-card>
            <v-card-text>
              <v-btn @click="imprimir()">
                <v-icon>print</v-icon>
              </v-btn>

              <div id="ticket">
                <link
                  rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css"
                  media="print"
                />

                <div id="logo">
                  <img
                    style="
                      text-align: center;
                      margin-top: 0px;
                      margin-bottom: 0px;
                    "
                    id="imagen"
                    src="@/assets/logo.png"
                    alt="Gema Moda"
                  />
                </div>

                <div>
                  <h5 style="font-weight: bold; font-size: 25px" v-if="EsVenta">
                      No. Factura: {{ consecutivo }} 
                    </h5>
                    <h5 style="font-weight: bold; font-size: 25px" v-if="!EsVenta">
                      No. Traslado: {{ consecutivo }}
                    </h5>
                  <h5 style="font-weight: bold; font-size: 25px" v-if="!EsVenta">
                    Bodega Origen: {{ NombreBodegaSalida }}
                  </h5>
                  <h5 style="font-weight: bold; font-size: 25px" v-if="EsVenta">
                    Cliente: Contado
                  </h5>
                  <h5 style="font-weight: bold; font-size: 25px" v-if="!EsVenta">
                    Bodega Destino: {{ NombreBodegaEntrada }}
                  </h5>
                  <!-- <h5 style="font-weight: bold; font-size: 25px" v-if="EsVenta">
                    <p v-if="NombreBodegaEntrada ==='MOVIL CAMION 2'"> #C-{{ consecutivo }} </p>
                    <p v-else> #M-{{ consecutivo }} </p>
                     
                  </h5> -->
                  <h5 style="font-weight: bold; font-size: 25px">
                    FECHA: {{ fecha_hora | moment("DD/MM/YYYY") }} |
                    {{ fecha_hora | moment("LT") }}
                  </h5>
                  <!-- <h5 style="margin-left: 10px">{{ fecha_hora | moment("LT") }}</h5> -->

                  <div style="font-weight: bold; font-size: 25px" class="okas">
                    -------------------------------------------------
                  </div>
                </div>
                <br />
                <div></div>
                <div class="okas">
                  -----------------------------------------------------------------------------------
                </div>

                <table>
                  <thead>
                    <tr>
                      <th
                        style="font-weight: bold; font-size: 20px"
                        class="producto"
                      >
                        Producto
                      </th>
                      <th
                        style="font-weight: bold; font-size: 20px"
                        class="cantidad"
                      >
                        Cantidad
                      </th>
                      <th v-if="EsVenta"
                        style="font-weight: bold; font-size: 20px"
                        class="cantidad"
                      >
                        Precio
                      </th>
                      <th v-if="EsVenta"
                        style="font-weight: bold; font-size: 20px"
                        class="cantidad"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="det in detalles" :key="det.iddetalle_venta">
                      <td
                        style="font-weight: bold; font-size: 18px"
                        id="producto"
                        class="producto"
                      >
                        {{ det.articulo }}
                      </td>
                      <td
                        class="cantidad"
                        style="font-weight: bold; font-size: 18px"
                      >
                        {{ det.cantidad }}
                      </td>
                      <td v-if="EsVenta"
                        class="cantidad"
                        style="font-weight: bold; font-size: 18px"
                      >
                        {{ det.precio }}
                      </td>
                      <td v-if="EsVenta"
                        style="font-weight: bold; font-size: 18px"
                        id="detalles"
                        class="precio"
                      >
                        {{
                          (det.cantidad * det.precio)  | currency
                        }}
                      </td>
                    </tr>

                  </tbody>
                </table>
                
                <br />
                    <br />
                    <strong v-if="EsVenta" style="font-weight: bold; font-size: 25px"
                  >Total: {{  (totalParcial = calcularTotal.toFixed(2)) | currency }}</strong
                >
                  
                <br />
                <strong style="font-weight: bold; font-size: 20px"
                  >Realizado por: {{ usuario }}</strong
                >
                <br /><br />
              </div>
              <v-btn @click="ocultarComprobante" color="blue darken-1" flat
                >Cancelar</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="tralados"
        :search="search"
        :custom-sort="customSort"
        class="elevation-1"
        v-if="verNuevo == 0"
      >
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verDetalles(props.item)">
              tab
            </v-icon>
            <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">
              print
            </v-icon>
          </td>
          <td>{{ props.item.consecutivo }}</td>
          <td>{{ props.item.sucursalSalida }}</td>
          <td>{{ props.item.sucursalEntrada }}</td>
          <td>{{ props.item.fecha | moment("DD/MM/YYYY") }}</td>
          <td>{{ props.item.userName }}</td>
          
    
      <td>
  <div class="text-center">
   
<span  v-if="props.item.estado == 'Realizado'">

  <v-chip
    class="ma-2"
    color="cyan"
    label
    text-color="white"
  >
    <v-icon left>
     check_circle
    </v-icon>
    {{ props.item.estado }}
  </v-chip>
</span>
<span v-if="props.item.estado == 'Anulado'">

  <v-chip
    class="ma-2"
    color="pink"
    label
    text-color="white"
  >
    <v-icon left>
      highlight_off
    </v-icon>
      {{ props.item.estado }}
  </v-chip>
</span>
  </div>
      </td>

      
         
          <!--    <td>{{ props.item.fecha_hora | moment("DD/MM/YYYY") }}</td> -->
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>

      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <!--  <v-flex xs12 sm6 md4 lg4 xl4> -->
          <v-flex xs12 sm5>
            <v-select
              v-model="sucursalOrigen"
              :items="sucursales"
              label="Bucursal Origen"
              @change="validarSucursal"
            >
            </v-select>
          </v-flex>

          <v-spacer></v-spacer>

          <!-- <v-flex xs12 sm6 md6 lg4 xl4> -->
          <v-flex xs12 sm5>
            <v-select
              v-model="sucursalDestino"
              :items="sucursales"
              label="Bodega Destino"
              @change="validarSucursal"
            >
            </v-select>
          </v-flex>

          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-text-field
              @keyup.enter="buscarCodigo()"
              v-model="codigo"
              label="Código"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn @click="mostrarArticulos()" small fab dark color="teal">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-if="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-data-table
              :headers="cabeceraDetalles"
              :items="detalles"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2 red--text"
                    @click="eliminarDetalle(detalles, props.item)"
                  >
                    delete
                  </v-icon>
                </td>
                <td>{{ props.item.articulo }}</td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="props.item.cantidad"
                    v-on:change="onChange($event, props.item.stock)"
                  ></v-text-field>
                </td>

                <div v-if="props.item.stock > 0">
                  <v-text-field
                    class="custom-label-color"
                    disabled
                    color="green"
                    type="number"
                    v-model="props.item.stock"
                    v-if="props.item.stock > 0"
                  ></v-text-field>
                </div>

                <div v-else>
                  <v-text-field
                    class="custom-label-color2"
                    disabled
                    color="green"
                    type="number"
                    v-model="props.item.stock"
                  ></v-text-field>
                </div>

                <td>
                  <!--  <v-text-field
                    type="number"
                    v-model="props.item.descuento"
                  ></v-text-field> -->
                </td>
              </template>
              <template slot="no-data">
                <h3>No hay artículos agregados al detalle.</h3>
              </template>
            </v-data-table>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn @click="ocultarNuevo()" color="blue darken-1" flat
              >Cancelar</v-btn
            >
            <v-btn
              v-if="verDet == 0"
              :disabled="ocultarboton"
              @click="guardar()"
              color="success"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import Vue from "vue";
import {
  AutoCompletePlugin,
  AutocompletePlugin,
} from "@syncfusion/ej2-vue-dropdowns";
Vue.use(AutoCompletePlugin);
import axios from "axios";
import jsPDF from "jspdf";
import swal from "sweetalert";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      tralados: [],
      dialog: false,
      ocultarboton: false,

      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "No. Traslado", value: "consecutivo", sortable: false },
        { text: "Bodega Origen", value: "sucursalsalida", sortable: false },
        { text: "Bodega Destino", value: "sucursalentrada", sortable: false },
        { text: "Fecha", value: "Fecha", sortable: false },
        { text: "Usuario", value: "username", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Artículo", value: "articulo", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        {
          text: "Stock Actual Sucursal Origen",
          value: "stock",
          sortable: false,
        },
        // { text: "Stock Destino", value: "precio", sortable: false },
        /*  { text: "Descuento", value: "descuento", sortable: false },
        { text: "Subtotal", value: "subtotal", sortable: false }, */
      ],
      detalles: [],
      consecutivo: "",
      EsVenta: 0,
      IdSucursalEntrada: "",
      IdSucursalSalida: "",
      NombreBodegaEntrada: "",
      NombreBodegaSalida: "",
      usuario: "",
      IdUsuario: "",
      search: "",
      id: "",
      idcliente: "",
      idusuario: "",
      sucursales: [],
      vendedores: [],
      sucursalOrigen: "",
      sucursalDestino: "",
      num_factura: 0,
      // Sucursales: ["Gema moda central", "Gema moda 2","Gema moda móvil"],
      impuesto: 0,
      pagar: 0,
      codigo: "",
      verNuevo: 0,
      errorArticulo: null,
      totalParcial: 0,
      totalImpuesto: 0,
      total: 0,
      cambio: 0,
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Artículo", value: "articulo" },
        { text: "Stock", value: "stock", sortable: false },
      ],
      articulos: [],
      texto: "",
      verArticulos: 0,
      verDet: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      comprobanteModal: 0,
      cliente: "",
      vendedor: "",
      num_documento: "",
      fecha_hora: "",
      num_factura: "",
      direccion: "",
      telefono: "",
      email: "",
    };
  },
  computed: {
    calcularTotal: function () {
      var resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado +
          (this.detalles[i].precio * this.detalles[i].cantidad);
      }
      console.log('***', resultado)
      return resultado;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectSucursal();
    this.selectUsuario();
  },
  methods: {
    onChange(event, articulotock) {
      let cantidad = parseInt(event);
     /*  let stock = parseInt(articulotock);

      if (cantidad > stock) {
        swal({
          title: "La cantidad no puede ser mayor al stock disponible",
          // text:"Debe de seleccionar la sucursal origen",
          icon: "error",
          timer: 1500,
        });
        return;
      } */
    },

    validarSucursal() {
      if (!this.sucursalOrigen) {
        swal({
          title: "Debe de seleccionar la bodega origen",
          // text:"Debe de seleccionar la sucursal origen",
          icon: "error",
          timer: 1500,
        });
        return;
      }

      if (this.sucursalOrigen === this.sucursalDestino) {
        swal({
          title: "La bodega origen no puede ser igual que la bodega destino",
          // text:"Debe de seleccionar la sucursal origen",
          icon: "error",
          timer: 1500,
        });
        return;
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

    imprimir() {
      //window.print();
      var divToPrint = document.getElementById("ticket");
      //console.log(divToPrint);
      var newWin = window.open("", "Print-Window");

      newWin.document.open();

      newWin.document.write(
        '<html><body font color="red" face="Times New Roman" size="+1" onload="window.print()">' +
          divToPrint.innerHTML +
          "</body></html>"
      );

      newWin.document.close();

      setTimeout(function () {
        newWin.print();
        newWin.close();
      }, 1000);
      //setTimeout(function(){ newWin.close();},10);
    },
    crearPDF() {
      //var quotes = document.getElementById("factura");
      var quotes = document.getElementById("ticket");
      html2canvas(quotes).then(function (canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        //var pageHeight = 295;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        //var doc = new jsPDF("p", "mm", "a4");
        var doc = new jsPDF("p", "pt", "letter");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        doc.save("FacturaVenta.pdf");
      });
    },
    mostrarComprobante(item) {
      console.log("Comprobante: ", item);
      this.limpiar();
      this.EsVenta = item.esVenta;
      this.consecutivo = item.consecutivo;
      this.sucursalDestino = item.idSucursalEntrada;
      this.sucursalOrigen = item.idSucursalSalida;
      this.NombreBodegaEntrada = item.sucursalEntrada;
      this.NombreBodegaSalida = item.sucursalSalida;
      this.usuario = item.userName;
      this.fecha_hora = item.fecha;
      this.listarDetalles(item.id);
      this.verNuevo = 1;
      this.verDet = 1;
      this.comprobanteModal = 1;
    },
    ocultarComprobante() {
      this.comprobanteModal = 0;
      this.limpiar();
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    buscarCodigo() {
      let me = this;
      if (!this.sucursalOrigen) {
        swal({
          title: "Debe de seleccionar la sucursal origen",
          // text:"Debe de seleccionar la sucursal origen",
          icon: "warning",
          timer: 2000,
        });
        this.codigo = "";
        return;
      }
      me.errorArticulo = null;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "api/Articulos/BuscarCodigoIngresoSucursal/" +
            this.codigo +
            "/" +
            this.sucursalOrigen,
          configuracion
        )
        .then(function (response) {
          //console.log(response);
          //   this.codigo = "";
          me.codigo = "";
          me.agregarDetalle(response.data);
        })
        .catch(function (error) {
          console.log(error);
          me.errorArticulo = "No existe el artículo";
        });
    },
    listarArticulo() {
      let me = this;
      me.articulos = [];

      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "api/Articulos/ListarTrasladoSucursal/" +
            me.texto +
            "/" +
            me.sucursalOrigen,
          configuracion
        )
        .then(function (response) {
          //console.log(response);
          me.articulos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mostrarArticulos() {
      if (!this.sucursalOrigen) {
        swal({
          title: "Debe de seleccionar la sucursal origen",
          // text:"Debe de seleccionar la sucursal origen",
          icon: "warning",
          timer: 2000,
        });
        return;
      }
      this.verArticulos = 1;
    },
    ocultarArticulos() {
      this.verArticulos = 0;
    },
    agregarDetalle(data = []) {
      this.errorArticulo = null;
      if (this.encuentra(data["idarticulo"])) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        console.log("DATA: ", data);
        // console.log("STOCK: ",data.stocks[0].stock);

        if (data.stocks) {
          this.texto = "";
          this.detalles.push({
            IdArticulo: data["idarticulo"],
            articulo: data["nombre"],
            cantidad: 1,
            stock: data.stocks[0].stock,

            descuento: 0,
          });
        } else {
          this.texto = "";
          this.detalles.push({
            IdArticulo: data["idarticulo"],
            articulo: data["nombre"],
            cantidad: 1,
            stock: data.stock,

            descuento: 0,
          });
        }
      }
    },
    encuentra(id) {
      var sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].IdArticulo == id) {
          sw = 1;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      var i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    },

    listar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let url = "";
      url = "api/Articulos/ListarTraslados/";

      axios
        .get(url, configuracion)
        .then(function (response) {
          console.log("Data_ ", response.data);

          me.tralados = response.data;
        })
        .catch(function (error) {
          if (error.response.status == "401") {
            swal(
              "Sesión caducada",
              "Su sesión ha expirado favor volver a iniciar sesión",
              "warning"
            );
            me.redirigir();
          }
        });
    },
    listarDetalles(id) {
      let me = this;
      var detallesArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/ListarDetalleTraslado/" + id, configuracion)
        .then(function (response) {
          //me.detalles = response.data;
          console.log("Listardetalles: ", response.data);
          detallesArray = response.data;
          detallesArray.map(function (x) {
            me.detalles.push({
              IdArticulo: x.name,
              articulo: x.nombreArticulo,
              cantidad: x.cantidad,
              precio: x.precioVenta
            });
          });

          //console.log("Listardetalles: ",me.detalles);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verDetalles(item) {
      console.log("Detalles: ", item);
      this.limpiar();
      this.sucursalDestino = item.idSucursalEntrada;
      this.sucursalOrigen = item.idSucursalSalida;
      this.listarDetalles(item.id);
      this.verNuevo = 1;
      this.verDet = 1;
    },
    selectSucursal() {
      let me = this;
      var SucursalesArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/Sucursal", configuracion)
        .then(function (response) {
          SucursalesArray = response.data;
          console.log(SucursalesArray);
          SucursalesArray.map(function (x) {
            me.sucursales.push({ text: x.name, value: x.id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectUsuario() {
      let me = this;
      var usuariosArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Usuarios/Select", configuracion)
        .then(function (response) {
          usuariosArray = response.data;
          usuariosArray.map(function (x) {
            me.vendedores.push({ text: x.nombre, value: x.idusuario });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiar() {
      this.id = "";
      this.idcliente = "";
      this.idusuario = "";
      this.sucursalOrigen = "";
      this.sucursalDestino = "";
      this.impuesto = 0;
      this.codigo = "";
      this.detalles = [];
      this.validaMensaje = [];
      this.total = 0;
      this.pagar = 0;
      this.cambio = 0;
      this.totalImpuesto = 0;
      this.totalParcial = 0;
      this.verDet = 0;
    },
    guardar() {
      /*  if (this.validar()) {
        return;
      } */
      //$("button").prop("disabled", false);
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      me.ocultarboton = true;
      axios
        .post(
          "api/Articulos/InsertarTraslado",
          {
            IdSucursalEntrada: me.sucursalDestino,
            IdSucursalSalida: me.sucursalOrigen,
            UsuarioId: me.$store.state.usuario.idusuario,
            DetalleTraslado: me.detalles,
          },
          configuracion
        )

        .then(function (response) {
          swal(
            "Traslado realizado",
            "El traslado se ha realizado correctamente",
            "success"
          );
          //alert(response);
          me.ocultarboton = false;
          me.ocultarNuevo();
          me.listar();
          me.limpiar();
        })
        .catch(function (error) {
          if (error.response.data.ok) {
            swal(
              "Error el realizar traslado",
              error.response.data.message,
              "error"
            );
          } else {
            swal("Error el realizar traslado", "Ha ocurrido un error", "error");
          }
          //   alert(error);

          me.ocultarboton = false;
          console.log("****", error.response.data);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.tipo_comprobante == "CONTADO") {
        if (this.pagar <= 0 || this.pagar == undefined) {
          this.validaMensaje.push("Ingrese un monto a pagar válido");
        }
        if (
          parseFloat(parseFloat(this.pagar).toFixed(2)) <
          parseFloat(parseFloat(this.total).toFixed(2))
        ) {
          this.validaMensaje.push(
            "El precio a pagar no puede ser menor al total neto"
          );
        }
      }

      if (!this.idcliente) {
        this.validaMensaje.push("Seleccione un cliente.");
      }

      if (this.idcliente == 49 && this.tipo_comprobante == "CREDITO") {
        this.validaMensaje.push("Seleccione un cliente válido para Credito");
        swal(
          "Cliente de crédito no válido",
          "El cliente de crédito que selecciono debe de tener un nombre válido",
          "error"
        );
      }
      if (!this.idusuario) {
        this.validaMensaje.push("Seleccione un vendedor.");
      }
      if (!this.tipo_comprobante) {
        this.validaMensaje.push("Seleccione un tipo de factura.");
      }
      /*if (!this.num_comprobante) {
        this.validaMensaje.push("Ingrese el número del comprobante.");
      }*/
      if (this.impuesto < 0) {
        this.validaMensaje.push("Ingrese un envio válido.");
      }
      if (this.cantidad <= 0) {
        this.validaMensaje.push("Ingrese una cantidad válida.");
      }

      if (this.cantidad > this.stock) {
        this.validaMensaje.push("No hay suficiente stock para la venta.");
      }

      if (this.detalles.cantidad <= 0) {
        this.validaMensaje.push("A la bestia.");
      }

      /* if (this.cantidad > cantidad) {
        this.validaMensaje.push("No se hay sufiente stock en el articulo.");
      }*/

      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un artículo al detalle.");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.num_comprobante;
      this.adId = item.idventa;
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
        .put("api/Ventas/Anular/" + this.adId, {}, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style >
@import url(https://cdn.syncfusion.com/ej2/material.css);
/*#factura {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 150px;
}

#fact {
  font-size: 18px;
  color: #2183e3;
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
/*}
/*
#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#cliente {
  /*text-align: left;*/
/*text-align: center;
}
/*
#facliente {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #2183e3;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}
#nombreFactura {
  margin-top: 20px;
  font-size: 40px;
  color: #2183e3;
  font-family: cursive;
  margin-right: 120px;
}

#gracias {
  text-align: center;
}
#datosFactura {
  text-align: center;
}

#detalles {
  text-align: center;
}*/

#logo {
  margin: 0 auto;
}
#imagen {
  width: 30px;
  margin-top: 0px;
  margin-bottom: 0px;
}
td,
th,
tr,
table {
 /*  border-top: 1px solid black;
  border-collapse: collapse; */
  border: none !important;
}

td.producto,
th.producto {
  width: 60px;
  text-align: center;
  max-width: 40px;
  font-size: 8px;
  font-family: "Times New Roman";
  word-break: break-all;
}

td.cantidad,
th.cantidad {
  text-align: center;
  width: 40px;
  max-width: 60px;
  word-break: normal;
  font-size: 8px;
  font-family: "Times New Roman";
}

td.precio,
th.precio {
  width: 60px;
  margin-left: 200px;
  max-width: 40px;
  font-size: 8px;
  text-align: center;
  font-family: "Times New Roman";
  word-break: break-all;
}

#centrado {
  text-align: center;
  align-content: center;
  font-weight: bold;
}

.centrado {
  text-align: center;
  align-content: center;
  font-weight: bold;
}
.custom-placeholer-color input::placeholder {
  color: #01a101 !important;
  opacity: 1;
}

.custom-label-color .v-label {
  color: #01a101;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color input {
  color: #01a101 !important;
}

/**Red */

.custom-placeholer-color input::placeholder {
  color: green !important;
  opacity: 1;
}

.custom-label-color2 .v-label {
  color: red;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color2 input {
  color: red !important;
}
.texto {
  text-align: center;
  align-content: center;
  margin: auto;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
}

#ticket {
  width: 255px;
  max-width: 255px;
  font-size: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
  margin-left: 40px;
}
/* #ticket .precio {
    width: 60px;
    margin-left: 100px;
    max-width: 40px;
    font-size: 8px;
    text-align: center;;
    font-family: 'Times New Roman';
    word-break: break-all;
    
} */

.okas {
  border-top-style: dotted;
}
img {
  max-width: inherit;
  width: inherit;
}
@media print {
  .oculto-impresion,
  .oculto-impresion * {
    display: none !important;
  }
}
</style>
