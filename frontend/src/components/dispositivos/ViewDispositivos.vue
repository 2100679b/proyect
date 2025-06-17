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
        :key="item.identifica.identificador || index" 
        :dispositivo="item" 
        @setDispositivo="setDispositivo" 
      />
    </div>
    
    <button class="btn btn-primary btn-add-device" @click="nuevoDispositivo" v-if="dispositivos.length > 0">
      <i class="bi bi-plus-lg"></i>
    </button>
    
    <DispositivoDialogo :dispositivo="dispositivo" />
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
      dispositivo: {
        identifica: {
          identificador: 0,
          nombre: 'Nombre del Dispositivo',
          ubicacion: 'Ubicación',
          coordenadas: '19.7060° N, 101.1950° W',
          potencia: { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
          voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
          corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
          caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
          fechaRegistro: new Date().toUTCString()
        },
        opera: {
          potencia: { valor: 7.200, idEstatus: 1 },
          voltaje: { valor: 240, idEstatus: 1 },
          corriente: { valor: 30, idEstatus: 1 },
          caudal: { valor: 1, idEstatus: 1 },
          idEstatus: 1, // {1->Normal, 2->Advertencia, 3->Error}
          estatus: 'Operacion Normal',
          fechaRegistro: new Date().toUTCString()
        },
        estado: 1 // {1->Encendido, 2->Apagado, 3->Bloqueado}
      }
    }
  },
  computed: {
    dispositivos() {
      return this.$store.state.dispositivos || []
    }
  },
  methods: {
    setDispositivo(dispositivo) {
      this.dispositivo = dispositivo
    },
    
    refresh() {
      if (this.dispositivos.length === 0) return
      
      this.dispositivos.forEach((item, index) => {
        let desviacion = 0.05, rangoL = 5
        let voltaje = item.identifica.voltaje.minimo +
                    (((item.identifica.voltaje.maximo - item.identifica.voltaje.minimo) +
                    (item.identifica.voltaje.nominal * desviacion)) * Math.random())
        let corriente = item.identifica.corriente.minimo +
                    (((item.identifica.corriente.maximo - item.identifica.corriente.minimo) +
                    (item.identifica.corriente.nominal * desviacion)) * Math.random())
        let caudal = item.identifica.caudal.minimo +
                    (((item.identifica.caudal.maximo - item.identifica.caudal.minimo) +
                    (item.identifica.caudal.nominal * desviacion)) * Math.random())
        let potencia = (voltaje * corriente) / 1000
        let ideCaudal, ideVoltaje, ideCorriente, idePotencia, idEstatus, estatus

        if (voltaje < item.identifica.voltaje.minimo || voltaje > item.identifica.voltaje.maximo) {
          ideVoltaje = 3
        } else {
          if (voltaje < (item.identifica.voltaje.minimo + rangoL) || voltaje > (item.identifica.voltaje.maximo - rangoL)) {
            ideVoltaje = 2
          } else {
            ideVoltaje = 1
          }
        }

        if (corriente < item.identifica.corriente.minimo || corriente > item.identifica.corriente.maximo) {
          ideCorriente = 3
        } else {
          if (corriente < (item.identifica.corriente.minimo + rangoL) || corriente > (item.identifica.corriente.maximo - rangoL)) {
            ideCorriente = 2
          } else {
            ideCorriente = 1
          }
        }

        if (potencia < item.identifica.potencia.minimo || potencia > item.identifica.potencia.maximo) {
          idePotencia = 3
        } else {
          if (potencia < (item.identifica.potencia.minimo + rangoL) || potencia > (item.identifica.potencia.maximo - rangoL)) {
            idePotencia = 2
          } else {
            idePotencia = 1
          }
        }

        if (caudal < item.identifica.caudal.minimo || caudal > item.identifica.caudal.maximo) {
          ideCaudal = 3
        } else {
          if (caudal < (item.identifica.caudal.minimo + rangoL) || caudal > (item.identifica.caudal.maximo - rangoL)) {
            ideCaudal = 2
          } else {
            ideCaudal = 1
          }
        }

        idEstatus = idePotencia + ideVoltaje + ideCorriente + ideCaudal
        idEstatus = idEstatus < 6 ? 1 : (idEstatus > 5 && idEstatus < 10 ? 2 : 3)
        estatus = idEstatus === 1 ? 'Operación Normal' : (idEstatus === 2 ? 'Advertencia' : 'Error')
        
        this.dispositivos[index].opera = {
          potencia: { valor: potencia, idEstatus: idePotencia },
          voltaje: { valor: voltaje, idEstatus: ideVoltaje },
          corriente: { valor: corriente, idEstatus: ideCorriente },
          caudal: { valor: caudal, idEstatus: ideCaudal },
          idEstatus: idEstatus,
          estatus: estatus,
          fechaRegistro: new Date().toUTCString()
        }
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
      this.$router.push('dispositivos/agregar')
    },
    
    nuevo(dispositivo) {
      this.dispositivos.push(dispositivo)
    }
  },
  
  beforeDestroy() {
    // Limpiar intervalo al destruir el componente (Vue 2)
    this.stop()
  },
  
  beforeUnmount() {
    // Limpiar intervalo al destruir el componente (Vue 3)
    this.stop()
  },
  
  created() {
    // this.$store.commit('setDispositivos', DSDispositivos.getListaDataStore())
  }
}
</script>