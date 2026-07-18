<template>
  <v-layout align-start>
    <v-flex>
      <!-- Controles Superiores -->
      <v-card flat class="elevation-1 mb-3" v-if="!verNuevo">
        <v-card-title class="pa-3">
          <v-layout row wrap align-center style="width: 100%;">
            <!-- Título -->
            <v-flex xs12 md4 class="mb-2 mb-md-0">
              <h2 class="title font-weight-bold mb-0" style="display: flex; align-items: center;">
                <v-icon color="blue darken-2" class="mr-2">swap_horiz</v-icon>
                Traslados entre Empresas
              </h2>
            </v-flex>
            
            <!-- Buscador -->
            <v-flex xs12 md4 class="px-md-2 mb-3 mb-md-0">
              <v-text-field
                v-model="searchNumero"
                append-icon="search"
                label="Buscar por N° traslado..."
                single-line
                hide-details
                outline
                dense
                clearable
                @keyup.enter="buscar"
                @click:append="buscar"
              ></v-text-field>
            </v-flex>

            <!-- Botones -->
            <v-flex xs12 md4 class="text-xs-right layout justify-end wrap">
              <v-btn color="deep-orange darken-1" dark class="elevation-1 ma-1" @click="irExcepciones">
                <v-icon left small>warning</v-icon> <span class="hidden-xs-only">Excepciones</span>
              </v-btn>
              <v-btn color="blue darken-2" dark class="elevation-1 ma-1" @click="abrirNuevo">
                <v-icon left small>add</v-icon> <span class="hidden-xs-only">Nuevo Traslado</span><span class="hidden-sm-and-up">Nuevo</span>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>

      <!-- Tabla principal -->
      <div style="overflow-x: auto; width: 100%;" v-if="!verNuevo">
        <v-data-table
          :headers="headers"
          :items="traslados"
          :total-items="totalItems"
          :pagination.sync="paginacion"
          :loading="cargandoLista"
          :rows-per-page-items="[10, 25, 50]"
          class="elevation-1"
          :hide-headers="$vuetify.breakpoint.smAndDown"
        >
        <template slot="items" slot-scope="props">
          <!-- VISTA MÓVIL -->
          <tr v-if="$vuetify.breakpoint.smAndDown">
            <td :colspan="headers.length" class="pa-2">
              <v-card flat class="elevation-1 pa-3">
                <v-layout row wrap justify-space-between align-center class="mb-2">
                  <div class="font-weight-bold subheading">{{ props.item.numero_traslado || 'Sin número' }}</div>
                  <v-chip small label :color="estadoColor(props.item.estado)" text-color="white" class="ma-0">
                    <v-icon left small>{{ estadoIcono(props.item.estado) }}</v-icon>
                    {{ props.item.estado }}
                  </v-chip>
                </v-layout>
                <div class="mb-2 body-2">
                  <v-chip small outline :color="props.item.rol === 'saliente' ? 'blue' : 'teal'" class="ma-0 mr-2" style="height: 22px;">
                    <v-icon left small style="font-size: 14px;" class="mr-1">{{ props.item.rol === 'saliente' ? 'call_made' : 'call_received' }}</v-icon>
                    {{ props.item.rol === 'saliente' ? 'Saliente' : 'Entrante' }}
                  </v-chip>
                  <span>{{ props.item.sucursal_nombre }}</span>
                </div>
                <div class="caption grey--text text--darken-1 mb-2">
                  <v-icon small class="mr-1" style="font-size: 16px;">access_time</v-icon>{{ props.item.creado_en | moment("DD/MM/YYYY hh:mm A") }}
                </div>
                <v-divider class="my-2"></v-divider>
                <v-layout row justify-end>
                  <v-btn small flat color="red accent-3" class="ma-0 mr-2" v-if="props.item.rol === 'saliente' && props.item.estado !== 'Cancelado'" @click="confirmarAnular(props.item)">
                    <v-icon left small>cancel</v-icon> Anular
                  </v-btn>
                  <v-btn small color="blue darken-2" dark class="ma-0" @click="verDetalle(props.item)">
                    <v-icon left small>visibility</v-icon> Ver Detalle
                  </v-btn>
                </v-layout>
              </v-card>
            </td>
          </tr>
          
          <!-- VISTA DESKTOP -->
          <tr v-else>
            <td class="justify-center layout px-0">
              <v-icon small class="mr-2 icon-action" color="blue darken-2" @click="verDetalle(props.item)">visibility</v-icon>
              <v-icon small class="icon-action" v-if="props.item.rol === 'saliente' && props.item.estado !== 'Cancelado'" color="red accent-3" @click="confirmarAnular(props.item)">cancel</v-icon>
            </td>
            <td class="font-weight-medium">{{ props.item.numero_traslado || '—' }}</td>
            <td>
              <v-chip small label :color="props.item.rol === 'saliente' ? 'blue' : 'teal'" text-color="white">
                <v-icon left small>{{ props.item.rol === 'saliente' ? 'call_made' : 'call_received' }}</v-icon>
                {{ props.item.rol === 'saliente' ? 'Saliente' : 'Entrante' }}
              </v-chip>
            </td>
            <td>{{ props.item.sucursal_nombre }}</td>
            <td>
              <v-chip small label :color="estadoColor(props.item.estado)" text-color="white">
                <v-icon left small>{{ estadoIcono(props.item.estado) }}</v-icon>
                {{ props.item.estado }}
              </v-chip>
            </td>
            <td class="grey--text text--darken-1">{{ props.item.creado_en | moment("DD/MM/YYYY HH:mm") }}</td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center pa-4">
            <v-icon large color="grey lighten-1" class="mb-2">swap_horiz</v-icon>
            <div class="title grey--text">No hay traslados registrados</div>
            <v-btn color="primary" class="mt-2" @click="listar">Recargar</v-btn>
          </div>
        </template>
      </v-data-table>
      </div>

      <!-- Panel Nuevo Traslado (Reemplaza al dialog) -->
      <v-slide-y-transition>
        <v-card v-if="verNuevo" class="elevation-2 mt-2 card-rounded pb-2">
          <v-toolbar flat color="blue darken-2" dark class="responsive-toolbar">
            <v-btn icon @click="cerrarNuevo">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="font-weight-medium text-truncate">Nuevo Traslado</v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pa-4 grey lighten-5">
            <v-card flat class="pa-4 card-rounded elevation-1 white">
              <v-layout row wrap>
                <v-flex xs12 sm6 class="pr-3">
                  <v-select outline v-model="sucursalOrigenId" :items="sucursales" label="Sucursal Origen (Gema Moda)" prepend-inner-icon="store"></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field outline v-model="descripcionSaliente" label="Descripción o motivo (opcional)" prepend-inner-icon="description"></v-text-field>
                </v-flex>
                
                <v-flex xs12 sm8 class="pr-3">
                  <v-text-field outline v-model="codigoSaliente" label="Escanear Código de Barras" @keyup.enter="buscarCodigoSaliente" @click:append="buscarCodigoSaliente" prepend-inner-icon="qr_code" append-icon="search" placeholder="Click aquí y escanee el producto..."></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-btn color="teal" dark large block @click="abrirBuscadorArticulos" class="elevation-2" style="height: 56px; margin-top: 0;">
                    <v-icon left>list</v-icon> Buscar en Catálogo
                  </v-btn>
                </v-flex>
              </v-layout>

              <v-divider class="my-3"></v-divider>
              
              <h3 class="title grey--text text--darken-2 mb-3"><v-icon class="mr-2">shopping_basket</v-icon>Artículos a trasladar</h3>
              <div style="overflow-x: auto; width: 100%;">
                <v-data-table :headers="cabeceraDetallesSaliente" :items="detallesSaliente" hide-actions class="elevation-0 border-styled" :hide-headers="$vuetify.breakpoint.smAndDown">
                  <template slot="items" slot-scope="props">
                    <!-- VISTA MÓVIL (Tarjeta) -->
                    <tr v-if="$vuetify.breakpoint.smAndDown">
                      <td :colspan="cabeceraDetallesSaliente.length" class="pa-2">
                        <v-card flat class="elevation-1 pa-2">
                          <v-layout row justify-space-between align-start class="mb-2">
                            <div class="font-weight-medium body-2 pr-2" style="line-height: 1.2;">{{ props.item.nombre }}</div>
                            <v-icon small color="red accent-3" class="icon-action" @click="quitarArticulo(props.index)">delete</v-icon>
                          </v-layout>
                          <v-layout row justify-space-between align-center>
                            <div class="grey--text caption">Stock disp: <span class="font-weight-bold">{{ props.item.stock }}</span></div>
                            <div style="width:100px">
                              <v-text-field outline v-model="props.item.cantidad" type="number" min="1" hide-details class="centered-input mt-0 mb-0" height="32" style="font-size: 14px"></v-text-field>
                            </div>
                          </v-layout>
                        </v-card>
                      </td>
                    </tr>
                    
                    <!-- VISTA DESKTOP -->
                    <tr v-else>
                      <td class="text-xs-center">
                        <v-icon small color="red accent-3" class="icon-action" @click="quitarArticulo(props.index)">delete</v-icon>
                      </td>
                      <td class="font-weight-medium">{{ props.item.nombre }}</td>
                      <td class="text-xs-center grey--text">{{ props.item.stock }}</td>
                      <td style="width:120px">
                        <v-text-field outline v-model="props.item.cantidad" type="number" min="1" hide-details class="centered-input mt-1 mb-1"></v-text-field>
                      </td>
                    </tr>
                  </template>
                  <template slot="no-data">
                    <div class="text-xs-center pa-4 grey--text body-1">
                      <v-icon large color="grey lighten-2" class="mb-2">add_shopping_cart</v-icon><br>
                      Agregue artículos usando el código de barras o el buscador de catálogo
                    </div>
                  </template>
                </v-data-table>
              </div>
              
              <v-layout row justify-end class="mt-4">
                <v-btn large flat @click="cerrarNuevo" class="mr-2">Cancelar</v-btn>
                <v-btn large color="blue darken-2" dark :disabled="detallesSaliente.length === 0 || !sucursalOrigenId" @click="enviarSaliente" :loading="cargando" class="elevation-2 px-4">
                  <v-icon left>send</v-icon> Enviar a Zona Jeans
                </v-btn>
              </v-layout>
            </v-card>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>

      <!-- Dialog Búsqueda Artículos -->
      <v-dialog v-model="dialogArticulos" max-width="800px">
        <v-card class="card-rounded">
          <v-card-title class="teal white--text">
            <v-icon dark class="mr-2">search</v-icon>
            <span class="title">Buscar Artículo en Sucursal</span>
          </v-card-title>
          <v-card-text>
            <v-text-field outline v-model="busquedaArticulo" label="Nombre del artículo" @keyup.enter="buscarArticulosPorNombre" @click:append="buscarArticulosPorNombre" append-icon="search" prepend-inner-icon="shopping_cart" autofocus></v-text-field>
            <v-data-table :headers="cabeceraArticulosBusqueda" :items="articulosBusqueda" :loading="cargandoArticulos" class="elevation-1 border-styled">
              <template slot="items" slot-scope="props">
                <td class="font-weight-medium">{{ props.item.nombre }}</td>
                <td class="text-xs-center">{{ props.item.stock }}</td>
                <td class="text-xs-center">
                  <v-btn small round color="blue darken-2" dark @click="agregarArticulo(props.item)" class="ma-0 elevation-1">
                    <v-icon left small>add</v-icon> Agregar
                  </v-btn>
                </td>
              </template>
              <template slot="no-data">
                <div class="text-xs-center pa-3 grey--text">
                  <span v-if="cargandoArticulos">Buscando...</span>
                  <span v-else-if="yaBuscado">No se encontraron artículos con ese nombre en esta sucursal.</span>
                  <span v-else>Escriba y presione Enter o clic en la lupa para buscar</span>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="pa-3">
            <v-spacer></v-spacer>
            <v-btn flat @click="dialogArticulos = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog Anular -->
      <v-dialog v-model="anularModal" max-width="450px">
        <v-card class="card-rounded">
          <v-card-title class="red accent-4 white--text">
            <v-icon dark class="mr-2">warning</v-icon>
            <span class="title">Confirmar Anulación</span>
          </v-card-title>
          <v-card-text class="pt-4 body-1">
            ¿Está seguro que desea anular el traslado
            <strong>{{ anularItem ? (anularItem.numero_traslado || 'Sin número') : '' }}</strong>?
            <div class="caption grey--text mt-2">Esta acción no se puede deshacer.</div>
          </v-card-text>
          <v-card-actions class="pa-3">
            <v-spacer></v-spacer>
            <v-btn flat @click="anularModal = false">Cancelar</v-btn>
            <v-btn color="red accent-4" dark :loading="cargando" @click="anular">
              <v-icon left small>cancel</v-icon> Anular
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'

