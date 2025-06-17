<template>
<!-- Modal -->
<div class="modal fade" id="detalleDispositivo" tabindex="-1" aria-labelledby="detalleDispositivoLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="detalleDispositivoLabel">{{ dispositivo.nombre }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="card-text">{{ dispositivo.ubicacion }}, {{ dispositivo.coordenadas }}.</p>
        
        <!-- Información básica del dispositivo -->
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>ID:</strong> {{ dispositivo.id }}
          </div>
          <div class="col-md-6">
            <strong>Estado:</strong> 
            <span :class="globalStatusClass">{{ estatusTexto }}</span>
          </div>
        </div>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Nom</th>
              <th>Min</th>
              <th>Max</th>
              <th>Opera</th>
              <th>Uni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dispositivo.potencia">
              <td>Potencia</td>
              <th>{{ getNominal(dispositivo.potencia) }}</th>
              <th>{{ getMinimo(dispositivo.potencia) }}</th>
              <th>{{ getMaximo(dispositivo.potencia) }}</th>
              <th :class="statusClass(dispositivo.potencia)">{{ getValorOperativo(dispositivo.potencia) }}</th>
              <th>{{ getUnidad(dispositivo.potencia) }}</th>
            </tr>
            <tr v-if="dispositivo.voltaje">
              <td>Voltaje</td>
              <th>{{ getNominal(dispositivo.voltaje) }}</th>
              <th>{{ getMinimo(dispositivo.voltaje) }}</th>
              <th>{{ getMaximo(dispositivo.voltaje) }}</th>
              <th :class="statusClass(dispositivo.voltaje)">{{ getValorOperativo(dispositivo.voltaje) }}</th>
              <th>{{ getUnidad(dispositivo.voltaje) }}</th>
            </tr>
            <tr v-if="dispositivo.corriente">
              <td>Corriente</td>
              <th>{{ getNominal(dispositivo.corriente) }}</th>
              <th>{{ getMinimo(dispositivo.corriente) }}</th>
              <th>{{ getMaximo(dispositivo.corriente) }}</th>
              <th :class="statusClass(dispositivo.corriente)">{{ getValorOperativo(dispositivo.corriente) }}</th>
              <th>{{ getUnidad(dispositivo.corriente) }}</th>
            </tr>
            <tr v-if="dispositivo.caudal">
              <td>Caudal</td>
              <th>{{ getNominal(dispositivo.caudal) }}</th>
              <th>{{ getMinimo(dispositivo.caudal) }}</th>
              <th>{{ getMaximo(dispositivo.caudal) }}</th>
              <th :class="statusClass(dispositivo.caudal)">{{ getValorOperativo(dispositivo.caudal) }}</th>
              <th>{{ getUnidad(dispositivo.caudal) }}</th>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="6" :class="globalStatusClass">Estatus: {{ estatusTexto }}</th>
            </tr>
          </tfoot>
        </table>
        
        <small class="text-body-secondary">
          Registrado: {{ formattedDate }}
        </small>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" @click="editarDispositivo">Editar</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DispositivoDialogo',
  props: {
    dispositivo: {
      type: Object,
      required: true
    }
  },
  computed: {
    globalStatusClass() {
      return {
        'text-success': this.dispositivo.estado === 1,
        'text-warning': this.dispositivo.estado === 2 || this.dispositivo.estado === 0,
        'text-danger': this.dispositivo.estado === 3
      };
    },
    formattedDate() {
      if (!this.dispositivo.registro_fecha) return 'No disponible';
      const date = new Date(this.dispositivo.registro_fecha);
      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    estatusTexto() {
      const estatusMap = {
        0: 'Inactivo',
        1: 'Activo',
        2: 'En Mantenimiento',
        3: 'Error'
      };
      return estatusMap[this.dispositivo.estado] || 'Desconocido';
    }
  },
  methods: {
    statusClass(data) {
      if (!data || typeof data !== 'object') {
        return this.globalStatusClass;
      }
      
      const status = data.estatus || data.idEstatus || this.dispositivo.estado;
      return {
        'text-success': status === 1,
        'text-warning': status === 2 || status === 0,
        'text-danger': status === 3
      };
    },
    getNominal(data) {
      if (!data || typeof data !== 'object') return 'N/A';
      return data.nominal || data.valorNominal || 'N/A';
    },
    getMinimo(data) {
      if (!data || typeof data !== 'object') return 'N/A';
      return data.minimo || data.min || data.valorMinimo || 'N/A';
    },
    getMaximo(data) {
      if (!data || typeof data !== 'object') return 'N/A';
      return data.maximo || data.max || data.valorMaximo || 'N/A';
    },
    getValorOperativo(data) {
      if (!data) return 'N/A';
      
      if (typeof data === 'object') {
        const valor = data.valor || data.value || data.operativo || 0;
        return typeof valor === 'number' ? valor.toFixed(2) : valor;
      }
      
      return typeof data === 'number' ? data.toFixed(2) : data;
    },
    getUnidad(data) {
      if (!data || typeof data !== 'object') return '';
      return data.unidad || data.unit || data.um || '';
    },
    editarDispositivo() {
      // Emitir evento para editar dispositivo
      this.$emit('editarDispositivo', this.dispositivo);
      
      // Cerrar modal
      const modal = document.getElementById('detalleDispositivo');
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
}
</script>

<style scoped src="./RegistroDispositivo.css"></style>