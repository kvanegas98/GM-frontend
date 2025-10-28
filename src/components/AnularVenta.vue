<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Anular Ventas</v-toolbar-title>
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
        <v-spacer></v-spacer>
        Desde:&nbsp;
        <v-text-field
          type="date"
          class="text-xs-center"
          v-model="fechaInicio"
        ></v-text-field>
        Hasta:&nbsp;
        <v-text-field
          type="date"
          class="text-xs-center"
          v-model="fechaFin"
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
        <!-- <v-btn
          v-if="verNuevo == 0"
          @click="mostrarNuevo"
          color="primary"
          dark
          class="mb-2"
          >Nuevo</v-btn
        > -->
        <v-dialog v-model="verArticulos" max-width="1000px"
      transition="dialog-bottom-transition">
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
                      label="Ingrese el nombre del artículo a buscar"
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
                              class="mr-2"
                              @click="agregarDetalle(props.item)"
                            >
                              add
                            </v-icon>
                          </td>
                          <td>{{ props.item.nombre }}</td>
                          <td>{{ props.item.categoria }}</td>
                          <td>{{ props.item.descripcion }}</td>
                          <td>{{ props.item.stock }}</td>
                          <td>{{ props.item.precio_venta }}</td>
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

               <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css" media="print">
              
                <div id="logo"> 
                    <img style="text-align:center;
                      margin-top: 0px;
                    margin-bottom: 0px;" id="imagen" src="@/assets/logo.png" alt="Gema Moda" />
                  </div>
              
            
                    <div >

                    <h5 style="font-weight: bold; font-size:25px;">NO. {{ num_factura }}</h5>
                    <h5 style="font-weight: bold; font-size:25px;">FACTURA: {{ tipo_comprobante }}</h5>
                    <h5 style="font-weight: bold; font-size:25px;">FECHA: {{ fecha_hora | moment("DD/MM/YYYY") }} |  {{ fecha_hora | moment("LT") }}  </h5>
                    <!-- <h5 style="margin-left: 10px">{{ fecha_hora | moment("LT") }}</h5> -->
                    
                    <div style="font-weight: bold; font-size:25px; " class="okas">-------------------------------------------------</div>
                    </div>
                    <br>
                    <div>
        
         <div class = "flow-text">
             
                            <h5 style="font-weight: bold; font-size:20px;">Sr(a): {{ cliente }}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Documento: {{num_documento}}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Dirección: {{direccion}}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Telefono: {{telefono}}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Email: {{email}}</h5>
                      
         </div>
      </div>	
      <div class="okas">-----------------------------------------------------------------------------------</div>

                  
            <table>
                <thead>
                    <tr>
                        <th style="font-weight: bold; font-size:20px;" class="cantidad">Cantidad</th>
                        <th style="font-weight: bold; font-size:20px;" class="producto">Producto</th>
                        <th style="font-weight: bold; font-size:20px;" class="precio">Precio</th>
                        <th style="font-weight: bold; font-size:20px;" class="precio">Descuento</th>
                        <th style="font-weight: bold; font-size:20px;" class="precio">Total</th>
                    </tr>
                </thead>
                <tbody>
                  
                       <tr v-for="det in detalles" :key="det.iddetalle_venta">
                          <td  class="cantidad" style="font-weight: bold; font-size:18px;">{{ det.cantidad }}</td>
                          <td style="font-weight: bold; font-size:18px;"  id="producto" class="producto" >{{ det.articulo }}</td>
                          <td style="font-weight: bold; font-size:18px;" id="precio" class="precio">{{ det.precio.toFixed(2) }}</td>
                          <td style="font-weight: bold; font-size:18px; text-align:center;" id="precio">{{ det.descuento  }}</td>
                          <td style="font-weight: bold; font-size:18px;" id="detalles" class="precio">
                            {{
                              (
                                det.cantidad * det.precio -
                                det.descuento
                              ).toFixed(2) 
                            }}
                          </td>
                        </tr>
                        
                </tbody>
                <tfoot>
                        <br />
                        <br />
                        <tr>
                          <th></th>
                          <th></th>
                           <th></th>
                          <th style="font-weight: bold; font-size:20px;">SUBTOTAL:</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            {{
                              (totalParcial = calcularTotal.toFixed(2))
                                | currency
                            }}
                          </th>
                        </tr>
                        <tr>
                          <th>
                          </th>
                          <th>
                          </th>
                           <th></th>
                          <th style="font-weight: bold; font-size:20px;">ENVIO:</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            {{ (totalImpuesto = impuesto) | currency }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                           <th></th>
                            <th></th>
                          <th style="font-weight: bold; font-size:20px;">TOTAL</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            {{
                              (total =
                                parseFloat(totalImpuesto) +
                                parseFloat(totalParcial)).toFixed(2) | currency
                            }}
                          </th>
                        </tr>
                  
                      </tfoot>
            </table>
            <br>
            <strong style="font-weight: bold; font-size:20px;">Atendido por: {{ vendedor }}</strong>
            <br><br>
            <div class="div" style="text-align: center">
                <strong style="font-weight: bold; font-size:30px;" class="text-bold centrado">¡GRACIAS POR SU COMPRA!</strong>
            </div>
            
        </div>
              <v-btn @click="ocultarComprobante" color="blue darken-1" flat
                >Cancelar</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>

             <div style="margin-left: 40%;">
                                <v-progress-circular
                                  :rotate="360"
                                  :size="100"
                                  :width="15"
                                  indeterminate
                                  v-show="isLoading"
                                  color="primary"
                                >
                                </v-progress-circular>

                       </div>
      <v-data-table
        :headers="headers"
        :items="ventas"
        :search="search"
        :custom-sort="customSort"
        class="elevation-1"
        v-if="verNuevo == 0">
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verDetalles(props.item)">
              tab
            </v-icon>
            <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">
              print
            </v-icon>
            <template v-if="props.item.estado!= 'Anulado' ">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                block
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.sucursal }}</td>
          <td>{{ props.item.codigoFactura }}</td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.cliente }}</td>
          <td>{{ props.item.tipo_comprobante }}</td>
          <td>{{ props.item.fecha_hora | moment("DD/MM/YYYY") }}</td>
          <td>{{ props.item.impuesto | currency }}</td>
          <td>{{ props.item.total | currency }}</td>
         <td>
            <div class="text-center">
              <span v-if="props.item.estado == 'Aceptado'">
                <v-chip class="ma-2" color="cyan" label text-color="white">
                  <v-icon left> check_circle </v-icon>
                  {{ props.item.estado }}
                </v-chip>
              </span>
              <span v-if="props.item.estado == 'CANCELADO'">
                <v-chip class="ma-2" color="cyan" label text-color="white">
                  <v-icon left> check_circle </v-icon>
                  {{ props.item.estado }}
                </v-chip>
              </span>
              <span v-if="props.item.estado == 'PENDIENTE'">
                <v-chip class="ma-2" color="yellow darken-3" label text-color="white">
                  <v-icon left> hourglass_top </v-icon>
                  {{ props.item.estado }}
                </v-chip>
              </span>

              <span v-if="props.item.estado == 'Anulado'">
                <v-chip class="ma-2" color="red accent-4" label text-color="white">
                  <v-icon left> highlight_off </v-icon>
                  {{ props.item.estado }}
                </v-chip>
              </span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm5 md5 lg5 xl5>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo Factura"
            >
            </v-select>
          </v-flex>
  <v-spacer></v-spacer>
          <v-flex xs12  sm6 md6 lg6 xl6>
            <v-select
              v-model="idbodega"
              :items="bodegas"
              label="Bodega"
             
            >
            </v-select>
          </v-flex>

          <v-flex xs12 sm5 md5 lg5 xl5>
            <v-select v-model="idusuario" :items="vendedores" label="Vendedor" autocomplete="on">
            </v-select>
          </v-flex>

        <v-spacer></v-spacer>
            <v-flex xs12 sm6 md6 lg6 xl6>
            <v-select v-model="idcliente" :items="clientes" label="Cliente" autocomplete="on">
            </v-select>
          </v-flex>
        
        
      
          <v-flex xs12 sm5 md5 lg5 xl5>
            <v-text-field type="number" v-model="impuesto" label="Envio">
            </v-text-field>
          </v-flex>
           <v-spacer></v-spacer>
          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-text-field
              @keyup.enter="buscarCodigo()"
              v-model="codigo"
              label="Buscar articulo por código"
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
                    class="mr-2"
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
                    @onchange="onChange()"
                  ></v-text-field>
                </td>
             
                  
                 <div v-if="props.item.stock >0">
                    <v-text-field
                  class="custom-label-color"
             disabled
              color="green"
                    type="number"
                    v-model="props.item.stock"
                    v-if="props.item.stock >0"
                   
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
                  <v-text-field
                    type="number"
                    disabled="disabled"
                    v-model="props.item.precio"
                    
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="props.item.descuento"
                  ></v-text-field>
                </td>
                <td>
                  $
                  {{
                    props.item.cantidad * props.item.precio -
                    props.item.descuento
                  }}
                </td>
              </template>
              <template slot="no-data">
                <h3>No hay artículos agregados al detalle.</h3>
              </template>
            </v-data-table>
            <v-flex class="text-xs-right">
              <strong>Subtotal: </strong>
              {{ (totalParcial = calcularTotal.toFixed(2)) | currency }}
            </v-flex>
          
            <v-flex class="text-xs-right">
              <strong>Envio: </strong>
              {{ (impuesto | currency) }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total Neto: </strong>
              {{
                (total =
                  parseFloat(totalImpuesto) + parseFloat(totalParcial)).toFixed(
                  2
                ) | currency
              }}
            </v-flex>
             <v-flex class="text-xs-right">
              <strong>Efectivo: </strong>
              
                {{ (pagar | currency) }}
            
            </v-flex>

             <v-flex class="text-xs-right">
              <strong>Cambio: </strong>
              
               {{
                (cambio =
                 parseFloat(pagar).toFixed(2) -
                  (parseFloat(totalImpuesto) + parseFloat(totalParcial)).toFixed(
                  2
                ) ) | currency
              }}
            
            </v-flex>
          </v-flex>

          
          <v-flex xs12 sm12 md12 lg12 xl12>
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field  v-model="pagar" label="Efectivo a pagar">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn @click="ocultarNuevo()" color="blue darken-1" flat
              >Cancelar</v-btn
            >
            <v-btn v-if="verDet == 0" :disabled="ocultarboton" @click="guardar()" color="success"
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
import { AutoCompletePlugin, AutocompletePlugin } from '@syncfusion/ej2-vue-dropdowns';
Vue.use(AutoCompletePlugin);
import axios from "axios";
import jsPDF from "jspdf";
import swal from "sweetalert";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      ventas: [],
      dialog: false,
        isLoading: true,
      ocultarboton: false,
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Sucursal", value: "sucursal", sortable: false },
        { text: "No. Factura", value: "codigoFactura", sortable: false },
        { text: "Vendedor", value: "usuario", sortable: false },
        { text: "Cliente", value: "cliente", sortable: false },
        { text: "Tipo Factura", value: "tipo_comprobante", sortable: false },
        
        { text: "Fecha", value: "fecha_hora" },
        { text: "Envio", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Artículo", value: "articulo", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Stock Actual", value: "stock", sortable: false },
        { text: "Precio", value: "precio", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "Subtotal", value: "subtotal", sortable: false },
      ],
      detalles: [],
      search: "",
      id: "",
      idcliente: "",
      idusuario: "",
      idbodega: "",
      clientes: [],
      vendedores: [],
      bodegas: [],
      tipo_comprobante: "",
      num_factura: 0,
      comprobantes: ["CONTADO", "CREDITO"],
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
        { text: "Categoría", value: "categoria" },
        { text: "Descripción", value: "descripcion", sortable: false },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Precio Venta", value: "precio_venta", sortable: false },
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
      adIdSucursal: "",
      comprobanteModal: 0,
      cliente: "",
      vendedor: "",
      num_documento: "",
      fecha_hora: "",
      num_factura: "",
      direccion: "",
      telefono: "",
      email: "",
      fechaInicio:"2023-01-01",
      fechaFin:"",
    };
  },
  computed: {
    calcularTotal: function() {
      var resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado +
          (this.detalles[i].precio * this.detalles[i].cantidad -
            this.detalles[i].descuento);
      }
      return resultado;
    },
   
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },


  created() {
   this.obtenerFechas();

    this.listar();
    this.select();
    this.selectUsuario();
    this.selectSucursal();
   this.idbodega = parseInt( this.$store.state.usuario.idsucursal);
    
    
  },
  methods: {
 obtenerFechas() {
      const hoy = new Date();
      const primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      // Formatear la fecha al estilo "YYYY-MM-DD"
      const formato = fecha => {
        return fecha.toISOString().split('T')[0];
      };
      
      console.log('***** '+formato(primerDiaDelMes));
       this.fechaInicio = formato(primerDiaDelMes);
       this.fechaFin = formato(hoy);
    
  },

 onChange:function(event){
            console.log(this.selectedValue);
            alert("Sii "+props.item.cantidad);
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
      var divToPrint=document.getElementById('ticket');
      //console.log(divToPrint);
     var newWin=window.open('','Print-Window');

     newWin.document.open();
      
     newWin.document.write('<html><body font color="red" face="Times New Roman" size="+1" onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
    
     newWin.document.close();
     
    
     setTimeout(function(){ newWin.print(); newWin.close();},1000);
     //setTimeout(function(){ newWin.close();},10);
    },
    crearPDF() {
      //var quotes = document.getElementById("factura");
      var quotes = document.getElementById("ticket");
      html2canvas(quotes).then(function(canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        //var pageHeight = 295;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        //var doc = new jsPDF("p", "mm", "a4");
        var doc = new jsPDF("p","pt","letter");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        doc.save("FacturaVenta.pdf");
      });
    },
    mostrarComprobante(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.num_factura = item.codigoFactura;
      this.cliente = item.cliente;
      this.vendedor = item.usuario;
      this.num_documento = item.num_documento;
      this.fecha_hora = item.fecha_hora;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.impuesto = item.impuesto;
      this.listarDetalles(item.idventa);
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

 if(!this.idbodega){


        swal({
            title: "Debe de seleccionar la sucursal origen",
           // text:"Debe de seleccionar la sucursal origen",
            icon:"warning",
            timer: 2000,
           
        }
          );
          this.codigo="";
        return;
      }

      let me = this;
      me.errorArticulo = null;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/BuscarCodigoVenta/" + this.codigo+'/'+me.idbodega, configuracion)
        .then(function(response) {
          //console.log(response);
       //   this.codigo = "";
          me.codigo = "";
          me.agregarDetalle(response.data);
        })
        .catch(function(error) {
          console.log(error);
          me.errorArticulo = "No existe el artículo";
        });
      
    },
    listarArticulo() {
      let me = this;
      me.articulos=[];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/ListarVenta/" + me.texto+'/'+me.idbodega, configuracion)
        .then(function(response) {
          //console.log(response);
          me.articulos = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    mostrarArticulos() {
      this.verArticulos = 1;
    },
    ocultarArticulos() {
      this.articulos=[];
      this.texto ="";
      this.verArticulos = 0;
    },
    agregarDetalle(data = []) {
      this.errorArticulo = null;
      if (this.encuentra(data["idarticulo"])) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.texto="";
        this.detalles.push({
          idarticulo: data["idarticulo"],
          articulo: data["nombre"],
          cantidad: 1,
          precio: data["precio_venta"],
          stock: data["stock"],

          descuento: 0,
        });
      }
    },
    encuentra(id) {
      var sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].idarticulo == id) {
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
      var dias = 90;
      var TuFecha = new Date();
      var resultado;

      //dias a sumar
      var dias = parseInt(dias);

      //nueva fecha sumada
      TuFecha.setDate(TuFecha.getDate() + dias);
     
      resultado = TuFecha.getDay();
      
      var fecha;

     
      let me = this;
      me.isLoading = true;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let url = "";
       url = "api/Ventas/ListarAnularVentasPorFecha/"+this.fechaInicio+"/"+this.fechaFin;
     
      axios
        .get(url, configuracion)
        .then(function(response) {
            me.isLoading = false;
          me.ventas = response.data;
         
        })
        .catch(function(error) {
          me.isLoading = false;
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
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Ventas/ListarDetalles/" + id, configuracion)
        .then(function(response) {
          //console.log(response);
          me.detalles = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    verDetalles(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.idcliente = item.idcliente;
      this.idusuario = item.idusuario;
      this.impuesto = item.impuesto;
      this.cambio = item.cambio;
      this.pagar = item.pagar;
      this.listarDetalles(item.idventa);
      this.verNuevo = 1;
      this.verDet = 1;
    },
    select() {
      let me = this;
      var clientesArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Personas/SelectClientes", configuracion)
        .then(function(response) {
          clientesArray = response.data;
         // console.log(clientesArray);
          clientesArray.map(function(x) {
            me.clientes.push({ text: x.nombre, value: x.idpersona });
          });
        })
        .catch(function(error) {
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
        .then(function(response) {
          usuariosArray = response.data;
          usuariosArray.map(function(x) {
            me.vendedores.push({ text: x.nombre, value: x.idusuario });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

     selectSucursal() {
      let me = this;
      var BodegasArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/Sucursal", configuracion)
        .then(function(response) {
          BodegasArray = response.data;
         console.log("Bodegas",BodegasArray);
          BodegasArray.map(function(x) {
            me.bodegas.push({ text: x.name, value: x.id });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this.id = "";
      this.idcliente = "";
      this.idusuario = "";
      this.tipo_comprobante = "";
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
      this.texto="";
    },
    guardar() {
      if (this.validar()) {
        return;
      }
      //$("button").prop("disabled", false);
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      me.ocultarboton = true;
      axios
        .post(
          "api/Ventas/Crear",
          {
            idcliente: me.idcliente,
            idusuario: me.idusuario,
            //idusuario: me.$store.state.usuario.idusuario,
            idsucursal: me.idbodega,
            tipo_comprobante: me.tipo_comprobante,
            impuesto: me.impuesto,
            total: me.total,
            detalles: me.detalles,
          },
          configuracion
        )
        
        .then(function(response) {

          console.log("Response",response.data);
           swal(
            "Venta realizada",
            "La venta se ha realizado correctamente",
            "success",
            //this.listarDetalles(response.data)
          );

          //alert(response);
          me.ocultarboton = false;
          me.ocultarNuevo();
          me.isLoading = true;
          me.listar();
      
          me.limpiar();
        })
        .catch(function(error) {
          swal(
            "Error al realizar venta",
            "La venta no se ha realizado correctamente",
            "error"
          );
       //   alert(error);

          me.ocultarboton = false;
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      
      
if(this.tipo_comprobante == "CONTADO"){

  if(this.pagar <=0 || this.pagar== undefined){
     this.validaMensaje.push(
      "Ingrese un monto a pagar válido"
    );
  }
    if (parseFloat(parseFloat(this.pagar).toFixed(2)) < parseFloat(parseFloat(this.total).toFixed(2))){
         this.validaMensaje.push(
          "El precio a pagar no puede ser menor al total neto"
        );
  }
}

      if (!this.idcliente) {
        this.validaMensaje.push("Seleccione un cliente.");
      }

      if(this.idcliente ==49 && this.tipo_comprobante=="CREDITO"){
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

      if(this.detalles.cantidad<= 0 ){
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
      console.log("Anular: ",item);
      this.adModal = 1;
      this.adNombre = item.num_comprobante;
      this.adId = item.idventa;
      this.adIdSucursal = item.idsucursal;
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
         me.isLoading = true;
      axios
        .put("api/Ventas/Anular/" + this.adId+'/'+this.adIdSucursal, {}, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
          me.isLoading = false;
        })
        .catch(function(error) {
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
    border-top: 1px solid black;
    border-collapse: collapse;
    
}

td.producto,
th.producto {
    width: 60px;
    text-align: center;
    max-width: 40px;
    font-size: 8px;
    font-family: 'Times New Roman';
    word-break: break-all;
}

td.cantidad,
th.cantidad {
    text-align: center;
    width: 40px;
    max-width: 60px;
    word-break: normal;
    font-size: 8px;  
    font-family: 'Times New Roman';
}

td.precio,
th.precio {
    width: 60px;
    margin-left: 200px;
    max-width: 40px;
    font-size: 8px;
    text-align: center;;
    font-family: 'Times New Roman';
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
  color: #01A101!important;
  opacity: 1;
}

.custom-label-color .v-label {
  color: #01A101;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color input{
  color: #01A101!important;
}

/**Red */

.custom-placeholer-color input::placeholder {
  color: green!important;
  opacity: 1;
}

.custom-label-color2 .v-label {
  color: red;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color2 input{
  color: red!important;
}
.texto{
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
    font-family: Arial,sans-serif;
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

.okas{
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
