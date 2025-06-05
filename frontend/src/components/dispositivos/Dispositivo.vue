<template>
  <div class="col">
    <div class="card dispositivo-card">
      <div class="card-body">
        <h5 class="card-title">{{ dispositivo.identifica.nombre }}</h5>
        <p class="card-text">
          <i class="bi bi-geo-alt-fill"></i> {{ dispositivo.identifica.ubicacion }},
          <i class="bi bi-pin-map-fill"></i> {{ dispositivo.identifica.coordenadas }}.
        </p>

        <table class="table table-bordered table-striped dispositivo-table">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Opera</th>
              <th>Uni</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Potencia</td>
              <th :class="getStatusClass(dispositivo.opera.potencia.idEstatus)">
                {{ dispositivo.opera.potencia.valor }}
              </th>
              <th>{{ dispositivo.identifica.potencia.um }}</th>
            </tr>
            <tr>
              <td>Voltaje</td>
              <th :class="getStatusClass(dispositivo.opera.voltaje.idEstatus)">
                {{ dispositivo.opera.voltaje.valor }}
              </th>
              <th>{{ dispositivo.identifica.voltaje.um }}</th>
            </tr>
            <tr>
              <td>Corriente</td>
              <th :class="getStatusClass(dispositivo.opera.corriente.idEstatus)">
                {{ dispositivo.opera.corriente.valor }}
              </th>
              <th>{{ dispositivo.identifica.corriente.um }}</th>
            </tr>
            <tr>
              <td>Caudal</td>
              <th :class="getStatusClass(dispositivo.opera.caudal.idEstatus)">
                {{ dispositivo.opera.caudal.valor }}
              </th>
              <th>{{ dispositivo.identifica.caudal.um }}</th>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th
                colspan="3"
                :class="getStatusClass(dispositivo.opera.idEstatus)"
                class="text-center"
              >
                Estatus: {{ dispositivo.opera.estatus }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center">
        <small class="text-body-secondary"
          ><i class="bi bi-clock-fill"></i> {{ formatFecha(dispositivo.opera.fechaRegistro) }}</small
        >
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#detalleDispositivo"
          @click="emitSetDispositivo"
        >
          Ver Detalle <i class="bi bi-info-circle-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dispositivo',
  props: {
    dispositivo: {
      type: Object,
      required: true, // Corregido de 'require' a 'required'
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * Emite un evento 'setDispositivo' con el objeto completo del dispositivo.
     * Se llama al hacer clic en el botón "Ver Detalle".
     */
    emitSetDispositivo() {
      this.$emit('setDispositivo', this.dispositivo);
    },
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
      // Usar un try-catch para manejar fechas inválidas
      try {
        return new Date(fechaString).toLocaleDateString('es-ES', options);
      } catch (e) {
        console.error('Error al formatear la fecha:', fechaString, e);
        return fechaString; // Retorna la original si hay error
      }
    },
  },
  // Se eliminó la sección 'computed' que contenía 'setDispositivo' y los comentarios de 'estatusCaudal'
  // ya que 'setDispositivo' es una acción (método) y 'estatusCaudal' era un comentario.
};
</script>

<style scoped>
@import './Dispositivo.css'; /* Importa el archivo CSS externo */
</style>