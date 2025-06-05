<template>
  <div class="view-dispositivos-container">
    <div class="card view-dispositivos-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title mb-0">
          <i class="bi bi-display-fill"></i> Monitoreo de Dispositivos
        </h4>
        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar con grupos de botones de control">
          <div class="btn-group" role="group" aria-label="Grupo de control de monitoreo">
            <button type="button" class="btn btn-outline-primary control-btn" @click="refresh">
              <i class="bi bi-arrow-clockwise"></i> Actualizar
            </button>
            <button
              type="button"
              class="btn btn-outline-success control-btn"
              @click="start"
              :disabled="nIntervId !== null"
            >
              <i class="bi bi-play-fill"></i> Iniciar Monitoreo
            </button>
            <button
              type="button"
              class="btn btn-outline-danger control-btn"
              @click="stop"
              :disabled="nIntervId === null"
            >
              <i class="bi bi-stop-fill"></i> Detener Monitoreo
            </button>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div v-if="dispositivos.length === 0" class="alert alert-info text-center py-4" role="alert">
          <h5 class="alert-title"><i class="bi bi-info-circle-fill"></i> No hay dispositivos registrados.</h5>
          <p class="mb-0">¡Comienza registrando uno nuevo para empezar a monitorear!</p>
          <button type="button" class="btn btn-primary mt-3" @click="goToRegister">
            <i class="bi bi-plus-circle-fill"></i> Registrar Nuevo Dispositivo
          </button>
        </div>
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <Dispositivo
            v-for="(item, index) in dispositivos"
            :key="item.identifica.identificador || index"
            :dispositivo="item"
            @setDispositivo="setDispositivo"
          ></Dispositivo>
        </div>
      </div>
    </div>

    <DispositivoDialogo :dispositivo="dispositivo" />
  </div>
</template>

<script>
// import DSDispositivos from '@/servicios/dsDispositivos'; // Se mantiene comentado si no se usa directamente aquí
import Dispositivo from './Dispositivo.vue';
import DispositivoDialogo from './DispositivoDialogo.vue';

