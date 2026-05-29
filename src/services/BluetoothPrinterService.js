/**
 * BluetoothPrinterService.js
 * 
 * Servicio para impresión directa vía Bluetooth (Web Bluetooth API)
 * hacia impresoras térmicas portátiles usando comandos ESC/POS.
 * 
 * No depende de librerías externas - genera los bytes ESC/POS
 * directamente para máxima compatibilidad con webpack 4 / Vue CLI 3.
 * 
 * UUIDs comunes para impresoras térmicas Bluetooth:
 *   Servicio: 000018f0-0000-1000-8000-00805f9b34fb
 *   Característica de escritura: 00002af1-0000-1000-8000-00805f9b34fb
 */

// UUIDs para el servicio Bluetooth de la impresora
var PRINTER_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
var PRINTER_CHARACTERISTIC_UUID = '00002af1-0000-1000-8000-00805f9b34fb';

// Tamaño máximo de cada fragmento (chunk) en bytes
// 100 es el valor más seguro y estándar para evitar que la impresora ignore comandos
var CHUNK_SIZE = 100;
// Retardo entre cada envío de chunk (ms)
// 30ms permite enviar datos fluidamente sin saturar la memoria
var CHUNK_DELAY_MS = 30;
// Ancho de impresión en píxeles para impresora de 80mm (576 dots a 203dpi)
var PRINT_WIDTH = 576;

// ============================================================
// Utilidades ESC/POS (generación manual de comandos)
// ============================================================

var ESC = 0x1B;  // Escape
var GS  = 0x1D;  // Group Separator
var LF  = 0x0A;  // Line Feed

var EscPos = {
  /** Inicializar impresora */
  init: function() {
    return [ESC, 0x40]; // ESC @
  },

  /** Alinear texto: 'left' | 'center' | 'right' */
  align: function(alignment) {
    var n = 0;
    if (alignment === 'center') n = 1;
    if (alignment === 'right') n = 2;
    return [ESC, 0x61, n]; // ESC a n
  },

  /** Activar/desactivar negrita */
  bold: function(on) {
    return [ESC, 0x45, on ? 1 : 0]; // ESC E n
  },

  /** Activar/desactivar subrayado */
  underline: function(on) {
    return [ESC, 0x2D, on ? 1 : 0]; // ESC - n
  },

  /** Tamaño de texto (1-8 para ancho y alto) */
  textSize: function(width, height) {
    var n = ((width - 1) << 4) | (height - 1);
    return [GS, 0x21, n]; // GS ! n
  },

  /** Avanzar n líneas */
  feed: function(lines) {
    var result = [];
    for (var i = 0; i < (lines || 1); i++) {
      result.push(LF);
    }
    return result;
  },

  /** Convertir string a array de bytes (Latin-1 / CP437 básico) */
  textToBytes: function(text) {
    var bytes = [];
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      // Mapear caracteres especiales del español
      if (code > 127) {
        switch (text[i]) {
          case 'á': bytes.push(160); break;
          case 'é': bytes.push(130); break;
          case 'í': bytes.push(161); break;
          case 'ó': bytes.push(162); break;
          case 'ú': bytes.push(163); break;
          case 'ñ': bytes.push(164); break;
          case 'Ñ': bytes.push(165); break;
          case 'Á': bytes.push(65); break;
          case 'É': bytes.push(69); break;
          case 'Í': bytes.push(73); break;
          case 'Ó': bytes.push(79); break;
          case 'Ú': bytes.push(85); break;
          case '¿': bytes.push(168); break;
          case '¡': bytes.push(173); break;
          default: bytes.push(63); break; // '?' para no soportados
        }
      } else {
        bytes.push(code);
      }
    }
    return bytes;
  },

  /** Imprimir una línea de texto con salto de línea */
  line: function(text) {
    return this.textToBytes(text).concat([LF]);
  },

  /** Cortar papel (parcial) */
  cut: function() {
    return [GS, 0x56, 0x01]; // GS V 1 (partial cut)
  }
};

// ============================================================
// Clase principal del servicio
// ============================================================

function BluetoothPrinterService() {
  this.device = null;
  this.server = null;
  this.service = null;
  this.characteristic = null;
  this.isConnected = false;
}

/**
 * Verifica si el navegador soporta Web Bluetooth
 */
BluetoothPrinterService.prototype.isSupported = function() {
  return !!(navigator && navigator.bluetooth);
};

/**
 * Conecta con una impresora Bluetooth.
 * Debe ser invocada desde un evento de usuario (click).
 */
