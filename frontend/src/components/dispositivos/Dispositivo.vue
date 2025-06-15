<template>
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ dispositivo.identifica.nombre }}</h5>
        <p class="card-text">{{ dispositivo.identifica.ubicacion }}, {{ dispositivo.identifica.coordenadas }}</p>
        
        <table class="table table-bordered table-sm">
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
              <th :class="statusClass('potencia')">{{ dispositivo.opera.potencia.valor.toFixed(2) }}</th>
              <th>{{ dispositivo.identifica.potencia.um }}</th>
            </tr>
            <tr>
              <td>Voltaje</td>
              <th :class="statusClass('voltaje')">{{ dispositivo.opera.voltaje.valor.toFixed(2) }}</th>
              <th>{{ dispositivo.identifica.voltaje.um }}</th>
            </tr>
            <tr>
              <td>Corriente</td>
              <th :class="statusClass('corriente')">{{ dispositivo.opera.corriente.valor.toFixed(2) }}</th>
              <th>{{ dispositivo.identifica.corriente.um }}</th>
            </tr>
            <tr>
              <td>Caudal</td>
              <th :class="statusClass('caudal')">{{ dispositivo.opera.caudal.valor.toFixed(2) }}</th>
              <th>{{ dispositivo.identifica.caudal.um }}</th>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" :class="globalStatusClass">Estatus: {{ dispositivo.opera.estatus }}</th>
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
        'text-success': this.dispositivo.opera.idEstatus === 1,
        'text-warning': this.dispositivo.opera.idEstatus === 2,
        'text-danger': this.dispositivo.opera.idEstatus === 3
      };
    },
    formattedDate() {
      const date = new Date(this.dispositivo.opera.fechaRegistro);
      return date.toLocaleString();
    }
  },
  methods: {
    statusClass(type) {
      const status = this.dispositivo.opera[type].idEstatus;
      return {
        'text-success': status === 1,
        'text-warning': status === 2,
        'text-danger': status === 3
      };
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