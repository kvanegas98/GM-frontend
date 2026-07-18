<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Movimientos de articulos</v-toolbar-title>
        <v-divider v-if="!$vuetify.breakpoint.smAndDown" class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="!$vuetify.breakpoint.smAndDown"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
          clearable
          @keyup.enter="buscar"
          @click:append="buscar"
          @input="buscarDebounce"
        ></v-text-field>
        <v-flex v-if="!$vuetify.breakpoint.smAndDown" xs4 sm4 md4 class="ml-2">
          <v-select
            v-model="categoria"
            :items="categorys"
            label="Categoría"
            autocomplete="on"
            v-on:change="buscar"
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

      <!-- Búsqueda móvil -->
      <v-card v-if="$vuetify.breakpoint.smAndDown" flat class="elevation-1 px-2 pb-1">
        <v-layout row align-center>
          <v-flex xs7>
            <v-text-field
              v-model="search"
              prepend-icon="search"
              label="Buscar artículo"
              single-line
              hide-details
              clearable
              @keyup.enter="buscar"
              @click:prepend="buscar"
              @input="buscarDebounce"
            ></v-text-field>
          </v-flex>
          <v-flex xs5 class="pl-2">
            <v-select
              v-model="categoria"
              :items="categorys"
              label="Categoría"
              hide-details
              v-on:change="buscar"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-card>

      <!-- Vista móvil -->
      <template v-if="$vuetify.breakpoint.smAndDown">
        <v-progress-linear v-if="cargando" indeterminate color="primary" class="ma-0"></v-progress-linear>
        <v-layout row wrap class="pa-1">
          <v-flex xs12 v-for="item in articulos" :key="item.idarticulo" class="pa-1">
            <v-card class="elevation-2">
              <v-card-text class="py-2 px-3">
                <v-layout row align-center>
                  <v-flex>
                    <div class="body-2 font-weight-bold">{{ item.nombre }}</div>
                    <div class="caption grey--text">{{ item.codigo }} &middot; {{ item.categoria }}</div>
                  </v-flex>
                  <v-flex shrink>
                    <v-chip small label
                      :color="item.condicion ? 'blue lighten-4' : 'red lighten-4'"
                      :text-color="item.condicion ? 'blue darken-3' : 'red darken-3'">
                      {{ item.condicion ? 'Activo' : 'Inactivo' }}
                    </v-chip>
                  </v-flex>
                </v-layout>
                <v-divider class="my-1"></v-divider>
                <v-layout row align-center>
                  <v-flex>
                    <div class="caption grey--text">Compra</div>
                    <div class="body-2 font-weight-bold">{{ item.precio_compra | currency }}</div>
                  </v-flex>
                  <v-flex>
                    <div class="caption grey--text">Venta</div>
                    <div class="body-2 font-weight-bold">{{ item.precio_venta | currency }}</div>
                  </v-flex>
                </v-layout>
                <v-divider class="my-1"></v-divider>
                <div class="caption grey--text mb-1">Acciones</div>
                <v-layout row align-center>
                  <v-icon small color="teal" class="mr-2" @click="mostrarStock(item)">inventory</v-icon>
                  <v-icon v-if="esAdministrador" small color="primary" class="mr-2" @click="showInvoiceByArticle(item)">request_page</v-icon>
                  <v-icon v-if="esAdministrador" small color="primary" class="mr-2" @click="showCompraByArticle(item)">shopping_cart</v-icon>
                  <v-icon v-if="esAdministrador" small color="primary" class="mr-2" @click="showTrasladoByArticle(item)">move_up</v-icon>
                  <v-icon v-if="esAdministrador" small color="deep-purple" @click="showTrasladoEmpresaByArticle(item)">compare_arrows</v-icon>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <div v-if="!articulos.length && !cargando" class="text-xs-center pa-4 grey--text body-1">Sin resultados</div>
        <v-layout justify-center class="py-2">
          <v-pagination
            v-model="paginacion.page"
            :length="Math.ceil(totalItems / paginacion.rowsPerPage) || 1"
            :total-visible="5"
          ></v-pagination>
        </v-layout>
      </template>

      <!-- Vista escritorio -->
      <div v-if="!$vuetify.breakpoint.smAndDown" class="table-scroll-wrapper">
      <v-data-table
        :headers="filteredHeaders"
        :items="articulos"
        :total-items="totalItems"
        :pagination.sync="paginacion"
        :loading="cargando"
        :rows-per-page-items="[10, 20, 50]"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <!-- <td class="justify-center layout px-0">
            <v-icon v-if="esAdministrador2" small class="mr-2" @click="editItem(props.item)">
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
          </td> -->
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
              request_page
            </v-icon>
          </td>
          <td v-if="esAdministrador">
            <v-icon
              small
              class="mr-2"
              color="primary"
              @click="showCompraByArticle(props.item)"
            >
              shopping_cart
            </v-icon>
          </td>
          <td v-if="esAdministrador">
            <v-icon
              small
              class="mr-2"
              color="primary"
              @click="showTrasladoByArticle(props.item)"
            >
              move_up
            </v-icon>
          </td>
          <td v-if="esAdministrador">
            <v-icon
              small
              class="mr-2"
              color="deep-purple"
              @click="showTrasladoEmpresaByArticle(props.item)"
            >
              compare_arrows
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
      </div>
    </v-flex>

    <v-dialog v-model="dialogStock" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="500px">
      <v-spacer slot="activator"> </v-spacer>
      <v-card>
        <v-toolbar flat color="teal" dark>
          <v-btn icon dark @click.native="closeStock"><v-icon>arrow_back</v-icon></v-btn>
          <v-toolbar-title>Stock por Sucursal</v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="tbStock" :items="_stock" class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.sucursal }}</td>
            <td>{{ props.item.stock }}</td>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeStock">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ver Detalle de factura -->
    <v-dialog v-model="dialogInvoice" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1200px">
      <v-spacer slot="activator"> </v-spacer>
      <v-card>
        <v-toolbar flat color="blue darken-2" dark>
          <v-btn icon dark @click.native="closeInvoice"><v-icon>arrow_back</v-icon></v-btn>
          <v-toolbar-title>Facturas del Artículo</v-toolbar-title>
        </v-toolbar>
        <!-- Mobile cards -->
        <div v-if="$vuetify.breakpoint.smAndDown" class="pa-2">
          <v-card v-for="(item, i) in invoices" :key="i" class="mb-2 elevation-1">
            <v-card-text class="py-2 px-3">
              <v-layout row align-center>
                <div class="body-2 font-weight-bold">{{ item.usuarioNombre }}</div>
                <v-spacer></v-spacer>
                <span class="caption font-weight-bold blue--text">Factura #{{ item.ventaCodigoFactura }}</span>
              </v-layout>
              <div class="caption grey--text">{{ item.articuloCodigo }} · {{ item.sucursalNombre }}</div>
              <div class="caption grey--text">{{ item.fechaHora | moment("DD/MM/YYYY") }} {{ item.fechaHora | moment("LT") }}</div>
              <v-divider class="my-1"></v-divider>
              <v-layout row>
                <v-flex>
                  <div class="caption grey--text">Cant.</div>
                  <div class="body-2">{{ item.detalleVentaCantidad }}</div>
                </v-flex>
                <v-flex>
                  <div class="caption grey--text">SubTotal</div>
                  <div class="body-2">{{ item.subtotal }}</div>
                </v-flex>
                <v-flex>
                  <div class="caption grey--text">Desc.</div>
                  <div class="body-2">{{ item.detalleVentaDescuento }}</div>
                </v-flex>
                <v-flex>
                  <div class="caption grey--text">Total</div>
                  <div class="body-2 font-weight-bold">{{ item.total }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <div v-if="!invoices.length" class="text-xs-center py-4 grey--text">Sin registros</div>
        </div>
        <!-- Desktop table -->
        <div v-else class="dialog-table-scroll">
          <v-data-table :headers="tbInvoices" :items="invoices" class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.usuarioNombre }}</td>
              <td>{{ props.item.articuloCodigo }}</td>
              <td>{{ props.item.ventaCodigoFactura }}</td>
              <td>{{ props.item.fechaHora | moment("DD/MM/YYYY") }} | {{ props.item.fechaHora | moment("LT") }}</td>
              <td>{{ props.item.sucursalNombre }}</td>
              <td>{{ props.item.detalleVentaCantidad }}</td>
              <td>{{ props.item.subtotal }}</td>
              <td>{{ props.item.detalleVentaDescuento }}</td>
              <td>{{ props.item.total }}</td>
            </template>
          </v-data-table>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeInvoice">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  fin ver facturas -->

    <!-- ver Detalle de Compra -->
    <v-dialog v-model="dialogCompra" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1200px">
      <v-spacer slot="activator"> </v-spacer>
      <v-card>
        <v-toolbar flat color="teal darken-1" dark>
          <v-btn icon dark @click.native="closeCompra"><v-icon>arrow_back</v-icon></v-btn>
          <v-icon class="mr-2">shopping_cart</v-icon>
          <v-toolbar-title>Movimientos de Compra</v-toolbar-title>
        </v-toolbar>
        <!-- Mobile cards -->
        <div v-if="$vuetify.breakpoint.smAndDown" class="pa-2">
          <v-card v-for="(item, i) in compras" :key="i" class="mb-2 elevation-1">
            <v-card-text class="py-2 px-3">
              <v-layout row align-center>
                <div class="body-2 font-weight-bold">{{ item.num_comprobante }}</div>
                <v-spacer></v-spacer>
                <v-chip small label
                  :color="item.estado === 'CANCELADO' || item.estado === 'Aceptado' ? 'cyan' : item.estado === 'PENDIENTE' ? 'orange' : 'pink'"
                  text-color="white">
                  {{ item.estado }}
                </v-chip>
              </v-layout>
              <div class="caption grey--text">{{ item.codigoProducto }} · {{ item.nombreProducto }}</div>
              <div class="caption grey--text">{{ item.fecha | moment("DD/MM/YYYY") }} · {{ item.bodega }}</div>
              <v-divider class="my-1"></v-divider>
              <v-layout row align-center>
                <v-flex>
                  <div class="caption grey--text">Usuario</div>
                  <div class="body-2">{{ item.usuario }}</div>
                </v-flex>
                <v-flex shrink class="text-xs-right">
                  <div class="caption grey--text">Cantidad</div>
                  <div class="body-2 font-weight-bold">{{ item.cantidad }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <div v-if="!compras.length" class="text-xs-center py-4 grey--text">Sin registros</div>
        </div>
        <!-- Desktop table -->
        <div v-else class="dialog-table-scroll">
          <v-data-table :headers="tbCompras" :items="compras" class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.num_comprobante }}</td>
              <td>
                <v-chip small label
                  :color="props.item.estado === 'CANCELADO' || props.item.estado === 'Aceptado' ? 'cyan' : props.item.estado === 'PENDIENTE' ? 'orange' : 'pink'"
                  text-color="white">
                  {{ props.item.estado }}
                </v-chip>
              </td>
              <td>{{ props.item.usuario }}</td>
              <td>{{ props.item.codigoProducto }}</td>
              <td>{{ props.item.nombreProducto }}</td>
              <td>{{ props.item.fecha | moment("DD/MM/YYYY") }}</td>
              <td>{{ props.item.bodega }}</td>
              <td>{{ props.item.cantidad }}</td>
            </template>
          </v-data-table>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeCompra">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  fin ver Compras -->
    <!-- ver Detalle de Traslado -->
    <v-dialog v-model="dialogTraslado" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1200px">
      <v-spacer slot="activator"> </v-spacer>
      <v-card>
        <v-toolbar flat color="blue darken-2" dark>
          <v-btn icon dark @click.native="closeTraslado"><v-icon>arrow_back</v-icon></v-btn>
          <v-icon class="mr-2">move_up</v-icon>
          <v-toolbar-title>Traslados Internos</v-toolbar-title>
        </v-toolbar>
        <!-- Mobile cards -->
        <div v-if="$vuetify.breakpoint.smAndDown" class="pa-2">
          <v-card v-for="(item, i) in traslados" :key="i" class="mb-2 elevation-1">
            <v-card-text class="py-2 px-3">
              <v-layout row align-center>
                <div class="body-2 font-weight-bold">{{ item.consecutivoTraslado }}</div>
                <v-spacer></v-spacer>
                <v-chip small label :color="item.estado === 'Realizado' ? 'cyan' : 'pink'" text-color="white">
                  {{ item.estado }}
                </v-chip>
              </v-layout>
              <div class="caption grey--text">{{ item.codigoProducto }} · {{ item.nombreProducto }}</div>
              <div class="caption grey--text">{{ item.fecha | moment("DD/MM/YYYY") }} · {{ item.usuario }}</div>
              <v-divider class="my-1"></v-divider>
              <div class="caption grey--text">
                {{ item.sucursalOrigen }} <v-icon small>arrow_forward</v-icon> {{ item.sucursalDestino }}
              </div>
              <div class="caption mt-1"><span class="grey--text">Cantidad:</span> <strong>{{ item.cantidad }}</strong></div>
            </v-card-text>
          </v-card>
          <div v-if="!traslados.length" class="text-xs-center py-4 grey--text">Sin registros</div>
        </div>
        <!-- Desktop table -->
        <div v-else class="dialog-table-scroll">
          <v-data-table :headers="tbTraslados" :items="traslados" class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.consecutivoTraslado }}</td>
              <td>
                <v-chip small label :color="props.item.estado === 'Realizado' ? 'cyan' : 'pink'" text-color="white">
                  {{ props.item.estado }}
                </v-chip>
              </td>
              <td>{{ props.item.codigoProducto }}</td>
              <td>{{ props.item.nombreProducto }}</td>
              <td>{{ props.item.fecha | moment("DD/MM/YYYY") }}</td>
              <td>{{ props.item.usuario }}</td>
              <td>{{ props.item.sucursalOrigen }}</td>
              <td>{{ props.item.sucursalDestino }}</td>
              <td>{{ props.item.cantidad }}</td>
            </template>
          </v-data-table>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeTraslado">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  fin ver Traslado -->

    <!-- ver Traslados Empresa -->
    <v-dialog v-model="dialogTrasladoEmpresa" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1100px">
      <v-spacer slot="activator"></v-spacer>
      <v-card>
        <v-toolbar flat color="blue darken-2" dark>
          <v-btn icon dark @click="closeTrasladoEmpresa"><v-icon>arrow_back</v-icon></v-btn>
          <v-icon class="mr-2">compare_arrows</v-icon>
          <v-toolbar-title>
            Traslados entre Empresas
            <span v-if="articuloActualTraslado" class="body-2 ml-1">— {{ articuloActualTraslado.nombre }}</span>
          </v-toolbar-title>
        </v-toolbar>
        <!-- Mobile cards -->
        <div v-if="$vuetify.breakpoint.smAndDown" class="pa-2">
          <v-progress-linear v-if="cargandoTrasladoEmpresa" indeterminate color="blue" class="ma-0"></v-progress-linear>
          <v-card v-for="(item, i) in trasladosEmpresa" :key="i" class="mb-2 elevation-1">
            <v-card-text class="py-2 px-3">
              <v-layout row align-center>
                <div class="body-2 font-weight-bold">{{ item.numero_traslado }}</div>
                <v-spacer></v-spacer>
                <v-chip small label
                  :color="item.rol === 'saliente' ? 'blue lighten-4' : 'green lighten-4'"
                  :text-color="item.rol === 'saliente' ? 'blue darken-3' : 'green darken-3'">
                  <v-icon left small>{{ item.rol === 'saliente' ? 'arrow_upward' : 'arrow_downward' }}</v-icon>
                  {{ item.rol === 'saliente' ? 'Saliente' : 'Entrante' }}
                </v-chip>
              </v-layout>
              <div class="caption grey--text">{{ item.sucursal_nombre }} · {{ item.creado_en | moment("DD/MM/YYYY") }}</div>
              <v-divider class="my-1"></v-divider>
              <v-layout row align-center>
                <v-flex>
                  <v-chip small label
                    :color="item.estado_traslado === 'Completado' ? 'green' : item.estado_traslado === 'Cancelado' ? 'red' : 'orange'"
                    text-color="white">
                    {{ item.estado_traslado }}
                  </v-chip>
                </v-flex>
                <v-flex>
                  <div class="caption grey--text">Cantidad</div>
                  <div class="body-2 font-weight-bold">{{ item.cantidad }}</div>
                </v-flex>
                <v-flex>
                  <div class="caption grey--text">Precio Venta</div>
                  <div class="body-2">{{ item.precio_venta | currency }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <div v-if="!trasladosEmpresa.length && !cargandoTrasladoEmpresa" class="text-xs-center py-4 grey--text">Sin traslados entre empresas</div>
          <v-layout justify-center class="py-2">
            <v-pagination
              v-model="paginacionTrasladoEmpresa.page"
              :length="Math.ceil(totalTrasladosEmpresa / paginacionTrasladoEmpresa.rowsPerPage) || 1"
              :total-visible="5"
            ></v-pagination>
          </v-layout>
        </div>
        <!-- Desktop table -->
        <div v-else class="dialog-table-scroll">
        <v-data-table
          :headers="tbTrasladosEmpresa"
          :items="trasladosEmpresa"
          :total-items="totalTrasladosEmpresa"
          :pagination.sync="paginacionTrasladoEmpresa"
          :loading="cargandoTrasladoEmpresa"
          :rows-per-page-items="[5, 10, 25]"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.numero_traslado }}</td>
            <td>
              <v-chip small label
                :color="props.item.rol === 'saliente' ? 'blue lighten-4' : 'green lighten-4'"
                :text-color="props.item.rol === 'saliente' ? 'blue darken-3' : 'green darken-3'">
                <v-icon left small>{{ props.item.rol === 'saliente' ? 'arrow_upward' : 'arrow_downward' }}</v-icon>
                {{ props.item.rol === 'saliente' ? 'Saliente' : 'Entrante' }}
              </v-chip>
            </td>
            <td>{{ props.item.sucursal_nombre }}</td>
            <td>
              <v-chip small label
                :color="props.item.estado_traslado === 'Completado' ? 'green' : props.item.estado_traslado === 'Cancelado' ? 'red' : 'orange'"
                text-color="white">
                {{ props.item.estado_traslado }}
              </v-chip>
            </td>
            <td>{{ props.item.cantidad }}</td>
            <td>{{ props.item.precio_venta | currency }}</td>
            <td>{{ props.item.creado_en | moment("DD/MM/YYYY") }}</td>
          </template>
          <template slot="no-data">
            <div class="text-xs-center pa-3 grey--text">Sin traslados entre empresas para este artículo</div>
          </template>
        </v-data-table>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeTrasladoEmpresa">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- fin Traslados Empresa -->
  </v-layout>