BluetoothPrinterService.prototype.connect = function() {
  var self = this;

  if (!this.isSupported()) {
    return Promise.reject(new Error('Tu navegador no soporta Web Bluetooth. Usa Chrome en Android.'));
  }

  return navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [PRINTER_SERVICE_UUID]
  })
  .then(function(device) {
    self.device = device;

    // Escuchar desconexión
    device.addEventListener('gattserverdisconnected', function() {
      self.isConnected = false;
      self.device = null;
      self.server = null;
      self.service = null;
      self.characteristic = null;
      console.log('Impresora Bluetooth desconectada.');
    });

    return device.gatt.connect();
  })
  .then(function(server) {
    self.server = server;
    // Dar un tiempo a la conexión física antes de pedir los servicios 
    // (evita el problema de tener que dar 2 clicks en Android)
    return self._delay(500).then(function() {
      return server.getPrimaryService(PRINTER_SERVICE_UUID);
    });
  })
  .then(function(service) {
    self.service = service;
    return service.getCharacteristic(PRINTER_CHARACTERISTIC_UUID);
  })
  .then(function(characteristic) {
    self.characteristic = characteristic;
    self.isConnected = true;
    var name = self.device.name || 'Impresora Bluetooth';
    console.log('Conectado a: ' + name);
    return name;
  })
  .catch(function(error) {
    self.isConnected = false;
    if (error.name === 'NotFoundError') {
      throw new Error('No se seleccionó ninguna impresora. Intenta de nuevo.');
    }
    throw new Error('Error al conectar: ' + error.message);
  });
};

/**
 * Desconecta la impresora
 */
BluetoothPrinterService.prototype.disconnect = function() {
  if (this.device && this.device.gatt && this.device.gatt.connected) {
    this.device.gatt.disconnect();
  }
  this.isConnected = false;
  this.device = null;
  this.server = null;
  this.service = null;
  this.characteristic = null;
};

/**
 * Utilidad para hacer un retardo
 */
BluetoothPrinterService.prototype._delay = function(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
};

/**
 * Envía un buffer de bytes a la impresora en fragmentos (chunks).
 * Esto es necesario porque las impresoras térmicas se saturan
 * si se envía todo el buffer de golpe.
 * 
 * @param {Uint8Array} data - Buffer completo de datos ESC/POS
 */
BluetoothPrinterService.prototype.sendData = function(data) {
  var self = this;

  if (!this.isConnected || !this.characteristic) {
    return Promise.reject(new Error('No hay impresora conectada. Conecta primero.'));
  }

  var totalBytes = data.length;
  var offset = 0;

  function sendNextChunk() {
    if (offset >= totalBytes) {
      return Promise.resolve();
    }

    var end = Math.min(offset + CHUNK_SIZE, totalBytes);
    var chunk = data.slice(offset, end);
    offset = end;

    return self.characteristic.writeValue(chunk)
      .then(function() {
        if (offset < totalBytes) {
          return self._delay(CHUNK_DELAY_MS).then(sendNextChunk);
        }
        return Promise.resolve();
      });
  }

  return sendNextChunk();
};

/**
 * Construye un buffer ESC/POS a partir de un array de comandos
 */
BluetoothPrinterService.prototype._buildBuffer = function(commands) {
  // Aplanar todos los arrays de comandos en uno solo
  var flat = [];
  for (var i = 0; i < commands.length; i++) {
    var cmd = commands[i];
    if (Array.isArray(cmd)) {
      for (var j = 0; j < cmd.length; j++) {
        flat.push(cmd[j]);
      }
    } else {
      flat.push(cmd);
    }
  }
  return new Uint8Array(flat);
};

/**
 * Formatea un monto como moneda con separador de miles
 */
