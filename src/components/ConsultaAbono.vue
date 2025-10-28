<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-btn @click="crearPdfVentas">
          <v-icon>print</v-icon>
        </v-btn>
        <export-excel
          :data="abonos"
          name="Abonos.xls"
          :beforeExport="startDownload"
          :afterExport="finishDownload"
          :fields="json_fields"
          worksheet="Abonos"
          :title="fecha2"
          type="xls"
        >
          <v-btn color="green">
            <v-icon color="white">print</v-icon>
          </v-btn>
        </export-excel>
        <v-toolbar-title>Consulta Abonos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        Desde:&nbsp;
        <v-text-field
          type="date"
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="fechaInicio"
        ></v-text-field>
        Hasta:&nbsp;
        <v-text-field
          type="date"
          v-if="verNuevo == 0"
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

        <v-dialog v-model="comprobanteModal" max-width="1000px">
          <v-card>
            <v-card-text>
              <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
              <div id="factura">
                <header>
                  <div id="logo">
                    <img id="imagen" src="@/assets/logo.png" alt="Gema Moda" />
                  </div>
                  <div id="datos">
                    <p id="encabezado">
                      <b>GEMA MODA</b><br />Ofrecemos ropa para damas,
                      caballeros y niños a la mejor calidad, con los mejores
                      precios del mercado, al por mayor y detalle
                      <br />Telefono:7714-2193 / 8967-2690<br />Direccion: Del
                      banpro de ciudad Jardín 3c. al lago, 2c. abajo
                    </p>
                  </div>
                  <div id="fact">
                    <h2 id="nombreFactura">Factura</h2>
                    <p id="datosFactura">
                      NO. {{ num_factura }}<br />
                      {{ tipo_comprobante }} <br />
                      {{ fecha_hora | moment("DD/MM/YYYY") }}
                    </p>
                  </div>
                </header>
                <br />
                <section>
                  <div>
                    <table id="facliente">
                      <tbody>
                        <tr>
                          <td id="cliente">
                            <strong>Sr(a). {{ cliente }}</strong
                            ><br />
                            <strong>Documento:</strong> {{ num_documento
                            }}<br />
                            <strong>Dirección:</strong> {{ direccion }}<br />
                            <strong>Teléfono:</strong> {{ telefono }}<br />
                            <strong>Email:</strong> {{ email }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <br />
                <section>
                  <div>
                    <table id="facarticulo">
                      <thead>
                        <tr id="fa">
                          <th>CANT</th>
                          <th>DESCRIPCION</th>
                          <th>PRECIO UNIT</th>
                          <th>DESC.</th>
                          <th>PRECIO TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="det in detalles" :key="det.iddetalle_venta">
                          <td style="text-align: center">{{ det.cantidad }}</td>
                          <td id="detalles">{{ det.articulo }}</td>
                          <td id="detalles">{{ det.precio | currency }}</td>
                          <td id="detalles">{{ det.descuento | currency }}</td>
                          <td id="detalles">
                            {{
                              (
                                det.cantidad * det.precio -
                                det.descuento
                              ).toFixed(2) | currency
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
                          <th style="text-align: right">SUBTOTAL</th>
                          <th style="text-align: right">
                            {{
                              (totalParcial = calcularTotal.toFixed(2))
                                | currency
                            }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">Envio</th>
                          <th style="text-align: right">
                            {{ (totalImpuesto = impuesto) | currency }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">TOTAL</th>
                          <th style="text-align: right">
                            {{
                              (total =
                                parseFloat(totalImpuesto) +
                                parseFloat(totalParcial)).toFixed(2) | currency
                            }}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <footer>
                  <div id="gracias">
                    <p><b>Gracias por su compra!</b></p>
                  </div>
                </footer>
              </div>
              <v-btn @click="ocultarComprobante()" color="blue darken-1" flat
                >Cancelar</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="abonos"
        class="elevation-1"
        v-if="verNuevo == 0"
      >
        <template slot="items" slot-scope="props">
          
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.nombreCliente }}</td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.fecha | moment("DD/MM/YYYY") }}</td>
          <td>{{ props.item.montoAbono }}</td>
          <td>{{ props.item.deudaInicial }}</td>
          <td>{{ props.item.montoAbonado }}</td>
          <td>{{ props.item.pendiente }}</td>
          <td>
            <div v-if="props.item.idEstado == 0">
              <span class="blue--text">Realizado</span>
            </div>
            <div v-if="props.item.idEstado == 2">
              <span class="red--text">Anulado</span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo Factura"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select v-model="idusuario" :items="vendedores" label="Vendedor">
            </v-select>
          </v-flex>

          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-select v-model="idcliente" :items="clientes" label="Cliente">
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="impuesto" label="Impuesto">
            </v-text-field>
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
                <td>{{ props.item.articulo }}</td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="props.item.cantidad"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
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
              <strong>Total Parcial: </strong>$
              {{ (totalParcial = (total - totalImpuesto).toFixed(2)) }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total Impuesto: </strong>$
              {{
                (totalImpuesto = (
                  (total * impuesto) /
                  (100 + impuesto)
                ).toFixed(2))
              }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total Neto: </strong>$
              {{ (total = calcularTotal.toFixed(2)) }}
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
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn @click="ocultarNuevo()" color="blue darken-1" flat
              >Cancelar</v-btn
            >
            <v-btn v-if="verDet == 0" @click="guardar()" color="success"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import html2canvas from "html2canvas";
export default {
  data() {
    
    //f1 = "si";
    return {
      /* let me = this; */
    //  fechaInicio: new Date(),
      abonos: [],
     // fechaInicio ="80",
      fecha2: "",
      json_fields: {
        "Número de Abono": "codigo",
        "Nombre de cliente": "nombreCliente",
        "Vendedor": "usuario",
        "Fecha Abono": "fecha" ,
        "Saldo Inicial": "deudaInicial",
        "Total Saldo Abonado": "montoAbonado",
        "Saldo Pendiente": "deudaPendiente",
        "Monto del abono Actual": "montoAbono",
      },
      dialog: false,
      headers: [
        //{ text: "Acciones", value: "opciones", sortable: false },
        { text: "No. Abono", value: "codigo", sortable: true },
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

      cabeceraDetalles: [
        { text: "Artículo", value: "articulo", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Precio", value: "precio", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "Subtotal", value: "subtotal", sortable: false },
      ],
      detalles: [],
      search: "",
      //fechas= 'Fecha inicial'+ me.fechaInicio + "Al " + me.fechaFin,

      id: "",
      idcliente: "",
      clientes: [],
      vendedores: [],
      impuesto: 0,
      tipo_comprobante: "",
      comprobantes: ["CONTADO", "CREDITO"],
      num_factura: 0,
      codigo: "",
      verNuevo: 0,
      errorArticulo: null,
      totalParcial: 0,
      totalImpuesto: 0,
      total: 0,
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
      comprobanteModal: 0,
      cliente: "",
      fecha: "",
      usuario: "",
      direccion: "",
      telefono: "",
      email: "",
      fechaInicio: "",
      fechaFin: "",
    };
  },
  computed: {
    calcularTotal: function () {
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
    this.listar();
    this.select();
    this.selectUsuario();
  },
  methods: {
 startDownload(){
          console.log('show loading');
          alert('show loading');
      },
      finishDownload(){
          alert('hide loading');
      },

   /* startDownload() {
      /* let me = this;
      if (!me.fechaInicio || !me.fechaFin) {
        me.fechas = "Wtf";
      } 
console.log("Funciona");
      alert("Siii");

      //me.fechas = me.fechaInicio;
    }, */

    redirigir() {
      // this.$router.push({ name: "login" });
      this.$store.dispatch("salir");
    },
    crearPdfVentas() {
      var columns = [
        { title: "No. Abono", dataKey: "codigo" },
        { title: "Vendedor", dataKey: "usuario" },
        { title: "Cliente", dataKey: "nombreCliente" },
        { title: "Fecha", dataKey: "fecha" },
        { title: "Total", dataKey: "montoAbono" },
        // { title: "Estado", dataKey: "idEstado" },
      ];

      var rows = [];
      var suma = 0;
      var subtotal = 0;
      console.log(rows.length);

      this.abonos.map(function (x) {
        var d = Date(x.fecha_hora);
        var dateString = d.format;
        rows.push({
          codigo: x.codigo,
          usuario: x.usuario,
          nombreCliente: x.nombreCliente,
          fecha: x.fecha,
          montoAbono: x.montoAbono,
          // idEstado: x.idEstado,
        });
      });

      this.abonos.forEach((element) => {
        if (element.estado != 2) subtotal += element.montoAbono;
      });

      // Only pt supported (not mm or in)
      var doc = new jsPDF("p", "pt");
      doc.autoTable(columns, rows, {
        styles: { fillcolor: [100, 255, 255] },
        columnsStyles: {
          id: { fillcolor: 255 },
        },
        margin: { top: 80 },
        addPageContent: function (data) {
          doc.text("Listado de Abonos: ", 250, 30);
          doc.text(
            "Total de todas los abonos: " + subtotal.toFixed(2),
            200,
            50
          );
        },
      });
      doc.save("Listado de Abonos.pdf");
    },
    crearPDF() {
      var quotes = document.getElementById("factura");
      html2canvas(quotes).then(function (canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF();
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        doc.save("Facturaventa.pdf");
      });
    },
    mostrarComprobante(item) {
      this.limpiar();
      this.num_factura = item.idventa;
      this.tipo_comprobante = item.tipo_comprobante;
      this.cliente = item.cliente;
      this.num_documento = item.num_documento;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.fecha_hora = item.fecha_hora;
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
    agregarDetalle(data = []) {
      this.errorArticulo = null;
      if (this.encuentra(data["idarticulo"])) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.detalles.push({
          idarticulo: data["idarticulo"],
          articulo: data["nombre"],
          cantidad: 1,
          precio: data["precio_venta"],
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
    listar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let url = "";
      if (!me.fechaInicio || !me.fechaFin) {
         me.fecha2 ="Reporte de Abonos totales ";
        url = "api/Creditos/ObtenerAbonosActivo";
      } else {
         me.fecha2 ="Reporte de Abonos "+me.fechaInicio+"  Al  "
       +"   "+me.fechaFin;
        url =
          "api/Creditos/ConsultaFechasAbonos/" +
          me.fechaInicio +
          "/" +
          me.fechaFin;
      }
      axios
        .get(url, configuracion)
        .then(function (response) {
          //console.log(response);
          me.abonos = response.data;
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
    listarDetalles(id) {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Ventas/ListarDetalles/" + id, configuracion)
        .then(function (response) {
          //console.log(response);
          me.detalles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verDetalles(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.idcliente = item.idcliente;
      this.idusuario = item.idusuario;
      this.impuesto = item.impuesto;
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
        .then(function (response) {
          clientesArray = response.data;
          clientesArray.map(function (x) {
            me.clientes.push({ text: x.nombre, value: x.idpersona });
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
      this.tipo_comprobante = "";
      this.impuesto = "0";
      this.codigo = "";
      this.detalles = [];
      this.total = 0;
      this.totalImpuesto = 0;
      this.totalParcial = 0;
      this.verDet = 0;
    },
  },
};
</script>
<style>
#factura {
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
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
}

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
  text-align: left;
}

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

#gracias {
  text-align: center;
}
</style>