export default {
  name: 'ViewDispositivos',
  components: {
    Dispositivo,
    DispositivoDialogo,
  },
  data() {
    return {
      nIntervId: null, // Para almacenar el ID del setInterval
      // Objeto placeholder para el modal de detalle, se actualizará al hacer clic en "Ver Detalle"
      dispositivo: {
        identifica: {
          identificador: 0,
          nombre: 'Dispositivo No Seleccionado',
          ubicacion: 'N/A',
          coordenadas: 'N/A',
          potencia: { nominal: 0, minimo: 0, maximo: 0, um: 'KW' },
          voltaje: { nominal: 0, minimo: 0, maximo: 0, um: 'Volts' },
          corriente: { nominal: 0, minimo: 0, maximo: 0, um: 'Amperes' },
          caudal: { nominal: 0, minimo: 0, maximo: 0, um: 'm3/minuto' },
          fechaRegistro: new Date().toUTCString(),
        },
        opera: {
          potencia: { valor: 0, idEstatus: 1 },
          voltaje: { valor: 0, idEstatus: 1 },
          corriente: { valor: 0, idEstatus: 1 },
          caudal: { valor: 0, idEstatus: 1 },
          idEstatus: 1, // {1->Normal, 2->Advertencia, 3->Error}
          estatus: 'Sin Datos',
          fechaRegistro: new Date().toUTCString(),
        },
        estado: 1, // {1->Encendido, 2->Apagado, 3->Bloqueado}
      },
    };
  },
  computed: {
    // Se obtiene la lista de dispositivos del Vuex store
    dispositivos() {
      return this.$store.state.dispositivos || []; // Asegura que siempre sea un array
    },
  },
  methods: {
    /**
     * Establece el dispositivo seleccionado para ser mostrado en el modal de detalle.
     * @param {Object} dispositivo - El objeto dispositivo a mostrar.
     */
    setDispositivo(dispositivo) {
      this.dispositivo = { ...dispositivo }; // Usar una copia para evitar mutaciones directas
    },
    /**
     * Genera nuevos valores aleatorios de operación para todos los dispositivos.
     * Aplica lógica de estatus basada en rangos nominales, mínimos y máximos.
     */
    refresh() {
      // Usar una copia del array para mutar de forma segura en Vuex si es necesario
      const updatedDispositivos = this.dispositivos.map((item) => {
        let desviacion = 0.05; // 5% de desviación para valores aleatorios
        let rangoL = 5; // Rango para determinar el estatus de advertencia

        // Generar valores aleatorios dentro de un rango más amplio que min/max
        // Esto permite que los valores puedan salir del rango "normal" para generar alertas/errores
        const generateRandomValue = (nominal, min, max) => {
          const range = max - min;
          const extendedMin = min - (nominal * desviacion);
          const extendedMax = max + (nominal * desviacion);
          // Asegurarse de que el mínimo no sea negativo para ciertos valores
          const adjustedMin = Math.max(0, extendedMin);
          return adjustedMin + (Math.random() * (extendedMax - adjustedMin));
        };

        let voltaje = generateRandomValue(item.identifica.voltaje.nominal, item.identifica.voltaje.minimo, item.identifica.voltaje.maximo);
        let corriente = generateRandomValue(item.identifica.corriente.nominal, item.identifica.corriente.minimo, item.identifica.corriente.maximo);
        let caudal = generateRandomValue(item.identifica.caudal.nominal, item.identifica.caudal.minimo, item.identifica.caudal.maximo);
        let potencia = (voltaje * corriente) / 1000; // Recalcular potencia

        // Función auxiliar para determinar el idEstatus de un valor
        const getEstatusId = (value, min, max, nominal) => {
          if (value < min || value > max) {
            return 3; // Error
          } else if (
            value < min + rangoL ||
            value > max - rangoL
          ) {
            return 2; // Advertencia (cerca de los límites)
          } else {
            return 1; // Normal
          }
        };

        let ideVoltaje = getEstatusId(voltaje, item.identifica.voltaje.minimo, item.identifica.voltaje.maximo);
        let ideCorriente = getEstatusId(corriente, item.identifica.corriente.minimo, item.identifica.corriente.maximo);
        let idePotencia = getEstatusId(potencia, item.identifica.potencia.minimo, item.identifica.potencia.maximo);
        let ideCaudal = getEstatusId(caudal, item.identifica.caudal.minimo, item.identifica.caudal.maximo);

        // Determinar el estatus general del dispositivo
        let idEstatusGeneral = 1; // Por defecto normal
        if (ideVoltaje === 3 || ideCorriente === 3 || idePotencia === 3 || ideCaudal === 3) {
          idEstatusGeneral = 3; // Si alguna variable está en error, el dispositivo está en error
        } else if (ideVoltaje === 2 || ideCorriente === 2 || idePotencia === 2 || ideCaudal === 2) {
          idEstatusGeneral = 2; // Si alguna variable está en advertencia, el dispositivo está en advertencia
        }

        let estatusTexto =
          idEstatusGeneral === 1
            ? 'Operación Normal'
            : idEstatusGeneral === 2
            ? 'Advertencia'
            : 'Error Crítico';

        // Retornar el dispositivo con los valores actualizados
        return {
          ...item, // Copia el resto de las propiedades del dispositivo
          opera: {
            potencia: { valor: parseFloat(potencia.toFixed(3)), idEstatus: idePotencia },
            voltaje: { valor: parseFloat(voltaje.toFixed(2)), idEstatus: ideVoltaje },
            corriente: { valor: parseFloat(corriente.toFixed(2)), idEstatus: ideCorriente },
            caudal: { valor: parseFloat(caudal.toFixed(3)), idEstatus: ideCaudal },
            idEstatus: idEstatusGeneral,
            estatus: estatusTexto,
            fechaRegistro: new Date().toUTCString(), // Actualizar fecha de registro
          },
        };
      });

      // Se usa una mutación de Vuex para actualizar el estado centralizado
      this.$store.commit('setDispositivos', updatedDispositivos);
    },
    /**
     * Inicia el intervalo para refrescar los datos de los dispositivos automáticamente.
     */
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(() => {
          this.refresh();
        }, 2000); // Refresca cada 2 segundos
        console.log('Monitoreo iniciado.');
      }
    },
    /**
     * Detiene el intervalo de refresco automático.
     */
    stop() {
      if (this.nIntervId) {
        clearInterval(this.nIntervId);
        this.nIntervId = null;
        console.log('Monitoreo detenido.');
      }
    },
    /**
     * Navega a la ruta de registro de un nuevo dispositivo.
     */
    goToRegister() {
      this.$router.push('/menu/dispositivos/agregar'); // Asegúrate que esta es la ruta correcta
    },
  },
  // Ciclo de vida: Iniciar monitoreo al crear el componente (opcional)
  created() {
    // Si tienes datos iniciales de DSDispositivos, cárgalos aquí:
    // if (DSDispositivos && DSDispositivos.getListaDataStore) {
    //   this.$store.commit('setDispositivos', DSDispositivos.getListaDataStore());
    // }
    // Puedes decidir si el monitoreo debe iniciar automáticamente o no
    // this.start();
  },
  // Ciclo de vida: Limpiar el intervalo cuando el componente se destruye
  beforeUnmount() {
    this.stop(); // Asegurarse de limpiar el intervalo para evitar fugas de memoria
  },
};
</script>

<style scoped>
@import './ViewDispositivos.css'; /* Importa el archivo CSS externo */
</style>