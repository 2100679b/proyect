<template>
  <div class="col" v-if="dispositivo">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ dispositivo.nombre || 'Sin nombre' }}</h5>
        <p class="card-text">{{ dispositivo.ubicacion || 'Ubicación desconocida' }}, {{ dispositivo.coordenadas || 'Coordenadas no disponibles' }}</p>
        
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Valor</th>
              <th>Unidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Potencia</td>
              <td>{{ potencia.valor }}</td>
              <td>{{ potencia.unidad }}</td>
              <td :class="statusClass('potencia')">
                {{ estadoTexto(potencia.estado) }}
              </td>
            </tr>
            <tr>
              <td>Voltaje</td>
              <td>{{ voltaje.valor }}</td>
              <td>{{ voltaje.unidad }}</td>
              <td :class="statusClass('voltaje')">
                {{ estadoTexto(voltaje.estado) }}
              </td>
            </tr>
            <tr>
              <td>Corriente</td>
              <td>{{ corriente.valor }}</td>
              <td>{{ corriente.unidad }}</td>
              <td :class="statusClass('corriente')">
                {{ estadoTexto(corriente.estado) }}
              </td>
            </tr>
            <tr>
              <td>Caudal</td>
              <td>{{ caudal.valor }}</td>
              <td>{{ caudal.unidad }}</td>
              <td :class="statusClass('caudal')">
                {{ estadoTexto(caudal.estado) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="4" :class="globalStatusClass">
                Estado General: {{ estadoGeneralTexto }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="card-footer">
        <small class="text-body-secondary">{{ formattedDate }}</small>
        <button type="button" class="btn btn-link p-0" 
                @click="emitSetDispositivo">
          Ver Detalle
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DispositivoCard',
  props: {
    dispositivo: {
      type: Object,
      required: true
    }
  },
  computed: {
    potencia() {
      return this.parseJsonData(this.dispositivo?.potencia);
    },
    voltaje() {
      return this.parseJsonData(this.dispositivo?.voltaje);
    },
    corriente() {
      return this.parseJsonData(this.dispositivo?.corriente);
    },
    caudal() {
      return this.parseJsonData(this.dispositivo?.caudal);
    },
    globalStatusClass() {
      const estado = this.dispositivo?.estado;
      return {
        'text-bg-success': estado === 1,
        'text-bg-warning': estado === 2,
        'text-bg-danger': estado === 3
      };
    },
    estadoGeneralTexto() {
      return this.estadoTexto(this.dispositivo?.estado);
    },
    formattedDate() {
      if (!this.dispositivo?.registro_fecha) return 'Fecha no disponible';
      const date = new Date(this.dispositivo.registro_fecha);
      return isNaN(date) ? 'Fecha inválida' : date.toLocaleString();
    }
  },
  methods: {
    parseJsonData(jsonData) {
      if (!jsonData) return { valor: 0, unidad: 'N/A', estado: 0 };
      if (typeof jsonData === 'string') {
        try {
          return JSON.parse(jsonData);
        } catch (e) {
          console.error('Error parsing JSON data:', e);
          return { valor: 0, unidad: 'N/A', estado: 0 };
        }
      }
      return jsonData;
    },
    estadoTexto(estado) {
      const estados = {
        1: 'Operativo',
        2: 'Advertencia',
        3: 'Crítico',
        0: 'Desconocido'
      };
      return estados[estado] || 'Desconocido';
    },
    statusClass(type) {
      const status = this[type]?.estado || 0;
      return {
        'text-success': status === 1,
        'text-warning': status === 2,
        'text-danger': status === 3
      };
    },
    emitSetDispositivo() {
      this.$emit('set-dispositivo', this.dispositivo);
    }
  }
}
</script>
