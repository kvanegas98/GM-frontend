<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white" class="elevation-1">
        <v-btn flat icon color="blue darken-2" @click="volver">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">
          <v-icon color="deep-orange" class="mr-1">warning</v-icon>
          Bandeja de Excepciones
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip v-if="excepciones.length" small color="deep-orange" text-color="white" label>
          {{ excepciones.filter(function(e){ return e.estado === 'Pendiente' }).length }} pendientes
        </v-chip>
      </v-toolbar>

      <v-card class="ma-3 elevation-2 card-rounded">
        <v-data-table :headers="headers" :items="excepciones" class="table-styled">
          <template slot="items" slot-scope="props">
            <td>
              <a class="link-traslado" @click.prevent="verDetalle(props.item.transfer_id)">
                <v-icon small color="blue darken-2" class="mr-1">open_in_new</v-icon>
                Ver Traslado
              </a>
            </td>
            <td class="font-weight-medium">{{ props.item.nombre_producto }}</td>
            <td>
              <v-chip small label color="orange lighten-4" text-color="orange darken-4">
                {{ traducirMotivo(props.item.motivo) }}
              </v-chip>
            </td>
            <td class="grey--text text--darken-1">
              <v-icon small class="mr-1">access_time</v-icon>
              {{ props.item.creado_en | moment("DD/MM/YYYY HH:mm") }}
            </td>
            <td class="text-xs-center">
              <v-chip v-if="props.item.estado !== 'Pendiente'" small label color="green" text-color="white">
                <v-icon left small>check_circle</v-icon>{{ props.item.estado }}
              </v-chip>
              <v-btn v-else small round color="blue darken-2" dark @click="abrirResolver(props.item)" class="ma-0 elevation-1">
                <v-icon left small>build</v-icon> Resolver
              </v-btn>
            </td>
          </template>
          <template slot="no-data">
            <div class="text-xs-center pa-4">
              <v-icon large color="green" class="mb-2">check_circle</v-icon>
              <div class="title grey--text">¡Sin excepciones pendientes!</div>
              <div class="body-1 grey--text text--lighten-1">Todos los traslados se procesaron correctamente</div>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Dialog Resolver -->
      <v-dialog v-model="dialogResolver" max-width="550px" persistent>
        <v-card class="card-rounded">
          <v-card-title class="blue darken-2 white--text">
            <v-icon dark class="mr-2">build</v-icon>
            <span class="title">Resolver Excepción</span>
          </v-card-title>
          <v-card-text class="pt-4" v-if="itemActual">
            <v-alert :value="true" type="info" outline class="mb-3 body-2">
              Asigne un artículo de Gema Moda para resolver esta excepción.
            </v-alert>
            <div class="mb-3">
              <span class="caption grey--text">PRODUCTO ZONA JEANS</span>
              <div class="body-2 font-weight-bold">{{ itemActual.nombre_producto }}</div>
            </div>
            <div class="mb-3">
              <span class="caption grey--text">MOTIVO</span>
              <div>
                <v-chip small label color="orange lighten-4" text-color="orange darken-4">
                  {{ traducirMotivo(itemActual.motivo) }}
                </v-chip>
              </div>
            </div>
            <v-divider class="mb-3"></v-divider>
            <v-autocomplete
              v-model="articuloGemaSeleccionado"
              :items="articulosGema"
              item-text="nombre"
              item-value="idarticulo"
              label="Buscar artículo en Gema Moda"
              :search-input.sync="busquedaGema"
              prepend-icon="search"
              return-object
              clearable
              placeholder="Escriba para buscar..."
            >
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-title class="grey--text">No se encontraron artículos</v-list-tile-title>
                </v-list-tile>
              </template>
            </v-autocomplete>
          </v-card-text>
          <v-card-actions class="pa-3">
            <v-spacer></v-spacer>
            <v-btn flat @click="dialogResolver = false">Cancelar</v-btn>
            <v-btn color="blue darken-2" dark :disabled="!articuloGemaSeleccionado" :loading="cargando" @click="confirmarResolver">
              <v-icon left small>check</v-icon> Confirmar
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
      excepciones: [],
      headers: [
        { text: 'Traslado', value: 'transfer_id', sortable: false },
        { text: 'Producto Zona Jeans', value: 'nombre_producto', sortable: false },
        { text: 'Motivo', value: 'motivo', sortable: false },
        { text: 'Fecha', value: 'creado_en', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
      ],
      dialogResolver: false,
      itemActual: null,
      articulosGema: [],
      articuloGemaSeleccionado: null,
      busquedaGema: null,
      cargando: false,
    }
  },
  created() {
    this.cargarExcepciones()
  },
  methods: {
    getConfig() {
      return { headers: { Authorization: 'Bearer ' + this.$store.state.token } }
    },
    cargarExcepciones() {
      var me = this
      axios.get('api/TrasladosEmpresa/Excepciones', me.getConfig())
        .then(function (r) { me.excepciones = r.data })
        .catch(function (err) {
          var msg = (err.response && err.response.data) || 'Error al cargar excepciones'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    },
    volver() { this.$router.push({ name: 'trasladosempresa' }) },
    verDetalle(transferId) {
      this.$router.push({ name: 'trasladoempresadetalle', params: { id: transferId } })
    },
    traducirMotivo(motivo) {
      var m = {
        'nombre_excede_100_chars': 'Nombre demasiado largo para Gema (>100 chars)',
        'max_reintentos_alcanzado': 'Máximo de reintentos alcanzado'
      }
      return m[motivo] || motivo
    },
    abrirResolver(item) {
      this.itemActual = item
      this.articuloGemaSeleccionado = null
      this.busquedaGema = null
      this.dialogResolver = true
      if (this.articulosGema.length === 0) {
        var me = this
        axios.get('api/Articulos/Select', me.getConfig())
          .then(function (r) { me.articulosGema = r.data })
          .catch(function (err) { console.error('Error al cargar artículos', err) })
      }
    },
    confirmarResolver() {
      if (!this.articuloGemaSeleccionado) return
      var me = this
      var body = { idarticulo: me.articuloGemaSeleccionado.idarticulo }
      me.cargando = true
      axios.post('api/TrasladosEmpresa/Excepciones/' + me.itemActual.id + '/Resolver', body, me.getConfig())
        .then(function () {
          me.cargando = false
          me.dialogResolver = false
          swal({ title: 'Éxito', text: 'Excepción resuelta correctamente', icon: 'success' })
          me.cargarExcepciones()
        })
        .catch(function (err) {
          me.cargando = false
          var msg = (err.response && err.response.data) || 'Error al resolver excepción'
          swal({ title: 'Error', text: msg, icon: 'error' })
        })
    }
  }
}
</script>
<style scoped>
.card-rounded { border-radius: 8px !important; }
.table-styled { border-radius: 0 0 8px 8px; }
.link-traslado { cursor: pointer; color: #1565C0; text-decoration: none; font-weight: 500; }
.link-traslado:hover { text-decoration: underline; }
</style>
