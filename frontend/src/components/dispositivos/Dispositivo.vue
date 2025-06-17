<template>
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ dispositivo.nombre }}</h5>
        <p class="card-text">{{ dispositivo.ubicacion }}, {{ dispositivo.coordenadas }}</p>
        
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Opera</th>
              <th>Uni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dispositivo.potencia">
              <td>Potencia</td>
              <th :class="statusClass('potencia')">{{ getValorFormateado(dispositivo.potencia) }}</th>
              <th>{{ getUnidad(dispositivo.potencia) }}</th>
            </tr>
            <tr v-if="dispositivo.voltaje">
              <td>Voltaje</td>
              <th :class="statusClass('voltaje')">{{ getValorFormateado(dispositivo.voltaje) }}</th>
              <th>{{ getUnidad(dispositivo.voltaje) }}</th>
            </tr>
            <tr v-if="dispositivo.corriente">
              <td>Corriente</td>
              <th :class="statusClass('corriente')">{{ getValorFormateado(dispositivo.corriente) }}</th>
              <th>{{ getUnidad(dispositivo.corriente) }}</th>
            </tr>
            <tr v-if="dispositivo.caudal">
              <td>Caudal</td>
              <th :class="statusClass('caudal')">{{ getValorFormateado(dispositivo.caudal) }}</th>
              <th>{{ getUnidad(dispositivo.caudal) }}</th>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" :class="globalStatusClass">Estatus: {{ estatusTexto }}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="card-footer">
        <small class="text-body-secondary">{{ formattedDate }}</small>
        <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" 
                data-bs-target="#detalleDispositivo" @click="emitSetDispositivo">
          Ver Detalle
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
      const date = new Date(this.dispositivo.registro_fecha);
      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: 'short',
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
    statusClass(type) {
      // Si el dato JSON tiene información de estatus, la usamos
      const data = this.dispositivo[type];
      if (data && typeof data === 'object' && data.estatus !== undefined) {
        return {
          'text-success': data.estatus === 1,
          'text-warning': data.estatus === 2,
          'text-danger': data.estatus === 3
        };
      }
      
      // Si no, usamos el estado general del dispositivo
      return {
        'text-success': this.dispositivo.estado === 1,
        'text-warning': this.dispositivo.estado === 2 || this.dispositivo.estado === 0,
        'text-danger': this.dispositivo.estado === 3
      };
    },
    getValorFormateado(data) {
      if (!data) return 'N/A';
      
      // Si es un objeto JSON con estructura
      if (typeof data === 'object') {
        const valor = data.valor || data.value || 0;
        return typeof valor === 'number' ? valor.toFixed(2) : valor;
      }
      
      // Si es un valor directo
      return typeof data === 'number' ? data.toFixed(2) : data;
    },
    getUnidad(data) {
      if (!data) return '';
      
      // Si es un objeto JSON con estructura
      if (typeof data === 'object') {
        return data.unidad || data.unit || data.um || '';
      }
      
      // Unidades por defecto según el tipo
      return '';
    },
    emitSetDispositivo() {
      this.$emit('setDispositivo', this.dispositivo);
    }
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0,0,0,0.03);
}

.btn-link {
  padding: 0;
  text-decoration: none;
}

.table th {
  font-weight: 600;
}
</style>