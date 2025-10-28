<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Artículos</v-toolbar-title>
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
        <v-flex xs4 sm4 md4>
          <v-select
            v-model="categoria"
            :items="categorys"
            label="Categoría"
            autocomplete="on"
            v-on:change="listar"
          >
          </v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn
            v-if="esAdministrador"
            slot="activator"
            color="primary"
            dark
            class="mb-2"
            >Nuevo</v-btn
          >
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="codigo" label="Código">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-select
                      v-model="idcategoria"
                      :items="categorias"
                      label="Categoría"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs6 sm6 md6>
                    <v-text-field type="number" v-model="stock" label="Stock">
                    </v-text-field>
                  </v-flex> -->
                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      type="number"
                      v-model="precio_compra"
                      label="Precio Compra"
                      class="no-spinners"
                      @keydown.up.prevent="prevenirAumento"
                      @keydown.down.prevent="prevenirAumento"
                      @mousewheel="prevenirAumento"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      type="number"
                      v-model="precio_venta"
                      label="Precio Venta"
                      class="no-spinners"
                      @keydown.up.prevent="prevenirAumento"
                      @keydown.down.prevent="prevenirAumento"
                      @mousewheel="prevenirAumento"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="descripcion"
                      label="Descripción"
                    ></v-text-field>
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
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1"
              >¿Activar Item?</v-card-title
            >
            <v-card-title class="headline" v-if="adAccion == 2"
              >¿Borrar Item?</v-card-title
            >
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion == 1">Activar </span>
              <span v-if="adAccion == 2">Borrar </span>
              el producto {{ adNombre }}
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
                Borrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="filteredHeaders"
        :items="articulos"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon
              v-if="esAdministrador2"
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <template v-if="props.item.condicion && esAdministrador2">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                block
              </v-icon>
            </template>
            <template v-if="!props.item.condicion && esAdministrador2">
              <v-icon small @click="activarDesactivarMostrar(1, props.item)">
                check
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.categoria }}</td>
          <!--  <td>{{ props.item.stocks }}</td> -->
          <td>
            <v-icon
              small
              class="mr-2"
              color="primary"
              @click="mostrarStock(props.item)"
            >
              inventory
            </v-icon>
          </td>
          <td v-if="esAdministrador">
            <v-icon
              small
              class="mr-2"
              color="primary"
              @click="showInvoiceByArticle(props.item)"
            >
              receipt
            </v-icon>
          </td>
          <td>{{ props.item.precio_compra | currency }}</td>
          <td>{{ props.item.precio_venta | currency }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td v-if="esAdministrador">
            {{ props.item.fecha_hora | moment("DD/MM/YYYY") }}
          </td>
          <td>
            <div v-if="props.item.condicion">
              <span class="blue--text">Activo</span>
            </div>
            <div v-else>
              <span class="red--text">Inactivo</span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>

    <v-dialog v-model="dialogStock" max-width="500px">
      <v-spacer slot="activator"> </v-spacer>
      <v-card>
        <v-card-title>
          <span class="headline">Cantidad de articulo por sucursal </span>
        </v-card-title>

        <v-data-table :headers="tbStock" :items="_stock" class="elevation-1">
          <template slot="items" slot-scope="props">
            <!-- <td>{{ props.item.id_Credito }}</td> -->
            <td>{{ props.item.sucursal }}</td>
            <td>{{ props.item.stock }}</td>
          </template>
          <!-- <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template> -->
        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeStock"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ver Detalle de factura -->
    <v-dialog v-model="dialogInvoice" max-width="1200px">
      <v-spacer slot="activator"> </v-spacer>
      <v-card>
        <v-card-title>
          <span class="headline">Cantidad de articulo por factura </span>
        </v-card-title>

        <v-data-table
          :headers="tbInvoices"
          :items="invoices"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.usuarioNombre }}</td>
            <td>{{ props.item.articuloCodigo }}</td>
            <td>{{ props.item.ventaCodigoFactura }}</td>
            <td>
              {{ props.item.fechaHora | moment("DD/MM/YYYY") }} |
              {{ props.item.fechaHora | moment("LT") }}
            </td>
            <td>{{ props.item.sucursalNombre }}</td>
            <td>{{ props.item.detalleVentaCantidad }}</td>
            <td>{{ props.item.subtotal }}</td>
            <td>{{ props.item.detalleVentaDescuento }}</td>
            <td>{{ props.item.total }}</td>
          </template>
        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeInvoice"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  fin ver facturas -->
  </v-layout>
