<template>
<div id="login" class="card bg-trasparent mb-3 record-card" >
    <div class="card-body">
    <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">Registro Dispositivo</h4>
        <hr />
    </div>
    <div class="row p-1"> 
        <form @submit.prevent="guardar">
              <div class="form-floating p-1">
                <input type="text" id="nombreDisp" ref="nombreDisp" class="form-control" 
                       v-model="dispositivo.identifica.nombre" required
                       aria-describedby="Nombre" placeholder="Nombre del dispositivo"/>
                <label for="nombreDisp" class="form-text text-muted">Nombre del dispositivo *</label>
              </div>
              <div class="form-floating p-1">
                <input type="text" id="ubicacion" ref="ubicacion" class="form-control" 
                       v-model="dispositivo.identifica.ubicacion" required
                       aria-describedby="Ubicacion" placeholder="Ubicacion"/>
                <label for="ubicacion" class="form-text text-muted">Ubicación *</label>
              </div>
              <div class="form-floating p-1">
                <input type="text" id="coordenadas" class="form-control" 
                       v-model="dispositivo.identifica.coordenadas" required
                       placeholder="Coordenadas"/>
                <label for="coordenadas" class="form-text text-muted">Coordenadas *</label>
              </div>
            </form>
            </div>
            <div class="row p-2">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                <button class="btn btn-outline-secondary" type="button" @click="limpiar"> 
                    <i class="bi bi-box-arrow-in-right"></i> Cancelar 
                </button>
            </div>
        </div>
    </div>
</div>
</template>
      
<script>
import axios from 'axios';

export default  {
    name: 'RegistroDispositivo',
    data() {
        return { 
        dispositivo: {
          identifica: {
            identificador: 0,  // Este será generado por la base de datos
            nombre: '',
            ubicacion: '',
            coordenadas: '19.7060° N, 101.1950° W',
            idestatus: 1,
            estatus: 'Operacion Normal',
            potencia:  { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
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
        },
        alerta: {
            mensaje: '',
        }
        };
    },
    mounted() {
        this.$refs.nombreDisp.focus();
    },
    methods: {
      async guardar() {
        // Validación básica
        if (!this.dispositivo.identifica.nombre.trim()) {
            this.alerta.mensaje = 'El nombre del dispositivo es obligatorio';
            return;
        }
        
        if (!this.dispositivo.identifica.ubicacion.trim()) {
            this.alerta.mensaje = 'La ubicación es obligatoria';
            return;
        }
        
        try {
            // Preparar datos para la base de datos
            const payload = {
                nombre: this.dispositivo.identifica.nombre,
                ubicacion: this.dispositivo.identifica.ubicacion,
                coordenadas: this.dispositivo.identifica.coordenadas,
                potencia: this.dispositivo.identifica.potencia,
                voltaje: this.dispositivo.identifica.voltaje,
                corriente: this.dispositivo.identifica.corriente,
                caudal: this.dispositivo.identifica.caudal,
                estado: this.dispositivo.estado,
                registro_usuario: this.$store.state.usuario.id || 0 // Obtener ID de usuario del store
            };

            // Enviar a la API
            const response = await axios.post('https://tu-api-aws.com/dispositivos', payload);
            
            if (response.status === 201) {
                // Actualizar dispositivo con ID generado
                this.dispositivo.identifica.identificador = response.data.id;
                
                // Agregar al store local
                let dispositivos = this.$store.state.dispositivos;
                dispositivos.push(JSON.parse(JSON.stringify(this.dispositivo)));
                this.$store.commit('setDispositivos', dispositivos);
                
                this.limpiar();
            }
        } catch (error) {
            console.error('Error al guardar dispositivo:', error);
            
            if (error.response && error.response.status === 409) {
                this.alerta.mensaje = 'El nombre del dispositivo ya existe. Por favor, elige otro nombre.';
            } else {
                this.alerta.mensaje = 'Error al guardar el dispositivo. Por favor, inténtelo de nuevo.';
            }
        }
      },
      
      limpiar() {
        this.dispositivo = {
          identifica: {
            identificador: 0,
            nombre: '',
            ubicacion: '',
            coordenadas: '19.7060° N, 101.1950° W',
            potencia:  { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
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
        
        this.$router.push('/menu/dispositivos');
      }    
    }
}
</script>