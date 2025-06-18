<template>
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ dispositivo.nombre }}</h5>
        <p class="card-text">{{ dispositivo.ubicacion }}, {{ dispositivo.coordenadas }}</p>
        
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
    // Extraer y formatear los datos JSON
    potencia() {
      return this.parseJsonData(this.dispositivo.potencia);
    },
    voltaje() {
      return this.parseJsonData(this.dispositivo.voltaje);
    },
    corriente() {
      return this.parseJsonData(this.dispositivo.corriente);
    },
    caudal() {
      return this.parseJsonData(this.dispositivo.caudal);
    },
    
    // Estado general del dispositivo
    globalStatusClass() {
      return {
        'text-bg-success': this.dispositivo.estado === 1,
        'text-bg-warning': this.dispositivo.estado === 2,
        'text-bg-danger': this.dispositivo.estado === 3
      };
    },
    
    estadoGeneralTexto() {
      return this.estadoTexto(this.dispositivo.estado);
    },
    
    formattedDate() {
      const date = new Date(this.dispositivo.registro_fecha);
      return date.toLocaleString();
    }
  },
  methods: {
    parseJsonData(jsonData) {
      // Si es string, convertimos a objeto
      if (typeof jsonData === 'string') {
        try {
          return JSON.parse(jsonData);
        } catch (e) {
          console.error('Error parsing JSON data:', e);
          return { valor: 0, unidad: 'N/A', estado: 0 };
        }
      }
      // Si ya es objeto, lo retornamos directamente
      return jsonData || { valor: 0, unidad: 'N/A', estado: 0 };
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
      const status = this[type].estado;
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

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.5rem;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2c3e50;
}

.card-text {
  color: #6c757d;
  margin-bottom: 1.25rem;
}

.card-body {
  padding: 1.25rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  padding: 0.75rem 1.25rem;
}

.btn-link {
  padding: 0;
  text-decoration: none;
  font-size: 0.875rem;
}

.table {
  margin-bottom: 0;
  font-size: 0.875rem;
}

.table th, .table td {
  padding: 0.5rem;
  vertical-align: middle;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.text-bg-success {
  background-color: #d4edda !important;
  color: #155724;
}

.text-bg-warning {
  background-color: #fff3cd !important;
  color: #856404;
}

.text-bg-danger {
  background-color: #f8d7da !important;
  color: #721c24;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.8rem;
  }
  
  .table th, .table td {
    padding: 0.3rem;
  }
}
</style>