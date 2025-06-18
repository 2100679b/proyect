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
                <input 
                  type="text" 
                  id="nombreDisp" 
                  ref="nombreDisp" 
                  class="form-control" 
                  v-model="dispositivo.nombre" 
                  required
                  aria-describedby="Nombre" 
                  placeholder="Nombre del dispositivo"
                />
                <label for="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
              </div>
              <div class="form-floating p-1">
                <input 
                  type="text" 
                  id="ubicacion" 
                  ref="ubicacion" 
                  class="form-control" 
                  v-model="dispositivo.ubicacion" 
                  required
                  aria-describedby="Ubicacion" 
                  placeholder="Ubicacion"
                />
                <label for="ubicacion" class="form-text text-muted">Ubicación</label>
              </div>
              <div class="form-floating p-1">
                <input 
                  type="text" 
                  id="coordenadas" 
                  ref="coordenadas" 
                  class="form-control" 
                  v-model="dispositivo.coordenadas" 
                  aria-describedby="Coordenadas" 
                  placeholder="Coordenadas"
                />
                <label for="coordenadas" class="form-text text-muted">Coordenadas</label>
              </div>
            </form>
            </div>
            <div class="row p-2">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-danger" role="alert" v-if="alerta.mensaje">
                <strong>¡Error!</strong>
                <p v-html="alerta.mensaje"></p>
                </div>
                <div class="alert alert-success" role="alert" v-if="alerta.exito">
                <strong>¡Éxito!</strong>
                <p v-html="alerta.exito"></p>
                </div>
            </div>
        </div>
        <div class="row p-2">
            <div class="col">
                <button 
                  class="btn btn-outline-success" 
                  type="button" 
                  @click="guardar()" 
                  :disabled="guardando"
                > 
                  <i class="bi bi-box-arrow-in-right"></i> 
                  {{ guardando ? 'Guardando...' : 'Guardar' }}
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="limpiar()"> 
                  <i class="bi bi-x-circle"></i> Cancelar 
                </button>
            </div>
        </div>
    </div>
</div>
</template>
      
<script>
import axios from 'axios'

export default  {
    name: 'RegistroDispositivo',
    components: {
    },
    data: function() {
        return { 
        dispositivo: {
            nombre: '',
            ubicacion: '',
            coordenadas: '19.7060° N, 101.1950° W',
            potencia: { 
              nominal: 7.400, 
              minimo: 6.200, 
              maximo: 8.600, 
              um: 'KW' 
            },
            voltaje: { 
              nominal: 240, 
              minimo: 230, 
              maximo: 250, 
              um: 'Volts' 
            },
            corriente: { 
              nominal: 30, 
              minimo: 25, 
              maximo: 35, 
              um: 'Amperes' 
            },
            caudal: { 
              nominal: 1, 
              minimo: 0.10, 
              maximo: 1.20, 
              um: 'm3/minuto' 
            }
        },
        alerta: {
            mensaje: '',
            exito: ''
        },
        guardando: false
        };
    },
    computed: {
    }, 
    methods: {
      async guardar() {
        // Limpiar alertas previas
        this.alerta.mensaje = '';
        this.alerta.exito = '';
        
        // Validaciones básicas
        if (!this.dispositivo.nombre.trim()) {
          this.alerta.mensaje = 'El nombre del dispositivo es requerido';
          return;
        }
        
        if (!this.dispositivo.ubicacion.trim()) {
          this.alerta.mensaje = 'La ubicación es requerida';
          return;
        }

        this.guardando = true;

        try {
          // Obtener token de autenticación (ajusta según tu implementación)
          const token = this.$store.state.token || localStorage.getItem('token');
          
          if (!token) {
            this.alerta.mensaje = 'No hay sesión activa. Por favor inicia sesión.';
            this.guardando = false;
            return;
          }

          // Preparar datos para enviar al backend
          const dispositivoData = {
            nombre: this.dispositivo.nombre.trim(),
            ubicacion: this.dispositivo.ubicacion.trim(),
            coordenadas: this.dispositivo.coordenadas.trim(),
            potencia: this.dispositivo.potencia,
            voltaje: this.dispositivo.voltaje,
            corriente: this.dispositivo.corriente,
            caudal: this.dispositivo.caudal
          };

          // Configurar URL del backend (reemplaza con la URL real de tu backend)
          const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://18.119.167.171:3001'; // o tu URL de backend
          
          // Realizar petición POST al backend
          const response = await axios.post(`${API_BASE_URL}/api/dispositivos`, dispositivoData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          // Si llegamos aquí, el dispositivo se guardó exitosamente
          this.alerta.exito = 'Dispositivo registrado exitosamente';
          
          // Actualizar store si estás usando Vuex
          if (this.$store.state.dispositivos) {
            const dispositivos = [...this.$store.state.dispositivos, response.data];
            this.$store.commit('setDispositivos', dispositivos);
          }

          // Limpiar formulario después de un pequeño delay para mostrar el mensaje
          setTimeout(() => {
            this.limpiar();
          }, 2000);

        } catch (error) {
          console.error('Error al guardar dispositivo:', error);
          
          if (error.response) {
            // Error del servidor
            if (error.response.status === 400) {
              this.alerta.mensaje = error.response.data.error || 'Datos inválidos';
            } else if (error.response.status === 401) {
              this.alerta.mensaje = 'Sesión expirada. Por favor inicia sesión nuevamente.';
            } else if (error.response.status === 500) {
              this.alerta.mensaje = 'Error interno del servidor. Intenta nuevamente.';
            } else {
              this.alerta.mensaje = error.response.data.error || 'Error al guardar el dispositivo';
            }
          } else if (error.request) {
            // Error de red
            this.alerta.mensaje = 'Error de conexión. Verifica tu conexión a internet.';
          } else {
            // Otro tipo de error
            this.alerta.mensaje = 'Error inesperado. Intenta nuevamente.';
          }
        } finally {
          this.guardando = false;
        }
      },
      
      limpiar() {
        this.dispositivo = {
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          potencia: { 
            nominal: 7.400, 
            minimo: 6.200, 
            maximo: 8.600, 
            um: 'KW' 
          },
          voltaje: { 
            nominal: 240, 
            minimo: 230, 
            maximo: 250, 
            um: 'Volts' 
          },
          corriente: { 
            nominal: 30, 
            minimo: 25, 
            maximo: 35, 
            um: 'Amperes' 
          },
          caudal: { 
            nominal: 1, 
            minimo: 0.10, 
            maximo: 1.20, 
            um: 'm3/minuto' 
          }
        };
        this.alerta.mensaje = '';
        this.alerta.exito = '';
        
        // Navegar de vuelta al listado de dispositivos
        this.$router.push('/menu/dispositivos');
      }    
    }
}
</script>