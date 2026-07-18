<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white" class="elevation-1">
        <v-btn flat icon color="blue darken-2" @click="volver">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">
          Traslado {{ traslado ? (traslado.numero_traslado || '—') : '' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="!isMobile" icon @click="imprimir()" class="mr-2" color="blue darken-2" flat>
          <v-icon>print</v-icon>
        </v-btn>
        <v-btn v-if="isMobile" color="teal" dark small @click="printBluetoothTicket()" class="mr-2 elevation-1">
          <v-icon left small>bluetooth</v-icon> Imprimir
        </v-btn>
        <v-chip v-if="traslado" :color="estadoColor(traslado.estado)" text-color="white" label>
          <v-icon left small>{{ estadoIcono(traslado.estado) }}</v-icon>
          {{ traslado.estado }}
        </v-chip>
      </v-toolbar>

      <v-container fluid grid-list-lg v-if="traslado" class="pa-3">
        <v-layout row wrap>
          <!-- Info General -->
          <v-flex xs12 md6>
            <v-card class="elevation-2 card-hover">
              <v-card-title class="pb-0">
                <v-icon color="blue darken-2" class="mr-2">info</v-icon>
                <span class="title font-weight-bold">Información General</span>
              </v-card-title>
              <v-divider class="mx-3 mt-2"></v-divider>
              <v-card-text class="pt-3">
                <v-layout row wrap>
                  <v-flex xs6 class="info-row">
                    <span class="caption grey--text">TIPO</span>
                    <div>
                      <v-chip small :color="traslado.rol === 'saliente' ? 'blue' : 'teal'" text-color="white" label>
                        <v-icon left small>{{ traslado.rol === 'saliente' ? 'call_made' : 'call_received' }}</v-icon>
                        {{ traslado.rol === 'saliente' ? 'Saliente' : 'Entrante' }}
                      </v-chip>
                    </div>
                  </v-flex>
                  <v-flex xs6 class="info-row">
                    <span class="caption grey--text">SISTEMA</span>
                    <div class="body-2 font-weight-medium">{{ traslado.sistema_contraparte }}</div>
                  </v-flex>
                  <v-flex xs6 class="info-row">
                    <span class="caption grey--text">SUCURSAL</span>
                    <div class="body-2 font-weight-medium">{{ traslado.sucursal_nombre || '—' }}</div>
                  </v-flex>
                  <v-flex xs6 class="info-row">
                    <span class="caption grey--text">FECHA</span>
                    <div class="body-2 font-weight-medium">{{ traslado.creado_en | moment("DD/MM/YYYY HH:mm") }}</div>
                  </v-flex>
                  <v-flex xs6 class="info-row" v-if="traslado.nombre_usuario">
                    <span class="caption grey--text">REALIZADO POR</span>
                    <div class="body-2 font-weight-medium">{{ traslado.nombre_usuario }}</div>
                  </v-flex>
                  <v-flex xs6 class="info-row" v-if="traslado.cancelado_por">
                    <span class="caption grey--text">CANCELADO POR</span>
                    <div class="body-2 font-weight-medium red--text">{{ traslado.cancelado_por }}</div>
                  </v-flex>
                  <v-flex xs12 class="info-row" v-if="traslado.descripcion">
                    <span class="caption grey--text">DESCRIPCIÓN</span>
                    <div class="body-2">{{ traslado.descripcion }}</div>
                  </v-flex>
                  <v-flex xs12 v-if="traslado.ultimo_error">
                    <v-alert :value="true" type="error" outline class="mt-2 body-2">
                      <strong>Último error:</strong> {{ traslado.ultimo_error }}
                    </v-alert>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <!-- Líneas de detalle -->
          <v-flex xs12 md6>
            <v-card class="elevation-2 card-hover">
              <v-card-title class="pb-0">
                <v-icon color="purple darken-1" class="mr-2">list_alt</v-icon>
                <span class="title font-weight-bold">Líneas del Traslado</span>
                <v-spacer></v-spacer>
                <v-chip small color="grey lighten-2">{{ traslado.detalles ? traslado.detalles.length : 0 }} items</v-chip>
              </v-card-title>
              <v-divider class="mx-3 mt-2"></v-divider>
              <v-data-table :headers="headersDetalles" :items="traslado.detalles || []" hide-actions class="table-styled">
                <template slot="items" slot-scope="props">
                  <td class="font-weight-medium">{{ props.item.nombre_producto }}</td>
                  <td class="text-xs-center">{{ props.item.cantidad }}</td>
                  <td class="text-xs-right">${{ props.item.precio_venta }}</td>
                  <td class="text-xs-center">
                    <v-chip small label :color="estadoLineaColor(props.item.estado_linea)" text-color="white">
                      <v-icon left small>{{ estadoLineaIcono(props.item.estado_linea) }}</v-icon>
                      {{ props.item.estado_linea }}
                    </v-chip>
                  </td>
                </template>
                <template slot="no-data">
                  <div class="text-xs-center pa-3 grey--text">Sin líneas de detalle</div>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>

          <!-- Excepciones -->
          <v-flex xs12 v-if="traslado.excepciones && traslado.excepciones.length > 0">
            <v-card class="elevation-2 card-hover">
              <v-card-title class="pb-0">
                <v-icon color="deep-orange" class="mr-2">warning</v-icon>
                <span class="title font-weight-bold deep-orange--text">Excepciones</span>
                <v-spacer></v-spacer>
                <v-chip small color="deep-orange" text-color="white">{{ traslado.excepciones.length }}</v-chip>
              </v-card-title>
              <v-divider class="mx-3 mt-2"></v-divider>
              <v-data-table :headers="headersExcepciones" :items="traslado.excepciones" hide-actions class="table-styled">
                <template slot="items" slot-scope="props">
                  <td class="font-weight-medium">{{ props.item.nombre_producto }}</td>
                  <td>{{ props.item.motivo }}</td>
                  <td class="text-xs-center">
                    <v-chip small label :color="props.item.estado === 'Pendiente' ? 'orange' : 'green'" text-color="white">
                      {{ props.item.estado }}
                    </v-chip>
                  </td>
                  <td>{{ props.item.creado_en | moment("DD/MM/YYYY HH:mm") }}</td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>

          <!-- Logs -->
          <v-flex xs12 v-if="traslado.logs && traslado.logs.length > 0">
            <v-card class="elevation-2 card-hover">
              <v-card-title class="pb-0">
                <v-icon color="blue-grey" class="mr-2">history</v-icon>
                <span class="title font-weight-bold">Historial de Eventos</span>
                <v-spacer></v-spacer>
                <v-chip small color="blue-grey lighten-4">{{ traslado.logs.length }} registros</v-chip>
              </v-card-title>
              <v-divider class="mx-3 mt-2"></v-divider>
              <v-data-table :headers="headersLogs" :items="traslado.logs" hide-actions class="table-styled">
                <template slot="items" slot-scope="props">
                  <td class="grey--text text--darken-1">
                    <v-icon small class="mr-1">access_time</v-icon>
                    {{ props.item.creado_en | moment("DD/MM/YYYY HH:mm:ss") }}
                  </td>
                  <td>
                    <v-chip small label color="blue-grey lighten-4" text-color="blue-grey darken-2">{{ props.item.evento }}</v-chip>
                  </td>
                  <td class="body-1">{{ props.item.detalle }}</td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Loading -->
      <div v-else class="text-xs-center pa-5">
        <v-progress-circular indeterminate color="primary" :size="60" :width="5"></v-progress-circular>
        <div class="mt-3 grey--text">Cargando detalle del traslado...</div>
      </div>

      <!-- VIEW DE DESKTOP (impresión real por window.print) -->
      <div id="ticket" v-show="false" v-if="traslado">
        <div class="ticket-container">
          <div class="ticket-header">
            <img src="@/assets/logo.png" alt="Gema Moda" class="ticket-logo" />
            <h2 class="empresa-nombre">GEMA MODA</h2>
            <div class="ticket-title">TRASLADO ENTRE EMPRESAS</div>
            <div class="ticket-divider"></div>
          </div>

          <div class="ticket-info">
            <div class="info-row">
              <span class="info-label">NO. TRASLADO:</span>
              <span class="info-value bold">{{ traslado.numero_traslado || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">FECHA:</span>
              <span class="info-value">{{ traslado.creado_en | moment("DD/MM/YYYY hh:mm A") }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">TIPO:</span>
              <span class="info-value">{{ traslado.rol === 'saliente' ? 'SALIENTE (Gema a Zona)' : 'ENTRANTE (Zona a Gema)' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">SUCURSAL:</span>
              <span class="info-value">{{ traslado.sucursal_nombre || '' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ESTADO:</span>
              <span class="info-value bold">{{ (traslado.estado || '').toUpperCase() }}</span>
            </div>
            <div class="info-row" v-if="traslado.nombre_usuario">
              <span class="info-label">REALIZADO POR:</span>
              <span class="info-value">{{ traslado.nombre_usuario }}</span>
            </div>
            <div class="info-row" v-if="traslado.cancelado_por">
              <span class="info-label">CANCELADO POR:</span>
              <span class="info-value bold">{{ traslado.cancelado_por }}</span>
            </div>
          </div>

          <div class="ticket-divider"></div>

          <table class="ticket-table">
            <thead>
              <tr>
                <th class="col-cant">Cant</th>
                <th class="col-prod">Producto</th>
                <th class="col-precio">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="det in traslado.detalles" :key="det.nombre_producto + det.cantidad">
                <td class="col-cant">{{ det.cantidad }}</td>
                <td class="col-prod">{{ det.nombre_producto }}</td>
                <td class="col-precio">
                  C$ {{ parseFloat(det.precio_venta || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="ticket-divider"></div>
          
          <div class="ticket-totals">
            <div class="info-row">
              <span class="info-label bold">TOTAL UNIDADES:</span>
              <span class="info-value bold">
                {{ traslado.detalles ? traslado.detalles.reduce((sum, det) => sum + parseInt(det.cantidad || 0), 0) : 0 }}
              </span>
            </div>
          </div>

          <div class="ticket-divider"></div>
          
          <div class="ticket-footer">
            <div class="footer-user">
              Atendido por: {{ $store.state.usuario ? $store.state.usuario.nombre : '' }}
            </div>
            <div class="footer-thanks">¡COMPROBANTE DE TRASLADO!</div>
            <div class="footer-note">Conserve este documento.</div>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'
import printerService from '@/services/BluetoothPrinterService'

export default {
  data() {
    return {
      isMobile: false,
      traslado: null,
      headersDetalles: [
        { text: 'Producto', value: 'nombre_producto', sortable: false },
        { text: 'Cantidad', value: 'cantidad', sortable: false, align: 'center' },
        { text: 'Precio', value: 'precio_venta', sortable: false, align: 'right' },
        { text: 'Estado', value: 'estado_linea', sortable: false, align: 'center' },
      ],
      headersExcepciones: [
        { text: 'Producto', value: 'nombre_producto', sortable: false },
        { text: 'Motivo', value: 'motivo', sortable: false },
        { text: 'Estado', value: 'estado', sortable: false, align: 'center' },
        { text: 'Fecha', value: 'creado_en', sortable: false },
      ],
      headersLogs: [
        { text: 'Fecha', value: 'creado_en', sortable: false },
        { text: 'Evento', value: 'evento', sortable: false },
        { text: 'Detalle', value: 'detalle', sortable: false },
      ],
    }
  },
  created() {
    this.cargarDetalle()
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768; 
    this.isMobile = isMobileDevice || isSmallScreen;
  },
  methods: {
    getConfig() {
      return { headers: { Authorization: 'Bearer ' + this.$store.state.token } }
    },
    cargarDetalle() {
      var me = this
      var id = me.$route.params.id
      axios.get('api/TrasladosEmpresa/Detalle/' + id, me.getConfig())
        .then(function (r) { me.traslado = r.data })
        .catch(function (err) {
          var msg = (err.response && err.response.data) || 'Error al cargar detalle'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    },
    volver() { this.$router.back() },
    imprimir() {
      var divToPrint = document.getElementById("ticket");
      var newWin = window.open("", "Print-Window");
      
      var styles = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          body {
            font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #000;
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .ticket-container {
            width: 80mm; /* Ancho exacto de ticketera térmica */
            max-width: 100%;
            margin: 0 auto;
            padding: 5mm;
            box-sizing: border-box;
          }
          .ticket-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .ticket-logo {
            max-width: 140px;
            margin-bottom: 5px;
            filter: grayscale(100%);
          }
          .empresa-nombre {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 5px 0;
            letter-spacing: 1px;
          }
          .ticket-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .ticket-divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .ticket-info {
            font-size: 14px;
            line-height: 1.4;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
          }
          .info-label {
            font-weight: 500;
          }
          .info-value {
            text-align: right;
          }
          .bold {
            font-weight: 700;
          }
          .ticket-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 5px;
          }
          .ticket-table th {
            border-bottom: 1px dashed #000;
            padding: 4px 0;
            font-weight: 700;
            text-transform: uppercase;
          }
          .ticket-table td {
            padding: 6px 0;
            vertical-align: top;
          }
          .col-cant { width: 15%; text-align: center; }
          .col-prod { width: 55%; text-align: left; padding-right: 5px !important; }
          .col-precio { width: 30%; text-align: right; }
          .ticket-totals {
            font-size: 15px;
            margin: 10px 0;
          }
          .ticket-footer {
            text-align: center;
            margin-top: 15px;
          }
          .footer-user {
            font-size: 13px;
            margin-bottom: 8px;
          }
          .footer-thanks {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .footer-note {
            font-size: 12px;
          }
        </style>
      `;

      newWin.document.open();
      newWin.document.write(
        '<html><head><title>Impresión de Traslado</title>' + styles + '</head><body>' +
          divToPrint.innerHTML +
          "</body></html>"
      );
      newWin.document.close();
      setTimeout(function () {
        newWin.print();
        newWin.close();
      }, 1000);
    },
    async printBluetoothTicket() {
      if (!this.traslado) return;
      try {
        swal({
          title: "Imprimiendo...",
          text: "Enviando datos a la impresora Bluetooth, por favor espere.",
          icon: "info",
          buttons: false,
          closeOnClickOutside: false,
          closeOnEsc: false,
        });

        const printData = {
          numeroTraslado: this.traslado.numero_traslado,
          fecha: this.traslado.creado_en,
          rol: this.traslado.rol,
          sucursalNombre: this.traslado.sucursal_nombre,
          estado: this.traslado.estado,
          usuario: this.$store.state.usuario ? this.$store.state.usuario.nombre : '',
          nombreUsuario: this.traslado.nombre_usuario || '',
          canceladoPor: this.traslado.cancelado_por || '',
          detalles: this.traslado.detalles
        };

        await printerService.printTraslado(printData);
        swal("Impresión exitosa", "El ticket se imprimió correctamente.", "success");
      } catch (error) {
        console.error("Error al imprimir ticket Bluetooth:", error);
        swal("Error de impresión", error.message || "No se pudo imprimir el ticket.", "error");
      }
    },
    estadoColor(estado) {
      var c = { Completado: 'green', EnProceso: 'blue', Error: 'orange', Excepcion: 'deep-orange', Cancelado: 'grey' }
      return c[estado] || 'grey'
    },
    estadoIcono(estado) {
      var i = { Completado: 'check_circle', EnProceso: 'autorenew', Error: 'error_outline', Excepcion: 'warning', Cancelado: 'cancel' }
      return i[estado] || 'help'
    },
    estadoLineaColor(estado) {
      var c = { Ok: 'green', Pendiente: 'blue', Error: 'red' }
      return c[estado] || 'grey'
    },
    estadoLineaIcono(estado) {
      var i = { Ok: 'check', Pendiente: 'hourglass_empty', Error: 'close' }
      return i[estado] || 'help'
    }
  }
}
</script>
<style scoped>
.info-row { margin-bottom: 12px; }
.card-hover { transition: box-shadow 0.3s ease; border-radius: 8px !important; }
.card-hover:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; }
.table-styled { border-radius: 0 0 8px 8px; }
</style>
