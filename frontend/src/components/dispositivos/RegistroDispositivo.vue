<template>
  <div id="registro-dispositivo" class="card registro-card">
    <div class="card-body">
      <div class="text-center mb-4">
        <h4 class="card-title">
          <i class="bi bi-cpu-fill"></i> Registro de Nuevo Dispositivo
        </h4>
        <hr class="card-divider" />
      </div>

      <form @submit.prevent="guardar">
        <div class="form-floating mb-3">
          <input
            type="text"
            id="identificador"
            ref="identificador"
            class="form-control"
            :class="{ 'is-invalid': !isIdentificadorValid && dispositivo.identifica.identificador }"
            v-model="dispositivo.identifica.identificador"
            @input="validateIdentificador"
            placeholder="Identificador único del dispositivo"
            required
          />
          <label for="identificador">Identificador</label>
          <div class="invalid-feedback" v-if="!isIdentificadorValid">
            El identificador debe ser un número entero.
          </div>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            id="nombreDisp"
            ref="nombreDisp"
            class="form-control"
            v-model="dispositivo.identifica.nombre"
            placeholder="Nombre del dispositivo (ej. Bomba Principal)"
            required
          />
          <label for="nombreDisp">Nombre del dispositivo</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            id="ubicacion"
            ref="ubicacion"
            class="form-control"
            v-model="dispositivo.identifica.ubicacion"
            placeholder="Ubicación del dispositivo (ej. Planta Baja, Sector A)"
            required
          />
          <label for="ubicacion">Ubicación</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            id="coordenadas"
            ref="coordenadas"
            class="form-control"
            v-model="dispositivo.identifica.coordenadas"
            placeholder="Coordenadas (ej. 19.7060° N, 101.1950° W)"
            disabled
            title="Las coordenadas se establecen automáticamente"
          />
          <label for="coordenadas">Coordenadas</label>
        </div>
      </form>

      <div class="row p-2" v-if="alerta.mensaje">
        <div class="col-12">
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <strong>¡Error!</strong>
            <p v-html="alerta.mensaje"></p>
            <button type="button" class="btn-close" @click="alerta.mensaje = ''" aria-label="Close"></button>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button class="btn btn-success registro-btn" type="button" @click="guardar()">
          <i class="bi bi-save-fill"></i> Guardar
        </button>
        <button class="btn btn-secondary registro-btn" type="button" @click="limpiar()">
          <i class="bi bi-arrow-counterclockwise"></i> Limpiar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// El import de sessionStorage no parece usarse directamente en este código.
// Si se usa en otra parte del proyecto (ej. en Vuex store), es correcto mantenerlo.
// Si no, podría ser removido si no tiene un propósito directo aquí.
import sessionStorage from '@/servicios/SessionStore'; // Mantener si se usa en el store o en otra lógica

export default {
  name: 'RegistroDispositivo',
  components: {
    // Si no hay componentes hijos aquí, esta sección puede ser eliminada.
  },
  data: function() {
    return {
      dispositivo: {
        identifica: {
          identificador: null, // Cambiado a null para facilitar validación de "vacío"
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W', // Mantener por defecto
          idEstatus: 1,
          estatus: 'Operacion Normal',
          potencia: { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
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
      },
      alerta: {
        mensaje: '',
      },
      isIdentificadorValid: true, // Para la validación del identificador
    };
  },
  methods: {
    /**
     * Valida que el identificador sea un número entero.
     * Se llama al escribir en el campo de identificador.
     */
    validateIdentificador() {
      // Eliminar espacios en blanco y verificar si es un número entero
      const cleanedId = String(this.dispositivo.identifica.identificador).trim();
      this.isIdentificadorValid = /^\d+$/.test(cleanedId) || cleanedId === '';
    },
    /**
     * Maneja el proceso de guardar un nuevo dispositivo.
     * Realiza una validación básica antes de guardar.
     */
    guardar() {
      this.alerta.mensaje = ''; // Limpiar mensajes de alerta previos

      // Validar campos obligatorios
      if (!this.dispositivo.identifica.identificador || String(this.dispositivo.identifica.identificador).trim() === '') {
        this.alerta.mensaje = 'El <strong>Identificador</strong> es obligatorio.';
        this.$refs.identificador.focus();
        return;
      }
      if (!this.isIdentificadorValid) {
        this.alerta.mensaje = 'El <strong>Identificador</strong> debe ser un número entero válido.';
        this.$refs.identificador.focus();
        return;
      }
      if (!this.dispositivo.identifica.nombre.trim()) {
        this.alerta.mensaje = 'El <strong>Nombre del dispositivo</strong> es obligatorio.';
        this.$refs.nombreDisp.focus();
        return;
      }
      if (!this.dispositivo.identifica.ubicacion.trim()) {
        this.alerta.mensaje = 'La <strong>Ubicación</strong> es obligatoria.';
        this.$refs.ubicacion.focus();
        return;
      }

      // Asegurar que el identificador sea un número para Vuex/almacenamiento
      this.dispositivo.identifica.identificador = parseInt(this.dispositivo.identifica.identificador, 10);

      // Lógica para agregar el dispositivo al store de Vuex
      // Asume que 'dispositivos' es un array en tu store
      let dispositivos = this.$store.state.dispositivos || []; // Asegura que sea un array
      
      // Simular la generación de un identificador único si no es 0
      // En un entorno real, esto vendría de un backend
      if (this.dispositivo.identifica.identificador === 0 || isNaN(this.dispositivo.identifica.identificador)) {
        this.dispositivo.identifica.identificador = dispositivos.length > 0
          ? Math.max(...dispositivos.map(d => d.identifica.identificador)) + 1
          : 1;
      }


      dispositivos.push({ ...this.dispositivo }); // Se hace una copia para evitar mutaciones reactivas indeseadas
      this.$store.commit('setDispositivos', dispositivos);

      // Limpiar el formulario y redirigir
      this.limpiar();
    },
    /**
     * Limpia el formulario y redirige a la lista de dispositivos.
     */
    limpiar() {
      this.dispositivo = {
        identifica: {
          identificador: null,
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          idEstatus: 1, // Restablecer estatus a normal
          estatus: 'Operacion Normal',
          potencia: { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
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
          idEstatus: 1,
          estatus: 'Operacion Normal',
          fechaRegistro: new Date().toUTCString()
        },
        estado: 1
      };
      this.alerta.mensaje = ''; // Limpiar mensaje de alerta
      this.isIdentificadorValid = true; // Restablecer validación
      this.$router.push('/menu/dispositivos'); // Redirigir al listado
    },
    // No se necesita tfPassword() ya que no hay campo de contraseña ni lógica asociada
  },
  mounted() {
    // Si quieres que el identificador se enfoque al cargar el componente
    this.$nextTick(() => {
      if (this.$refs.identificador) {
        this.$refs.identificador.focus();
      }
    });
  }
};
</script>

<style scoped>
@import './RegistroDispositivo.css'; /* Importa el archivo CSS externo */
</style>