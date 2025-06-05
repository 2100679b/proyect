<template>
  <div
    class="modal fade"
    id="detalleDispositivo"
    tabindex="-1"
    aria-labelledby="detalleDispositivoLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content dispositivo-dialog-content">
        <div class="modal-header dispositivo-dialog-header">
          <h1 class="modal-title fs-5" id="detalleDispositivoLabel">
            <i class="bi bi-gear-fill"></i> Detalle de {{ dispositivo.identifica.nombre }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body dispositivo-dialog-body">
          <p class="card-text mb-4">
            <i class="bi bi-geo-alt-fill"></i> {{ dispositivo.identifica.ubicacion }},
            <i class="bi bi-pin-map-fill"></i> {{ dispositivo.identifica.coordenadas }}.
          </p>

          <table class="table table-bordered table-striped dispositivo-dialog-table">
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Nominal</th>
                <th>Mínimo</th>
                <th>Máximo</th>
                <th>Actual</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Potencia</td>
                <td>{{ dispositivo.identifica.potencia.nominal }}</td>
                <td>{{ dispositivo.identifica.potencia.minimo }}</td>
                <td>{{ dispositivo.identifica.potencia.maximo }}</td>
                <td :class="getStatusClass(dispositivo.opera.potencia.idEstatus)">
                  {{ dispositivo.opera.potencia.valor }}
                </td>
                <td>{{ dispositivo.identifica.potencia.um }}</td>
              </tr>
              <tr>
                <td>Voltaje</td>
                <td>{{ dispositivo.identifica.voltaje.nominal }}</td>
                <td>{{ dispositivo.identifica.voltaje.minimo }}</td>
                <td>{{ dispositivo.identifica.voltaje.maximo }}</td>
                <td :class="getStatusClass(dispositivo.opera.voltaje.idEstatus)">
                  {{ dispositivo.opera.voltaje.valor }}
                </td>
                <td>{{ dispositivo.identifica.voltaje.um }}</td>
              </tr>
              <tr>
                <td>Corriente</td>
                <td>{{ dispositivo.identifica.corriente.nominal }}</td>
                <td>{{ dispositivo.identifica.corriente.minimo }}</td>
                <td>{{ dispositivo.identifica.corriente.maximo }}</td>
                <td :class="getStatusClass(dispositivo.opera.corriente.idEstatus)">
                  {{ dispositivo.opera.corriente.valor }}
                </td>
                <td>{{ dispositivo.identifica.corriente.um }}</td>
              </tr>
              <tr>
                <td>Caudal</td>
                <td>{{ dispositivo.identifica.caudal.nominal }}</td>
                <td>{{ dispositivo.identifica.caudal.minimo }}</td>
                <td>{{ dispositivo.identifica.caudal.maximo }}</td>
                <td :class="getStatusClass(dispositivo.opera.caudal.idEstatus)">
                  {{ dispositivo.opera.caudal.valor }}
                </td>
                <td>{{ dispositivo.identifica.caudal.um }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th
                  colspan="6"
                  :class="getStatusClass(dispositivo.opera.idEstatus)"
                  class="text-center"
                >
                  Estatus General del Dispositivo: {{ dispositivo.opera.estatus }}
                </th>
              </tr>
            </tfoot>
          </table>
          <small class="text-body-secondary float-end"
            ><i class="bi bi-clock-fill"></i> Última lectura:
            {{ formatFecha(dispositivo.opera.fechaRegistro) }}</small
          >
        </div>
        <div class="modal-footer dispositivo-dialog-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i> Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DispositivoDialogo', // Corregido de 'DispositivoDiealogo'
  props: {
    dispositivo: {
      type: Object,
      required: true, // Corregido de 'require' a 'required'
    },
  },
  methods: {
    /**
     * Retorna la clase CSS de Bootstrap según el id de estatus.
     * @param {number} idEstatus - El ID del estatus (1: éxito, 2: advertencia, 3: peligro).
     * @returns {string} La clase CSS de Bootstrap (text-success, text-warning, text-danger).
     */
    getStatusClass(idEstatus) {
      switch (idEstatus) {
        case 1:
          return 'text-success'; // Verde
        case 2:
          return 'text-warning'; // Amarillo
        case 3:
          return 'text-danger'; // Rojo
        default:
          return ''; // Clase por defecto
      }
    },
    /**
     * Formatea una cadena de fecha a un formato más legible.
     * @param {string} fechaString - La fecha en formato de cadena.
     * @returns {string} La fecha formateada.
     */
    formatFecha(fechaString) {
      if (!fechaString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      try {
        return new Date(fechaString).toLocaleDateString('es-ES', options);
      } catch (e) {
        console.error('Error al formatear la fecha:', fechaString, e);
        return fechaString;
      }
    },
  },
};
</script>

<style scoped>
@import './DispositivoDialogo.css'; /* Importa el archivo CSS externo */
</style>