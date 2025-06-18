<template>
  <!-- Modal -->
  <div class="modal fade" id="detalleDispositivo" tabindex="-1" aria-labelledby="detalleDispositivoLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h1 class="modal-title fs-5" id="detalleDispositivoLabel">{{ dispositivo.nombre }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between mb-3">
            <div>
              <span class="badge bg-secondary me-2">
                <i class="bi bi-geo-alt"></i> {{ dispositivo.ubicacion }}
              </span>
              <span class="badge bg-info">
                <i class="bi bi-geo"></i> {{ dispositivo.coordenadas }}
              </span>
            </div>
            <span :class="globalStatusClass" class="badge">
              {{ estadoGeneralTexto }}
            </span>
          </div>
          
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th>Parámetro</th>
                <th>Nominal</th>
                <th>Mínimo</th>
                <th>Máximo</th>
                <th>Valor Actual</th>
                <th>Unidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Potencia</td>
                <td>{{ potencia.nominal }}</td>
                <td>{{ potencia.minimo }}</td>
                <td>{{ potencia.maximo }}</td>
                <td>{{ potencia.valor }}</td>
                <td>{{ potencia.unidad }}</td>
                <td :class="statusClass('potencia')" class="text-center">
                  <i class="bi" :class="statusIcon('potencia')"></i>
                </td>
              </tr>
              <tr>
                <td>Voltaje</td>
                <td>{{ voltaje.nominal }}</td>
                <td>{{ voltaje.minimo }}</td>
                <td>{{ voltaje.maximo }}</td>
                <td>{{ voltaje.valor }}</td>
                <td>{{ voltaje.unidad }}</td>
                <td :class="statusClass('voltaje')" class="text-center">
                  <i class="bi" :class="statusIcon('voltaje')"></i>
                </td>
              </tr>
              <tr>
                <td>Corriente</td>
                <td>{{ corriente.nominal }}</td>
                <td>{{ corriente.minimo }}</td>
                <td>{{ corriente.maximo }}</td>
                <td>{{ corriente.valor }}</td>
                <td>{{ corriente.unidad }}</td>
                <td :class="statusClass('corriente')" class="text-center">
                  <i class="bi" :class="statusIcon('corriente')"></i>
                </td>
              </tr>
              <tr>
                <td>Caudal</td>
                <td>{{ caudal.nominal }}</td>
                <td>{{ caudal.minimo }}</td>
                <td>{{ caudal.maximo }}</td>
                <td>{{ caudal.valor }}</td>
                <td>{{ caudal.unidad }}</td>
                <td :class="statusClass('caudal')" class="text-center">
                  <i class="bi" :class="statusIcon('caudal')"></i>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="d-flex justify-content-between align-items-center mt-3">
            <small class="text-muted">
              <i class="bi bi-clock"></i> {{ formattedDate }}
            </small>
            <small class="text-muted">
              Registrado por: Usuario {{ dispositivo.registro_usuario }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x-circle me-1"></i> Cerrar
          </button>
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
    // Parsear datos JSON
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
    
    // Estado general
    globalStatusClass() {
      return {
        'bg-success': this.dispositivo.estado === 1,
        'bg-warning': this.dispositivo.estado === 2,
        'bg-danger': this.dispositivo.estado === 3
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
          return { 
            nominal: 0, 
            minimo: 0, 
            maximo: 0, 
            valor: 0, 
            unidad: 'N/A', 
            estado: 0 
          };
        }
      }
      // Si ya es objeto, lo retornamos directamente
      return jsonData || { 
        nominal: 0, 
        minimo: 0, 
        maximo: 0, 
        valor: 0, 
        unidad: 'N/A', 
        estado: 0 
      };
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
    
    statusIcon(type) {
      const status = this[type].estado;
      return {
        'bi-check-circle-fill text-success': status === 1,
        'bi-exclamation-triangle-fill text-warning': status === 2,
        'bi-x-circle-fill text-danger': status === 3,
        'bi-question-circle-fill text-secondary': status === 0
      };
    }
  }
}
</script>

<style scoped>
.modal-header {
  padding: 1rem 1.5rem;
}

.modal-title {
  font-weight: 600;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.table {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.table th {
  font-weight: 500;
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.text-danger {
  color: #dc3545;
}

.badge {
  font-weight: 500;
  padding: 0.5em 0.8em;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #212529;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bi {
  font-size: 1.25rem;
}
</style>