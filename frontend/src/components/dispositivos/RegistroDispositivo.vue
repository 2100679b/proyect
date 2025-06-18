<template>
  <div id="login" class="card bg-transparent mb-3 record-card">
    <div class="card-body">
      <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">Registro Dispositivo</h4>
        <hr />
      </div>
      <div class="row p-1"> 
        <form @submit.prevent>
          <div class="form-floating p-1">
            <input type="text" id="identificador" class="form-control"
              v-model="dispositivo.identifica.identificador"
              @keyup.enter="tfPassword"
              placeholder="Identificador" />
            <label for="identificador" class="form-text text-muted">Identificador</label>
          </div>            
          <div class="form-floating p-1">
            <input type="text" id="nombreDisp" class="form-control"
              v-model="dispositivo.identifica.nombre"
              placeholder="Nombre del dispositivo" />
            <label for="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
          </div>
          <div class="form-floating p-1">
            <input type="text" id="ubicacion" class="form-control"
              v-model="dispositivo.identifica.ubicacion"
              placeholder="Ubicación" />
            <label for="ubicacion" class="form-text text-muted">Ubicación</label>
          </div>
        </form>
      </div>

      <div class="row p-2">
        <div class="col-12">
          <div class="alert alert-danger" role="alert" v-if="alerta.mensaje">
            <strong>¡Error!</strong>
            <p v-html="alerta.mensaje"></p>
          </div>
        </div>
      </div>

      <div class="row p-2">
        <div class="col">
          <button class="btn btn-outline-success" type="button" @click="guardar">
            <i class="bi bi-box-arrow-in-right"></i> Guardar
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="cancelar">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Elimina esta línea si no usas sessionStorage
// import sessionStorage from '@/servicios/SessionStore'

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      dispositivo: this.nuevoDispositivo(),
      alerta: {
        mensaje: '',
      }
    };
  },
  methods: {
    nuevoDispositivo() {
      return {
        identifica: {
          identificador: 0,
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          idestatus: 1,
          estatus: 'Operacion Normal',
          potencia: { nominal: 7.4, minimo: 6.2, maximo: 8.6, um: 'KW' },
          voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
          corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
          caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
          fechaRegistro: new Date().toUTCString()
        },
        opera: {
          potencia: { valor: 7.2, idEstatus: 1 },
          voltaje: { valor: 240, idEstatus: 1 },
          corriente: { valor: 30, idEstatus: 1 },
          caudal: { valor: 1, idEstatus: 1 },
          idEstatus: 1,
          estatus: 'Operacion Normal',
          fechaRegistro: new Date().toUTCString()
        },
        estado: 1
      };
    },
    guardar() {
      try {
        const dispositivos = this.$store.state.dispositivos;
        dispositivos.push(this.dispositivo);
        this.$store.commit('setDispositivos', dispositivos);
        this.limpiar();
      } catch (e) {
        this.alerta.mensaje = 'No se pudo guardar el dispositivo.';
        console.error(e);
      }
    },
    limpiar() {
      this.dispositivo = this.nuevoDispositivo();
    },
    cancelar() {
      this.limpiar();
      this.$router.push('/menu/dispositivos');
    },
    tfPassword() {
      // lógica en caso de que quieras hacer algo al presionar enter
    }
  }
}
</script>

<style scoped>
.record-card {
  max-width: 500px;
  min-width: 400px;
  width: 100%;
}
</style>