</template>
<style>
.no-spinners input::-webkit-outer-spin-button,
.no-spinners input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinners input[type="number"] {
  -moz-appearance: textfield;
}
</style>
<script>
import axios from "axios";
import swal from "sweetalert";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
export default {
  data() {
    return {
      articulos: [],
      _stock: [],
      invoices: [],
      dialogStock: false,
      dialogInvoice: false,
      /*rows: {
        codigo:"",
        nombre:"",
        categoria:"",
        stock:"",
        precio_compra:"",
        precio_venta:"",
        utilidad:"",
      },*/
      dialog: false,
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre" },
        { text: "Categoría", value: "categoria" },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Factura", value: "invoice", sortable: false },
        { text: "Precio Compra", value: "precio_compra", sortable: false },
        { text: "Precio Venta", value: "precio_venta", sortable: false },
        { text: "Descripción", value: "descripcion", sortable: false },
        { text: "Fecha", value: "fecha_hora", sortable: false },
        { text: "Estado", value: "condicion", sortable: false },
      ],

      tbStock: [
        { text: "Sucursal", value: "sucursal" },
        { text: "cantidad", value: "stock" },
      ],
      tbInvoices: [
        { text: "Usuario", value: "usuarioNombre", sortable: false },
        { text: "Articulo", value: "articuloNombre", sortable: false },
        { text: "Codigo Articulo", value: "articuloCodigo", sortable: false },
        { text: "No. Factura", value: "ventaCodigoFactura", sortable: false },
        { text: "Fecha", value: "fechaHora", sortable: false },
        { text: "Sucursal", value: "sucursalNombre", sortable: false },
        { text: "Cantidad", value: "detalleVentaCantidad", sortable: false },
        { text: "SubTotal", value: "subtotal", sortable: false },
        { text: "Descuento", value: "detalleVentaDescuento", sortable: false },
        { text: "Total", value: "Total", sortable: false },
      ],
      categoria: 0,
      search: "",
      editedIndex: -1,
      id: "",
      idcategoria: "",
      categorias: [],
      categorys: [],
      codigo: "",
      nombre: "",
      stock: 0,
      precio_venta: 0,
      precio_compra: 0,
      descripcion: "",
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
      return this.editedIndex === -1 ? "Nuevo artículo" : "Actualizar artículo";
    },
    filteredHeaders() {
      return this.esAdministrador
        ? this.headers
        : this.headers.filter(
            (header) =>
              header.value !== "fecha_hora" && header.value != "invoice"
          );
    },
    esAdministrador() {
      console.log(this.$store.state.usuario.idusuario);
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Administrador"
      );
    },
    esAdministrador2() {
      console.log(this.$store.state.usuario.idusuario);
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Administrador" &&
        this.$store.state.usuario.idusuario != 1028
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogStock(val) {
      val || this.close();
    },
    dialogInvoice(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.select();
    this.selectCategory();
  },
  methods: {
    prevenirAumento(event) {
      // Evitar el aumento al presionar la flecha hacia arriba
      console.log("************ ", event);
      event.preventDefault();
    },
    mostrarStock(item) {
      console.log("item ", item.idarticulo);

      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "api/Articulos/ListarStockPorArticulo/" + item.idarticulo,
          configuracion
        )
        .then(function (response) {
          console.log(response.data);
          me._stock = response.data;
          console.log("Stock: ", me._stock);
          me.dialogStock = true;
        })
        .catch(function (error) {
          // console.log(error);
          if (error.response.status == "401") {
            //alert("Nice");
            swal(
              "Sesión caducada",
              "Su sesión ha expirado favor volver a iniciar sesión",
              "warning"
            );
          }
        });
    },
    showInvoiceByArticle(item) {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "api/Articulos/ListarArticulosFacturados/" + item.idarticulo,
          configuracion
        )
        .then(function (response) {
          console.log(response.data);
          me.invoices = response.data;
          console.log("invoices: ", me.invoices);
          me.dialogInvoice = true;
        })
        .catch(function (error) {
          // console.log(error);
          if (error.response.status == "401") {
            //alert("Nice");
            swal(
              "Sesión caducada",
              "Su sesión ha expirado favor volver a iniciar sesión",
              "warning"
            );
          }
        });
    },

    closeStock() {
      this.dialogStock = false;
      this.limpiar();
    },
    closeInvoice() {
      this.dialogInvoice = false;
      this.limpiar();
    },

    crearExcel() {
      var rows = [];

      this.articulos.map(function (x) {
        rows.push({
          nombre: x.nombre,
          codigo: x.codigo,
          categoria: x.categoria,
          stock: x.stock,
          precio_compra: x.precio_compra,
          precio_venta: x.precio_venta,
          utilidad: (x.precio_venta - x.precio_compra) * x.stock,
          costo: x.precio_compra * x.stock,
        });
      });
    },
    crearPdf() {
      var columns = [
        { title: "Nombre", dataKey: "nombre" },
        { title: "Código", dataKey: "codigo" },
        { title: "Categoría", dataKey: "categoria" },
        { title: "Stock", dataKey: "stock" },
        { title: "Precio Compra", dataKey: "precio_compra" },
        { title: "Precio Venta", dataKey: "precio_venta" },
        { title: "Costo venta", dataKey: "costo" },
        { title: "Utilidad", dataKey: "utilidad" },
      ];

      var rows = [];
      var suma = 0;
      var costoventa = 0;
      console.log(rows.length);

      this.articulos.map(function (x) {
        rows.push({
          nombre: x.nombre,
          codigo: x.codigo,
          categoria: x.categoria,
          stock: x.stock,
          precio_compra: x.precio_compra,
          precio_venta: x.precio_venta,
          utilidad: (x.precio_venta - x.precio_compra) * x.stock,
          costo: x.precio_compra * x.stock,
        });
      });

      this.articulos.forEach((element) => {
        suma += (element.precio_venta - element.precio_compra) * element.stock;
        costoventa += element.precio_compra * element.stock;
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
          doc.text("Listado de Artículos", 250, 30);
          doc.text(
            "Total de utilidad de articulos: " + suma.toFixed(2),
            170,
            50
          );
          doc.text(
            "Total de costo de venta de los articulos: " +
              costoventa.toFixed(2),
            110,
            70
          );
        },
      });
      doc.save("Listado de inventario.pdf");
    },

    listar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/Listar/" + me.categoria, configuracion)
        .then(function (response) {
          //console.log(response);
          me.articulos = response.data;

          //console.log(me.articulos);
          me.articulos.map(function (x) {
            rows.push({
              nombre: x.nombre,
              codigo: x.codigo,
              categoria: x.categoria,
              stock: x.stock,
              precio_compra: x.precio_compra,
              precio_venta: x.precio_venta,
              utilidad: (x.precio_venta - x.precio_compra) * x.stock,
              costo: x.precio_compra * x.stock,
            });
          });
        })
        .catch(function (error) {
          // console.log(error);
          console.log("Probando" + error.response.status);
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
    redirigir() {
      // this.$router.push({ name: "login" });
      this.$store.dispatch("salir");
    },
    select() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      var categoriasArray = [];
      axios
        .get("api/Categorias/Select", configuracion)
        .then(function (response) {
          categoriasArray = response.data;
          categoriasArray.map(function (x) {
            me.categorias.push({ text: x.nombre, value: x.idcategoria });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectCategory() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      var categoriasArray = [];
      axios
        .get("api/Categorias/Select", configuracion)
        .then(function (response) {
          categoriasArray = response.data;
          categoriasArray.unshift({ idcategoria: 0, nombre: "Todas" });
          categoriasArray.map(function (x) {
            me.categorys.push({ text: x.nombre, value: x.idcategoria });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editItem(item) {
      this.id = item.idarticulo;
      this.idcategoria = item.idcategoria;
      this.codigo = item.codigo;
      this.nombre = item.nombre;
      this.stock = item.stock;
      this.precio_venta = item.precio_venta;
      this.precio_compra = item.precio_compra;
      this.descripcion = item.descripcion;
      this.editedIndex = 1;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.limpiar();
    },
    limpiar() {
      this.id = "";
      this.idcategoria = "";
      this.codigo = "";
      this.nombre = "";
      this.validaMensaje = [];
      this.stock = "";
      this.precio_venta = "";
      this.precio_compra = "";
      this.descripcion = "";
      this.editedIndex = -1;
    },
    guardar() {
      if (this.validar()) {
        return;
      }
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      if (this.editedIndex > -1) {
        //Código para editar
        //Código para guardar
        let me = this;
        axios
          .put(
            "api/Articulos/Actualizar",
            {
              idarticulo: me.id,
              idcategoria: me.idcategoria,
              codigo: me.codigo,
              nombre: me.nombre,
              // stock: me.stock,
              precio_venta: me.precio_venta,
              precio_compra: me.precio_compra,
              descripcion: me.descripcion,
            },
            configuracion
          )
          .then(function (response) {
            swal(
              "Articulo Editado",
              "El artículo se ha editado correctamente",
              "success"
            );
            me.close();
            me.listar();
            me.limpiar();
          })
          .catch(function (error) {
            console.log(error);

            swal("Error", error.response.data, "error");
          });
      } else {
        //Código para guardar
        let me = this;
        axios
          .post(
            "api/Articulos/Crear",
            {
              idcategoria: me.idcategoria,
              codigo: me.codigo,
              nombre: me.nombre,
              // stock: me.stock,
              precio_venta: me.precio_venta,
              precio_compra: me.precio_compra,
              descripcion: me.descripcion,
            },
            configuracion
          )
          .then(function (response) {
            swal(
              "Articulo creado",
              "El artículo se ha creado correctamente",
              "success"
            );
            me.close();
            me.listar();
            me.limpiar();
            /* this.$router.push({ name: "usuarios" });
            console.log("Entonces" + this.$router); */
          })
          .catch(function (error) {
            console.log(error.response.data);
            //enviarInicio(error);

            swal("Error", error.response.data, "error");

            // console.log("Probando" + error.status);
            //swal("Error al crear", "El artículo no se ha creado", "error");
          });
      }
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.nombre.length < 3 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre debe tener más de 3 caracteres y menos de 50 caracteres."
        );
      }
      if (!this.idcategoria) {
        this.validaMensaje.push("Seleccione una categoría.");
      }
      /*if (!this.stock || this.stock < 0) {
        this.validaMensaje.push("Ingrese el stock inicial del artículo.");
      }*/
      if (this.stock < 0) {
        this.validaMensaje.push("El stock inicial no puede estar en 0.");
      }
      if (!this.precio_venta || this.precio_venta <= 0) {
        this.validaMensaje.push(
          "Ingrese un precio de venta válido para el artículo."
        );
      }
      if (!this.precio_compra || this.precio_compra <= 0) {
        this.validaMensaje.push(
          "Ingrese un precio de compra válido para el artículo."
        );
      }
      if (this.descripcion.trim().length <= 0) {
        this.validaMensaje.push("La descripcion es un campo requerido.");
      }

      if (
        parseFloat(parseFloat(this.precio_compra).toFixed(2)) >
        parseFloat(parseFloat(this.precio_venta).toFixed(2))
      ) {
        this.validaMensaje.push(
          "El precio de compra no puede ser mayor que el de venta verifique los datos."
        );
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item.idarticulo;
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
    activar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("api/Articulos/Activar/" + this.adId, {}, configuracion)
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
    desactivar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("api/Articulos/Desactivar/" + this.adId, {}, configuracion)
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