BluetoothPrinterService.prototype._fmt = function(n) {
  return 'C$ ' + parseFloat(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Formatea un monto en dólares con separador de miles
 */
BluetoothPrinterService.prototype._fmtDollar = function(n) {
  return '$' + parseFloat(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Formatea una fecha
 */
BluetoothPrinterService.prototype._formatDate = function(fecha) {
  if (!fecha) return '';
  try {
    var d = new Date(fecha);
    var day = ('0' + d.getDate()).slice(-2);
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var year = d.getFullYear();
    var hours = ('0' + d.getHours()).slice(-2);
    var minutes = ('0' + d.getMinutes()).slice(-2);
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
  } catch (e) {
    return String(fecha);
  }
};

  // Se eliminó la función de generar imágenes (logo) para asegurar impresión inmediata.

/**
 * Imprime un ticket/factura de venta.
 * 
 * @param {Object} saleData - Datos de la venta
 */
BluetoothPrinterService.prototype.printInvoice = function(saleData) {
  var self = this;
  var fmt = this._fmt;
  var fechaStr = this._formatDate(saleData.fecha);
  var SEP = '================================================';
  var LINE = '------------------------------------------------';

  function doPrint() {
    var cmds = [];

    // Inicializar
    cmds.push(EscPos.init());

    // Encabezado
    cmds.push(EscPos.align('center'));

    // Decoración Superior
    cmds.push(EscPos.line(' * * * * * * * * * * * * * * * * * * * * * * * '));
    cmds.push(EscPos.feed(1));

    // Nombre de Empresa (Extra Grande)
    cmds.push(EscPos.bold(true));
    cmds.push(EscPos.textSize(3, 3)); // 3 veces más ancho y alto
    cmds.push(EscPos.line('GEMA MODA'));
    
    // Restaurar tamaño y decoración inferior
    cmds.push(EscPos.textSize(1, 1));
    cmds.push(EscPos.bold(false));
    cmds.push(EscPos.feed(1));
    cmds.push(EscPos.line(' * * * * * * * * * * * * * * * * * * * * * * * '));

      // Datos de la factura
      cmds.push(EscPos.align('left'));
      cmds.push(EscPos.line('FACTURA: ' + (saleData.tipoFactura || '')));
      cmds.push(EscPos.line('No: ' + (saleData.codigoFactura || '')));
      cmds.push(EscPos.line('Fecha: ' + fechaStr));
      cmds.push(EscPos.line(LINE));
      cmds.push(EscPos.line('Cliente: ' + (saleData.nombreCliente || '')));

      if (saleData.documento) {
        cmds.push(EscPos.line('Doc: ' + saleData.documento));
      }
      if (saleData.direccion) {
        cmds.push(EscPos.line('Dir: ' + saleData.direccion));
      }
      if (saleData.telefono) {
        cmds.push(EscPos.line('Tel: ' + saleData.telefono));
      }

      cmds.push(EscPos.line(SEP));
      cmds.push(EscPos.bold(true));
      cmds.push(EscPos.line('Cant  Producto                   Precio'));
      cmds.push(EscPos.bold(false));
      cmds.push(EscPos.line(LINE));

      // Detalle de productos
      var subtotal = 0;
      var descuentoTotal = 0;
      var totalUnidades = 0;

      if (saleData.items && saleData.items.length > 0) {
        for (var i = 0; i < saleData.items.length; i++) {
          var item = saleData.items[i];
          var cant = parseInt(item.cantidad) || 0;
          var precio = parseFloat(item.precio) || 0;
          var desc = parseFloat(item.descuento) || 0;
          var totalItem = (cant * precio) - desc;
          var nombre = (item.articulo || item.nombre || '').substring(0, 26);

          // Pad manual para alinear columnas (48 cols total)
          var cantStr = String(cant);
          while (cantStr.length < 6) cantStr += ' ';
          while (nombre.length < 26) nombre += ' ';

          cmds.push(EscPos.line(cantStr + nombre + fmt(totalItem)));

          subtotal += cant * precio;
          descuentoTotal += desc;
          totalUnidades += cant;
        }
      }

      cmds.push(EscPos.line(SEP));
      cmds.push(EscPos.line('Total Unidades: ' + totalUnidades));
      cmds.push(EscPos.line('Subtotal:                ' + fmt(subtotal)));

      if (descuentoTotal > 0) {
        cmds.push(EscPos.line('Descuento:              -' + fmt(descuentoTotal)));
      }

      var envio = parseFloat(saleData.impuesto) || 0;
      if (envio > 0) {
        cmds.push(EscPos.line('Envio:                   ' + fmt(envio)));
      }

      cmds.push(EscPos.line(LINE));

      // Calcular dólares (total / tasaCambio)
      var totalFinal = parseFloat(saleData.total) || 0;
      var tasaCambio = parseFloat(saleData.tasaCambio) || 1;
      var equivalenteDolares = totalFinal / tasaCambio;

      cmds.push(EscPos.bold(true));
      cmds.push(EscPos.line('Equivalente a dolares:   ' + self._fmtDollar(equivalenteDolares)));
      cmds.push(EscPos.feed(1));

      cmds.push(EscPos.textSize(2, 1));
      cmds.push(EscPos.line('TOTAL C$: ' + fmt(totalFinal)));
      cmds.push(EscPos.textSize(1, 1));
      cmds.push(EscPos.bold(false));
      cmds.push(EscPos.line(LINE));
      cmds.push(EscPos.line('Vendedor: ' + (saleData.vendedor || '')));
      cmds.push(EscPos.feed(1));

      // Pie de página
      cmds.push(EscPos.align('center'));
      cmds.push(EscPos.bold(true));
      cmds.push(EscPos.line('GRACIAS POR SU COMPRA!'));
      cmds.push(EscPos.bold(false));
      cmds.push(EscPos.feed(4));

      var buffer = self._buildBuffer(cmds);
      return self.sendData(buffer);
  }

  // Si no está conectado, conectar primero
  if (!this.isConnected) {
    return this.connect().then(doPrint);
  }
  return doPrint();
};

/**
 * Imprime un ticket de abono/pago.
 * 
 * @param {Object} abonoData - Datos del abono
 */
BluetoothPrinterService.prototype.printAbono = function(abonoData) {
  var self = this;
  var fmt = this._fmt;
  var fechaStr = this._formatDate(abonoData.fecha);
  var SEP = '================================================';
  var LINE = '------------------------------------------------';

  // Determinar si es cancelación o abono
  var esCancelacion = parseFloat(abonoData.pendiente) === 0;
  var tipoRecibo = esCancelacion ? 'CANCELACION' : 'ABONO';

  // Calcular saldo anterior
  var saldoAnterior;
  if (parseFloat(abonoData.totalAbonado) !== parseFloat(abonoData.montoAbono)) {
    saldoAnterior = parseFloat(abonoData.pendiente) + parseFloat(abonoData.montoAbono);
  } else {
    saldoAnterior = parseFloat(abonoData.deudaInicial);
  }

  function doPrint() {
    var cmds = [];

    // Inicializar
    cmds.push(EscPos.init());

    // Encabezado
    cmds.push(EscPos.align('center'));

    // Decoración Superior
    cmds.push(EscPos.line(' * * * * * * * * * * * * * * * * * * * * * * * '));
    cmds.push(EscPos.feed(1));

    // Nombre de Empresa (Extra Grande)
    cmds.push(EscPos.bold(true));
    cmds.push(EscPos.textSize(3, 3)); // 3 veces más ancho y alto
    cmds.push(EscPos.line('GEMA MODA'));
    
    // Restaurar tamaño y decoración inferior
    cmds.push(EscPos.textSize(1, 1));
    cmds.push(EscPos.bold(false));
    cmds.push(EscPos.feed(1));
    cmds.push(EscPos.line(' * * * * * * * * * * * * * * * * * * * * * * * '));

      // Datos del abono
      cmds.push(EscPos.align('left'));
      cmds.push(EscPos.line('No. Abono: ' + (abonoData.codigoAbono || '')));
      cmds.push(EscPos.line('Fecha: ' + fechaStr));
      cmds.push(EscPos.line('Cliente: ' + (abonoData.nombreCliente || '')));
      cmds.push(EscPos.line(SEP));

      // Tipo de recibo
      cmds.push(EscPos.align('center'));
      cmds.push(EscPos.bold(true));
      cmds.push(EscPos.textSize(2, 1));
      cmds.push(EscPos.line(tipoRecibo));
      cmds.push(EscPos.textSize(1, 1));
      cmds.push(EscPos.bold(false));

      // Detalles
      cmds.push(EscPos.align('left'));
      cmds.push(EscPos.line(LINE));
      cmds.push(EscPos.line('Saldo Anterior:          ' + fmt(saldoAnterior)));
      cmds.push(EscPos.line('Abono:                   ' + fmt(abonoData.montoAbono)));
      cmds.push(EscPos.bold(true));
      cmds.push(EscPos.line('Saldo Pendiente:         ' + fmt(abonoData.pendiente)));
      cmds.push(EscPos.bold(false));
      cmds.push(EscPos.line(LINE));
      cmds.push(EscPos.line('Vendedor: ' + (abonoData.nombreVendedor || '')));
      cmds.push(EscPos.feed(1));

      // Pie de página
      cmds.push(EscPos.align('center'));
      cmds.push(EscPos.line('Gracias por su pago.'));
      cmds.push(EscPos.line('Conserve este recibo.'));
      cmds.push(EscPos.feed(4));

      var buffer = self._buildBuffer(cmds);
      return self.sendData(buffer);
  }

  if (!this.isConnected) {
    return this.connect().then(doPrint);
  }
  return doPrint();
};

// Exportar una instancia singleton para mantener la conexión
// entre diferentes componentes de la app
var printerService = new BluetoothPrinterService();
export default printerService;
