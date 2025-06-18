<template>
<div id="login" class="card bg-trasparent mb-3 record-card" >
    <div class="card-body">
    <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">Registro Dispositivo</h4>
        <hr />
    </div>
    <div class="row p-1"> 
        <form>
              <div class="form-floating p-1">
                <input type="text" id="identificador" ref="identificador" class="form-control" v-model="dispositivo.identifica.identificador" v-on:keyup.enter="tfPassword()" aria-describedby="Id" placeholder="Identificador"/>
                <label id="identificador" class="form-text text-muted">Identificador</label>
              </div>            
              <div class="form-floating p-1">
                <input type="text" id="nombreDisp" ref="nombreDisp" class="form-control" v-model="dispositivo.identifica.nombre" v-on:keyup.enter="" aria-describedby="Nombre" placeholder="Nombre del dispositivo"/>
                <label id="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
              </div>
              <div class="form-floating p-1">
                <input type="text" id="ubicacion" ref="ubicacion" class="form-control" v-model="dispositivo.identifica.ubicacion" v-on:keyup.enter="" aria-describedby="Ubicacion" placeholder="Ubicacion"/>
                <label id="ubicacion" class="form-text text-muted">Ubicación</label>
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
                <button class="btn btn-outline-success" type="button" @click="guardar()" :disabled="guardando"> 
                    <i class="bi bi-box-arrow-in-right" v-if="!guardando"></i>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="guardando"></span>
                    {{ guardando ? 'Guardando...' : 'Guardar' }}
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="limpiar()"> <i class="bi bi-box-arrow-in-right"></i> Cancelar </button>
            </div>
        </div>
    </div>
</div>
</template>
      
<script>
import sessionStorage from '@/servicios/SessionStore'
import axios from 'axios'

export default  {
    name: 'RegistroDispositivo',
    components: {
    },
    data: function() {
        return { 
        dispositivo: {
          identifica: {
            identificador: 0,
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
            idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
            estatus: 'Operacion Normal',
            fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
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
        // Validar campos requeridos
        if (!this.dispositivo.identifica.identificador || !this.dispositivo.identifica.nombre || !this.dispositivo.identifica.ubicacion) {
          this.alerta.mensaje = 'Por favor, complete todos los campos requeridos'
          this.alerta.exito = ''
          return
        }

        this.guardando = true
        this.alerta.mensaje = ''
        this.alerta.exito = ''

        try {
          // Realizar petición POST al backend
          const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/dispositivos`, this.dispositivo, {
            headers: {
              'Content-Type': 'application/json',
              // Agregar token de autenticación si es necesario
              // 'Authorization': `Bearer ${sessionStorage.getToken()}`
            }
          })

          // Si la respuesta es exitosa
          if (response.status === 200 || response.status === 201) {
            this.alerta.exito = 'Dispositivo registrado exitosamente'
            
            // Actualizar el store local con la respuesta del servidor
            let dispositivos = this.$store.state.dispositivos
            dispositivos.push(response.data)
            this.$store.commit('setDispositivos', dispositivos)
            
            // Limpiar formulario después de un breve delay
            setTimeout(() => {
              this.limpiar()
            }, 1500)
          }

        } catch (error) {
          console.error('Error al guardar dispositivo:', error)
          
          // Manejar diferentes tipos de errores
          if (error.response) {
            // El servidor respondió con un código de error
            const status = error.response.status
            const data = error.response.data
            
            if (status === 400) {
              this.alerta.mensaje = data.message || 'Datos inválidos. Verificar la información ingresada.'
            } else if (status === 401) {
              this.alerta.mensaje = 'No autorizado. Verificar credenciales.'
            } else if (status === 409) {
              this.alerta.mensaje = 'El dispositivo ya existe con ese identificador.'
            } else if (status === 500) {
              this.alerta.mensaje = 'Error interno del servidor. Intente más tarde.'
            } else {
              this.alerta.mensaje = `Error del servidor: ${data.message || 'Error desconocido'}`
            }
          } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            this.alerta.mensaje = 'No se pudo conectar con el servidor. Verificar conexión.'
          } else {
            // Error en la configuración de la petición
            this.alerta.mensaje = 'Error al procesar la petición.'
          }
        } finally {
          this.guardando = false
        }
      },
      
      limpiar() {
        this.dispositivo = {
          identifica: {
            identificador: 0,
            nombre: '',
            ubicacion: '',
            coordenadas: '19.7060° N, 101.1950° W',
            idestatus: 1,
            estatus: 'Operacion Normal',
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
            idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
            estatus: 'Operacion Normal',
            fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
        }
        this.alerta.mensaje = ''
        this.alerta.exito = ''
        this.$router.push('/menu/dispositivos')
      }    
    }
}
</script>
      
<style scoped>
.record-card {
    max-width: 500px;
    min-width: 400px;
    width: 100%;
    /*background:  url('@/assets/img/background.png') repeat-x scroll;*/
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}
</style>