export default {
  data() {
    return {
      traslados: [],
      totalItems: 0,
      paginacion: { page: 1, rowsPerPage: 10 },
      cargandoLista: false,
      searchNumero: '',
      verNuevo: false,
      tabActiva: 0,
      cargando: false,
      sucursalOrigenId: null,
      descripcionSaliente: '',
      codigoSaliente: '',
      detallesSaliente: [],
      busquedaArticulo: '',
      articulosBusqueda: [],
      dialogArticulos: false,
      cargandoArticulos: false,
      yaBuscado: false,
      sucursales: [],
      anularModal: false,
      anularItem: null,
      headers: [
        { text: 'Opciones', value: 'opciones', sortable: false },
        { text: 'N° Traslado', value: 'numero_traslado', sortable: false },
        { text: 'Tipo', value: 'rol', sortable: false },
        { text: 'Sucursal', value: 'sucursal_nombre', sortable: false },
        { text: 'Estado', value: 'estado', sortable: false },
        { text: 'Fecha', value: 'creado_en', sortable: false },
      ],
      cabeceraDetallesSaliente: [
        { text: 'Quitar', value: 'quitar', sortable: false, align: 'center' },
        { text: 'Artículo', value: 'nombre', sortable: false },
        { text: 'Stock', value: 'stock', sortable: false, align: 'center' },
        { text: 'Cantidad', value: 'cantidad', sortable: false },
      ],
      cabeceraArticulosBusqueda: [
        { text: 'Nombre', value: 'nombre', sortable: false },
        { text: 'Stock', value: 'stock', sortable: false, align: 'center' },
        { text: 'Acción', value: 'accion', sortable: false, align: 'center' },
      ],
    }
  },
  created() {
    this.listar()
    this.cargarSucursales()
  },
  watch: {
    'paginacion.page'() { this.listar() },
    'paginacion.rowsPerPage'() {
      if (this.paginacion.page !== 1) {
        this.paginacion.page = 1
      } else {
        this.listar()
      }
    },
    searchNumero(val) {
      if (val === '' || val === null) this.buscar()
    }
  },
  methods: {
    getConfig() {
      return { headers: { Authorization: 'Bearer ' + this.$store.state.token } }
    },
    listar() {
      var me = this
      me.cargandoLista = true
      var params = { pagina: me.paginacion.page, porPagina: me.paginacion.rowsPerPage }
      if (me.searchNumero) params.numero = me.searchNumero
      var cfg = Object.assign({}, me.getConfig(), { params: params })
      axios.get('api/TrasladosEmpresa/Listar', cfg)
        .then(function (r) {
          me.cargandoLista = false
          if (Array.isArray(r.data)) {
            me.traslados = r.data
            me.totalItems = r.data.length
          } else {
            me.traslados = r.data.traslados || r.data.items || r.data.data || []
            me.totalItems = r.data.total || me.traslados.length
          }
        })
        .catch(function (err) {
          me.cargandoLista = false
          var msg = (err.response && err.response.data) || 'Error al cargar traslados'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    },
    buscar() {
      if (this.paginacion.page !== 1) {
        this.paginacion.page = 1
      } else {
        this.listar()
      }
    },
    cargarSucursales() {
      var me = this
      axios.get('api/Articulos/Sucursal', me.getConfig())
        .then(function (r) {
          me.sucursales = r.data
            .filter(function (x) { return x.name !== 'Zona Jeans' && x.id !== 6 })
            .map(function (x) { return { value: x.id, text: x.name } })
        })
    },
    abrirNuevo() {
      this.limpiar()
      this.verNuevo = true
    },
    cerrarNuevo() {
      this.verNuevo = false
      this.limpiar()
    },
    limpiar() {
      this.tabActiva = 0
      this.sucursalOrigenId = null
      this.descripcionSaliente = ''
      this.codigoSaliente = ''
      this.detallesSaliente = []
      this.busquedaArticulo = ''
      this.articulosBusqueda = []
    },
    estadoColor(estado) {
      var c = { Completado: 'green', EnProceso: 'blue', Error: 'orange', Excepcion: 'deep-orange', Cancelado: 'grey' }
      return c[estado] || 'grey'
    },
    estadoIcono(estado) {
      var i = { Completado: 'check_circle', EnProceso: 'autorenew', Error: 'error_outline', Excepcion: 'warning', Cancelado: 'cancel' }
      return i[estado] || 'help'
    },
    abrirBuscadorArticulos() {
      if (!this.sucursalOrigenId) {
        swal({ title: 'Atención', text: 'Seleccione una sucursal origen primero', icon: 'warning' })
        return
      }
      this.busquedaArticulo = ''
      this.articulosBusqueda = []
      this.yaBuscado = false
      this.dialogArticulos = true
    },
    buscarCodigoSaliente() {
      if (!this.sucursalOrigenId) {
        swal({ title: 'Atención', text: 'Seleccione una sucursal origen primero', icon: 'warning' })
        return
      }
      if (!this.codigoSaliente) return
      var me = this
      axios.get('api/Articulos/BuscarCodigoIngresoSucursal/' + me.codigoSaliente + '/' + me.sucursalOrigenId, me.getConfig())
        .then(function (r) {
          if (!r.data || !r.data.idarticulo) {
            swal({ title: 'No encontrado', text: 'No se encontró el artículo', icon: 'warning' })
            return
          }
          var stock = (r.data.stocks && r.data.stocks.length > 0) ? r.data.stocks[0].stock : 0
          me.agregarArticulo({ idarticulo: r.data.idarticulo, nombre: r.data.nombre, stock: stock })
          me.codigoSaliente = ''
        })
        .catch(function (err) {
          var msg = (err.response && err.response.data) || 'Error al buscar código'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    },
    buscarArticulosPorNombre() {
      if (!this.sucursalOrigenId) {
        swal({ title: 'Atención', text: 'Seleccione una sucursal origen primero', icon: 'warning' })
        return
      }
      if (!this.busquedaArticulo) return
      var me = this
      me.cargandoArticulos = true
      me.yaBuscado = false
      axios.get('api/Articulos/ListarTrasladoSucursal/' + me.busquedaArticulo + '/' + me.sucursalOrigenId, me.getConfig())
        .then(function (r) { 
          me.articulosBusqueda = r.data
          me.cargandoArticulos = false
          me.yaBuscado = true
        })
        .catch(function (err) {
          me.cargandoArticulos = false
          var msg = (err.response && err.response.data) || 'Error al buscar artículos'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    },
    agregarArticulo(art) {
      var existe = false
      for (var i = 0; i < this.detallesSaliente.length; i++) {
        if (this.detallesSaliente[i].idarticulo === art.idarticulo) { existe = true; break }
      }
      if (existe) {
        swal({ title: 'Atención', text: 'El artículo ya está en la lista', icon: 'warning', timer: 2000 })
        return
      }
      this.detallesSaliente.push({ idarticulo: art.idarticulo, nombre: art.nombre, stock: art.stock, cantidad: 1 })
    },
    quitarArticulo(index) { this.detallesSaliente.splice(index, 1) },
    enviarSaliente() {
      if (!this.sucursalOrigenId || this.detallesSaliente.length === 0) return
      var hayInvalidos = false
      for (var i = 0; i < this.detallesSaliente.length; i++) {
        if (!this.detallesSaliente[i].cantidad || parseInt(this.detallesSaliente[i].cantidad) <= 0) { hayInvalidos = true; break }
      }
      if (hayInvalidos) { swal({ title: 'Atención', text: 'Todas las cantidades deben ser mayores a 0', icon: 'warning' }); return }
      var me = this
      var body = {
        sucursalOrigenId: me.sucursalOrigenId,
        descripcion: me.descripcionSaliente,
        articulos: me.detallesSaliente.map(function (d) { return { idarticulo: d.idarticulo, cantidad: parseInt(d.cantidad) } })
      }
      me.cargando = true
      axios.post('api/TrasladosEmpresa/Saliente', body, me.getConfig())
        .then(function (r) {
          me.cargando = false
          if (r.data.estado === 'Completado') {
            swal({ title: 'Éxito', text: 'Traslado saliente registrado correctamente', icon: 'success' })
          } else if (r.data.estado === 'Error') {
            swal({ title: 'Atención', text: r.data.mensaje || 'Ocurrió un error (el worker reintentará)', icon: 'warning' })
          } else {
            swal({ title: 'Éxito', text: 'Traslado registrado', icon: 'success' })
          }
          me.cerrarNuevo()
          me.listar()
        })
        .catch(function (err) {
          me.cargando = false
          var msg = (err.response && err.response.data) || 'Error desconocido'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    },
    verDetalle(item) { this.$router.push({ name: 'trasladoempresadetalle', params: { id: item.transfer_id } }) },
    irExcepciones() { this.$router.push({ name: 'trasladoempresaexcepciones' }) },
    confirmarAnular(item) { this.anularItem = item; this.anularModal = true },
    anular() {
      if (!this.anularItem) return
      var me = this
      me.cargando = true
      axios.post('api/TrasladosEmpresa/Anular/' + me.anularItem.transfer_id, {}, me.getConfig())
        .then(function () {
          me.cargando = false
          swal({ title: 'Éxito', text: 'Traslado anulado correctamente', icon: 'success' })
          me.anularModal = false
          me.listar()
        })
        .catch(function (err) {
          me.cargando = false
          var msg = (err.response && err.response.data) || 'Error al anular'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    }
  }
}
</script>
<style scoped>
.card-rounded { border-radius: 8px !important; }
.border-styled { border: 1px solid #e0e0e0; border-radius: 4px; }
.icon-action { cursor: pointer; transition: transform 0.2s; }
.icon-action:hover { transform: scale(1.3); }
.centered-input { max-width: 100px; margin: 0 auto; }
</style>