</template>
<style scoped>
.table-scroll-wrapper,
.dialog-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.no-spinners input::-webkit-outer-spin-button,
.no-spinners input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinners input[type="number"] {
  -moz-appearance: textfield;
}
.v-data-table-header .v-icon {
  display: none !important;
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
      totalItems: 0,
      paginacion: { page: 1, rowsPerPage: 10 },
      cargando: false,
      _stock: [],
      invoices: [],
      compras: [],
      traslados: [],
      dialogStock: false,
      dialogInvoice: false,
      dialogCompra: false,
      dialogTraslado: false,
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
        // { text: "Opciones", value: "opciones", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre" },
        { text: "Categoría", value: "categoria" },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Factura", value: "invoice", sortable: false },
        { text: "Compras", value: "compras", sortable: false },
        { text: "Traslados", value: "traslados", sortable: false },
        { text: "T. Empresa", value: "traslado_empresa", sortable: false },
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
        { text: "Articulo", value: "articuloNombre", sortable: false },
        { text: "Codigo Articulo", value: "articuloCodigo", sortable: false },
        { text: "No. Factura", value: "ventaCodigoFactura", sortable: false },
        { text: "Fecha", value: "fechaHora", sortable: false },
        { text: "Sucursal", value: "sucursalNombre", sortable: false },
        { text: "Cantidad", value: "detalleVentaCantidad", sortable: false },
        { text: "SubTotal", value: "subtotal", sortable: false},
        { text: "Descuento", value: "detalleVentaDescuento", sortable: false },
        { text: "Total", value: "Total", sortable: false },
      ],
      tbCompras: [
        { text: "Numero Documento", value: "num_comprobante", sortable: false },
        { text: "Estado Documento", value: "estado", sortable: false },
        { text: "Usuario", value: "Usuario", sortable: false },
        { text: "Codigo Articulo", value: "CodigoProducto", sortable: false },
        { text: "Nombre Articulo", value: "NombreProducto", sortable: false },
        { text: "Fecha", value: "Fecha", sortable: false },
        { text: "Bodega", value: "Bodega", sortable: false },
        { text: "Cantidad", value: "detalleVentaCantidad", sortable: false },
      ],
      tbTraslados: [
        { text: "Numero Traslado", value: "consecutivoTraslado", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
        { text: "Codigo Articulo", value: "CodigoProducto", sortable: false },
        { text: "Nombre Articulo", value: "NombreProducto", sortable: false },
        { text: "Fecha", value: "Fecha", sortable: false },
        { text: "Usuario", value: "Usuario", sortable: false },
        { text: "Bodega Origen", value: "SucursalOrigen", sortable: false },
        { text: "Bodega Destino", value: "SucursalDestino", sortable: false },
        { text: "Cantidad", value: "detalleVentaCantidad", sortable: false },
      ],
      dialogTrasladoEmpresa: false,
      trasladosEmpresa: [],
      totalTrasladosEmpresa: 0,
      paginacionTrasladoEmpresa: { page: 1, rowsPerPage: 5 },
      cargandoTrasladoEmpresa: false,
      articuloActualTraslado: null,
      tbTrasladosEmpresa: [
        { text: "No. Traslado", value: "numero_traslado", sortable: false },
        { text: "Dirección", value: "rol", sortable: false },
        { text: "Sucursal", value: "sucursal_nombre", sortable: false },
        { text: "Estado", value: "estado_traslado", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Precio Venta", value: "precio_venta", sortable: false },
        { text: "Fecha", value: "creado_en", sortable: false },
      ],
      categoria: 0,
      search: "",
      debounceTimer: null,
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
    dialog(val) { val || this.close(); },
    dialogStock(val) { val || this.close(); },
    dialogInvoice(val) { val || this.close(); },
    dialogCompra(val) { val || this.close(); },
    dialogTraslado(val) { val || this.close(); },
    dialogTrasladoEmpresa(val) { val || this.closeTrasladoEmpresa(); },
    'paginacionTrasladoEmpresa.page'() { this.cargarTrasladosEmpresa(); },
    'paginacionTrasladoEmpresa.rowsPerPage'() {
      if (this.paginacionTrasladoEmpresa.page !== 1) { this.paginacionTrasladoEmpresa.page = 1; } else { this.cargarTrasladosEmpresa(); }
    },
    'paginacion.page'() { this.listar(); },
    'paginacion.rowsPerPage'() {
      if (this.paginacion.page !== 1) { this.paginacion.page = 1; } else { this.listar(); }
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
    showCompraByArticle(item) {
      let me = this;
      console.log("compras: ");

      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "api/Articulos/ListarArticulosCompras/" + item.idarticulo,
          configuracion
        )
        .then(function (response) {
          console.log(response.data);
          me.compras = response.data;
          console.log("compras: ", me.compras);
          me.dialogCompra = true;
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

    showTrasladoByArticle(item) {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "api/Articulos/ListarArticulosTrasladados/" + item.idarticulo,
          configuracion
        )
        .then(function (response) {
          console.log(response.data);
          me.traslados = response.data;
          console.log("traslados: ", me.traslados);
          me.dialogTraslado = true;
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
    closeCompra() {
      this.dialogCompra = false;
      this.limpiar();
    },
    closeTraslado() {
      this.dialogTraslado = false;
      this.limpiar();
    },
    showTrasladoEmpresaByArticle(item) {
      this.articuloActualTraslado = item;
      this.trasladosEmpresa = [];
      this.totalTrasladosEmpresa = 0;
      this.dialogTrasladoEmpresa = true;
      if (this.paginacionTrasladoEmpresa.page !== 1) {
        this.paginacionTrasladoEmpresa.page = 1;
      } else {
        this.cargarTrasladosEmpresa();
      }
    },
    cargarTrasladosEmpresa() {
      if (!this.articuloActualTraslado) return;
      var me = this;
      me.cargandoTrasladoEmpresa = true;
      var cfg = {
        headers: { Authorization: 'Bearer ' + me.$store.state.token },
        params: { pagina: me.paginacionTrasladoEmpresa.page, porPagina: me.paginacionTrasladoEmpresa.rowsPerPage }
      };
      axios.get('api/TrasladosEmpresa/MovimientosArticulo/' + me.articuloActualTraslado.idarticulo, cfg)
        .then(function (r) {
          me.cargandoTrasladoEmpresa = false;
          me.trasladosEmpresa = r.data.movimientos || [];
          me.totalTrasladosEmpresa = r.data.total || 0;
        })
        .catch(function (err) {
          me.cargandoTrasladoEmpresa = false;
          if (err.response && err.response.status == '401') {
            swal('Sesión caducada', 'Su sesión ha expirado favor volver a iniciar sesión', 'warning');
          }
        });
    },
    closeTrasladoEmpresa() {
      this.dialogTrasladoEmpresa = false;
      this.articuloActualTraslado = null;
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
      var me = this;
      me.cargando = true;
      var params = { pagina: me.paginacion.page, porPagina: me.paginacion.rowsPerPage };
      if (me.categoria && me.categoria !== 0) params.idCategoria = me.categoria;
      if (me.search) params.nombre = me.search;
      var cfg = { headers: { Authorization: 'Bearer ' + me.$store.state.token }, params: params };
      axios.get('api/Articulos/Buscar', cfg)
        .then(function (response) {
          me.cargando = false;
          me.articulos = response.data.articulos || [];
          me.totalItems = response.data.total || 0;
        })
        .catch(function (error) {
          me.cargando = false;
          if (error.response && error.response.status == '401') {
            swal('Sesión caducada', 'Su sesión ha expirado favor volver a iniciar sesión', 'warning');
            me.redirigir();
          }
        });
    },
    buscarDebounce() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => { this.buscar(); }, 400);
    },
    buscar() {
      if (this.paginacion.page !== 1) { this.paginacion.page = 1; } else { this.listar(); }
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
