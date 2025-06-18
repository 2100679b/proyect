<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Gestión de Dispositivos</h2>
      <div class="btn-group">
        <button type="button" class="btn btn-outline-secondary" @click="refresh" :disabled="dispositivos.length === 0">
          <i class="bi bi-arrow-repeat me-1"></i> Actualizar
        </button>
        <button type="button" class="btn btn-outline-success" @click="start" :disabled="nIntervId !== null">
          <i class="bi bi-play-circle me-1"></i> Iniciar
        </button>
        <button type="button" class="btn btn-outline-danger" @click="stop" :disabled="nIntervId === null">
          <i class="bi bi-stop-circle me-1"></i> Detener
        </button>
      </div>
    </div>
    
    <div v-if="dispositivos.length === 0" class="text-center py-5">
      <div class="alert alert-info">
        <h4 class="alert-heading">No hay dispositivos registrados</h4>
        <p>Comienza agregando tu primer dispositivo</p>
        <button class="btn btn-primary mt-2" @click="nuevoDispositivo">
          <i class="bi bi-plus-lg me-1"></i> Agregar Dispositivo
        </button>
      </div>
    </div>
    
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <Dispositivo 
        v-for="(item, index) in dispositivos" 
        :key="item.id || index" 
        :dispositivo="item" 
        @set-dispositivo="setDispositivo" 
      />
    </div>
    
    <button class="btn btn-primary btn-add-device" @click="nuevoDispositivo" v-if="dispositivos.length > 0">
      <i class="bi bi-plus-lg"></i>
    </button>
    
    <DispositivoDialogo :dispositivo="dispositivoSeleccionado" />
  </div>
</template>

<script>
import Dispositivo from './Dispositivo.vue'
import DispositivoDialogo from './DispositivoDialogo.vue'

export default {
  name: 'ViewDispositivos',
  components: {
    Dispositivo,
    DispositivoDialogo
  },
  data() {
    return {
      nIntervId: null,
      dispositivoSeleccionado: null
    }
  },
  computed: {
    dispositivos() {
      return this.$store.state.dispositivos || []
    }
  },
  methods: {
    setDispositivo(dispositivo) {
      this.dispositivoSeleccionado = dispositivo
    },
    
    refresh() {
      if (this.dispositivos.length === 0) return
      
      this.dispositivos.forEach((item, index) => {
        const desviacion = 0.05
        const rangoL = 5
        
        // Obtener los valores nominales y rangos
        const potenciaNom = item.potencia.nominal
        const potenciaMin = item.potencia.min
        const potenciaMax = item.potencia.max
        
        const voltajeNom = item.voltaje.nominal
        const voltajeMin = item.voltaje.min
        const voltajeMax = item.voltaje.max
        
        const corrienteNom = item.corriente.nominal
        const corrienteMin = item.corriente.min
        const corrienteMax = item.corriente.max
        
        const caudalNom = item.caudal.nominal
        const caudalMin = item.caudal.min
        const caudalMax = item.caudal.max
        
        // Generar valores simulados
        const voltaje = voltajeMin + ((voltajeMax - voltajeMin) + (voltajeNom * desviacion)) * Math.random()
        const corriente = corrienteMin + ((corrienteMax - corrienteMin) + (corrienteNom * desviacion)) * Math.random()
        const caudal = caudalMin + ((caudalMax - caudalMin) + (caudalNom * desviacion)) * Math.random()
        const potencia = (voltaje * corriente) / 1000
        
        // Determinar estados
        const determinarEstado = (valor, min, max) => {
          if (valor < min || valor > max) return 3
          if (valor < (min + rangoL) || valor > (max - rangoL)) return 2
          return 1
        }
        
        const ideVoltaje = determinarEstado(voltaje, voltajeMin, voltajeMax)
        const ideCorriente = determinarEstado(corriente, corrienteMin, corrienteMax)
        const ideCaudal = determinarEstado(caudal, caudalMin, caudalMax)
        const idePotencia = determinarEstado(potencia, potenciaMin, potenciaMax)
        
        // Estado general
        const idEstatus = [idePotencia, ideVoltaje, ideCorriente, ideCaudal].reduce((a, b) => Math.max(a, b), 1)
        const estatus = idEstatus === 1 ? 'Operación Normal' : 
                        idEstatus === 2 ? 'Advertencia' : 'Error'
        
        // Actualizar dispositivo en el store
        this.$store.commit('actualizarDispositivo', {
          index,
          valores: {
            valoresActuales: {
              potencia: { valor: potencia, estado: idePotencia },
              voltaje: { valor: voltaje, estado: ideVoltaje },
              corriente: { valor: corriente, estado: ideCorriente },
              caudal: { valor: caudal, estado: ideCaudal }
            },
            estado: idEstatus,
            estatus,
            fecha_actualizacion: new Date().toISOString()
          }
        })
      })
    },
    
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(() => { this.refresh() }, 2000)
      }
    },
    
    stop() {
      clearInterval(this.nIntervId)
      this.nIntervId = null
    },
    
    nuevoDispositivo() {
      this.$router.push('/dispositivos/agregar')
    }
  },
  
  beforeUnmount() {
    this.stop()
  }
}
</script>

<style scoped>
.btn-add-device {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
</style>