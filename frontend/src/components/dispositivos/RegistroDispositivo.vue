<template>
<div id="login" class="card bg-trasparent mb-3 record-card">
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
                        id="nombre" 
                        ref="nombre" 
                        class="form-control" 
                        v-model="dispositivo.nombre" 
                        v-on:keyup.enter="focusUbicacion()" 
                        aria-describedby="Nombre" 
                        placeholder="Nombre del dispositivo"
                        required
                        minlength="3"
                    />
                    <label for="nombre" class="form-text text-muted">Nombre del dispositivo</label>
                </div>
                
                <div class="form-floating p-1">
                    <input 
                        type="text" 
                        id="ubicacion" 
                        ref="ubicacion" 
                        class="form-control" 
                        v-model="dispositivo.ubicacion" 
                        v-on:keyup.enter="focusCoordenadas()" 
                        aria-describedby="Ubicacion" 
                        placeholder="Ubicacion"
                        required
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
                        placeholder="19.7060° N, 101.1950° W"
                        pattern="^\d{1,2}\.\d{4}°\s[NS],\s\d{1,3}\.\d{4}°\s[EW]$"
                        title="Formato: XX.XXXX° N/S, XXX.XXXX° E/W"
                    />
                    <label for="coordenadas" class="form-text text-muted">Coordenadas (opcional)</label>
                    <div class="form-text">Ejemplo: 19.7060° N, 101.1950° W</div>
                </div>

                <!-- Sección de Potencia -->
                <div class="accordion mt-3" id="accordionDispositivo">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingPotencia">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePotencia">
                                <i class="bi bi-lightning-fill me-2"></i>
                                Configuración de Potencia
                            </button>
                        </h2>
                        <div id="collapsePotencia" class="accordion-collapse collapse" data-bs-parent="#accordionDispositivo">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <input type="number" class="form-control" id="potenciaValor" 
                                                   v-model.number="dispositivo.potencia.valor" step="0.01" min="0">
                                            <label for="potenciaValor">Valor</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <select class="form-select" id="potenciaUnidad" v-model="dispositivo.potencia.unidad">
                                                <option value="W">Watts (W)</option>
                                                <option value="KW">Kilowatts (KW)</option>
                                                <option value="MW">Megawatts (MW)</option>
                                            </select>
                                            <label for="potenciaUnidad">Unidad</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de Voltaje -->
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingVoltaje">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVoltaje">
                                <i class="bi bi-battery-full me-2"></i>
                                Configuración de Voltaje
                            </button>
                        </h2>
                        <div id="collapseVoltaje" class="accordion-collapse collapse" data-bs-parent="#accordionDispositivo">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <input type="number" class="form-control" id="voltajeValor" 
                                                   v-model.number="dispositivo.voltaje.valor" step="0.1" min="0">
                                            <label for="voltajeValor">Valor</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <select class="form-select" id="voltajeUnidad" v-model="dispositivo.voltaje.unidad">
                                                <option value="V">Voltios (V)</option>
                                                <option value="KV">Kilovoltios (KV)</option>
                                            </select>
                                            <label for="voltajeUnidad">Unidad</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de Corriente -->
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingCorriente">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCorriente">
                                <i class="bi bi-arrow-right-circle me-2"></i>
                                Configuración de Corriente
                            </button>
                        </h2>
                        <div id="collapseCorriente" class="accordion-collapse collapse" data-bs-parent="#accordionDispositivo">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <input type="number" class="form-control" id="corrienteValor" 
                                                   v-model.number="dispositivo.corriente.valor" step="0.1" min="0">
                                            <label for="corrienteValor">Valor</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <select class="form-select" id="corrienteUnidad" v-model="dispositivo.corriente.unidad">
                                                <option value="A">Amperes (A)</option>
                                                <option value="mA">Miliamperes (mA)</option>
                                            </select>
                                            <label for="corrienteUnidad">Unidad</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de Caudal -->
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingCaudal">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCaudal">
                                <i class="bi bi-droplet-fill me-2"></i>
                                Configuración de Caudal
                            </button>
                        </h2>
                        <div id="collapseCaudal" class="accordion-collapse collapse" data-bs-parent="#accordionDispositivo">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <input type="number" class="form-control" id="caudalValor" 
                                                   v-model.number="dispositivo.caudal.valor" step="0.01" min="0">
                                            <label for="caudalValor">Valor</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating mb-2">
                                            <select class="form-select" id="caudalUnidad" v-model="dispositivo.caudal.unidad">
                                                <option value="L/min">Litros por minuto (L/min)</option>
                                                <option value="L/s">Litros por segundo (L/s)</option>
                                                <option value="m3/min">Metros cúbicos por minuto (m³/min)</option>
                                                <option value="m3/h">Metros cúbicos por hora (m³/h)</option>
                                                <option value="GPM">Galones por minuto (GPM)</option>
                                            </select>
                                            <label for="caudalUnidad">Unidad</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <i class="bi bi-check-circle" v-if="!guardando"></i>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="guardando"></span>
                    {{ guardando ? 'Guardando...' : 'Guardar' }}
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="limpiar()"> 
                    <i class="bi bi-arrow-left"></i> Cancelar 
                </button>
            </div>
        </div>
    </div>
</div>
</template>
      
<script>
import axios from 'axios'

export default {
    name: 'RegistroDispositivo',
    data() {
        return { 
            dispositivo: {
                nombre: '',
                ubicacion: '',
                coordenadas: '19.7060° N, 101.1950° W',
                potencia: {
                    valor: null,
                    unidad: 'KW'
                },
                voltaje: {
                    valor: null,
                    unidad: 'V'
                },
                corriente: {
                    valor: null,
                    unidad: 'A'
                },
                caudal: {
                    valor: null,
                    unidad: 'L/min'
                }
            },
            alerta: {
                mensaje: '',
                exito: ''
            },
            guardando: false
        }
    },
    computed: {
        // URL base de la API
        apiUrl() {
            if (process.env.NODE_ENV === 'production') {
                return '' // Usa rutas relativas para el proxy
            }
            return process.env.VUE_APP_API_URL || 'http://18.119.167.171:3000'
        }
    }, 
    methods: {
        // Métodos de navegación entre campos
        focusUbicacion() {
            this.$refs.ubicacion.focus()
        },
        
        focusCoordenadas() {
            this.$refs.coordenadas.focus()
        },
        
        // Obtener token de autenticación
        getAuthToken() {
            try {
                return localStorage.getItem('auth_token') || localStorage.getItem('token')
            } catch (error) {
                console.warn('No se pudo acceder al localStorage:', error)
                return null
            }
        },
        
        // Obtener headers para peticiones
        getHeaders() {
            const token = this.getAuthToken()
            const headers = {
                'Content-Type': 'application/json'
            }
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
            
            return headers
        },
        
        // Validar formato de coordenadas
        validarCoordenadas(coordenadas) {
            if (!coordenadas) return true // Es opcional
            const regex = /^\d{1,2}\.\d{4}°\s[NS],\s\d{1,3}\.\d{4}°\s[EW]$/
            return regex.test(coordenadas)
        },
        
        // Validar formulario
        validarFormulario() {
            // Limpiar mensajes anteriores
            this.alerta.mensaje = ''
            
            if (!this.dispositivo.nombre || !this.dispositivo.nombre.trim()) {
                this.alerta.mensaje = 'El nombre del dispositivo es requerido'
                this.$refs.nombre.focus()
                return false
            }
            
            if (this.dispositivo.nombre.trim().length < 3) {
                this.alerta.mensaje = 'El nombre debe tener al menos 3 caracteres'
                this.$refs.nombre.focus()
                return false
            }
            
            if (!this.dispositivo.ubicacion || !this.dispositivo.ubicacion.trim()) {
                this.alerta.mensaje = 'La ubicación es requerida'
                this.$refs.ubicacion.focus()
                return false
            }
            
            if (this.dispositivo.coordenadas && !this.validarCoordenadas(this.dispositivo.coordenadas)) {
                this.alerta.mensaje = 'Formato de coordenadas inválido. Use: XX.XXXX° N/S, XXX.XXXX° E/W'
                this.$refs.coordenadas.focus()
                return false
            }
            
            // Validar que si se proporciona un valor, también se proporcione la unidad
            const mediciones = ['potencia', 'voltaje', 'corriente', 'caudal']
            for (const medicion of mediciones) {
                const dato = this.dispositivo[medicion]
                if (dato.valor !== null && dato.valor !== undefined && dato.valor !== '') {
                    if (!dato.unidad) {
                        this.alerta.mensaje = `Debe especificar la unidad para ${medicion}`
                        return false
                    }
                    if (dato.valor <= 0) {
                        this.alerta.mensaje = `El valor de ${medicion} debe ser mayor a 0`
                        return false
                    }
                }
            }
            
            return true
        },

        // Preparar datos para envío
        prepararDatos() {
            const datos = {
                nombre: this.dispositivo.nombre.trim(),
                ubicacion: this.dispositivo.ubicacion.trim(),
                coordenadas: this.dispositivo.coordenadas || undefined
            }
            
            // Solo incluir mediciones que tengan valor
            const mediciones = ['potencia', 'voltaje', 'corriente', 'caudal']
            mediciones.forEach(medicion => {
                const dato = this.dispositivo[medicion]
                if (dato.valor !== null && dato.valor !== undefined && dato.valor !== '' && dato.valor > 0) {
                    datos[medicion] = {
                        valor: parseFloat(dato.valor),
                        unidad: dato.unidad
                    }
                }
            })
            
            return datos
        },

        async guardar() {
            // Limpiar alertas anteriores
            this.alerta.mensaje = ''
            this.alerta.exito = ''
            
            // Validar formulario
            if (!this.validarFormulario()) {
                return
            }

            this.guardando = true

            try {
                // Preparar datos para envío
                const dispositivoData = this.prepararDatos()
                
                console.log('Enviando datos:', dispositivoData) // Para debug

                // Realizar petición POST al backend
                const response = await axios.post(
                    `${this.apiUrl}/api/dispositivos`, 
                    dispositivoData,
                    {
                        headers: this.getHeaders(),
                        timeout: 10000 // 10 segundos de timeout
                    }
                )

                // Si la respuesta es exitosa
                if (response.status === 200 || response.status === 201) {
                    const mensaje = response.data.message || 'Dispositivo registrado exitosamente'
                    this.alerta.exito = mensaje
                    
                    // Actualizar el store local si existe
                    if (this.$store && this.$store.state.dispositivos) {
                        const dispositivos = [...this.$store.state.dispositivos]
                        dispositivos.push(response.data.dispositivo || response.data)
                        this.$store.commit('setDispositivos', dispositivos)
                    }
                    
                    // Emitir evento para componente padre si es necesario
                    this.$emit('dispositivo-creado', response.data.dispositivo || response.data)
                    
                    // Limpiar formulario después de un breve delay
                    setTimeout(() => {
                        this.limpiar()
                    }, 2000)
                }

            } catch (error) {
                console.error('Error al guardar dispositivo:', error)
                
                // Manejar diferentes tipos de errores
                if (error.response) {
                    // El servidor respondió con un código de error
                    const status = error.response.status
                    const data = error.response.data
                    
                    switch (status) {
                        case 400:
                            this.alerta.mensaje = data.error || 'Datos inválidos. Verificar la información ingresada.'
                            break
                        case 401:
                            this.alerta.mensaje = 'No autorizado. Por favor, inicie sesión nuevamente.'
                            // Redirigir al login si es necesario
                            if (this.$router) {
                                this.$router.push('/login')
                            }
                            break
                        case 409:
                            this.alerta.mensaje = data.error || 'Ya existe un dispositivo con ese nombre.'
                            break
                        case 422:
                            this.alerta.mensaje = 'Datos de entrada no válidos. Verificar formato.'
                            break
                        case 500:
                            this.alerta.mensaje = 'Error interno del servidor. Intente más tarde.'
                            break
                        default:
                            this.alerta.mensaje = data.error || `Error del servidor (${status})`
                    }
                } else if (error.request) {
                    // La petición se hizo pero no hubo respuesta
                    this.alerta.mensaje = 'No se pudo conectar con el servidor. Verificar conexión a internet.'
                } else if (error.code === 'ECONNABORTED') {
                    // Timeout
                    this.alerta.mensaje = 'La petición tardó demasiado. Intente nuevamente.'
                } else {
                    // Error en la configuración de la petición
                    this.alerta.mensaje = 'Error al procesar la petición. Intente nuevamente.'
                }
            } finally {
                this.guardando = false
            }
        },
        
        limpiar() {
            this.dispositivo = {
                nombre: '',
                ubicacion: '',
                coordenadas: '19.7060° N, 101.1950° W',
                potencia: {
                    valor: null,
                    unidad: 'KW'
                },
                voltaje: {
                    valor: null,
                    unidad: 'V'
                },
                corriente: {
                    valor: null,
                    unidad: 'A'
                },
                caudal: {
                    valor: null,
                    unidad: 'L/min'
                }
            }
            this.alerta.mensaje = ''
            this.alerta.exito = ''
            
            // Navegar de vuelta si el router existe
            if (this.$router) {
                this.$router.push('/menu/dispositivos')
            }
        }    
    },
    
    mounted() {
        // Enfocar el primer campo al cargar
        this.$nextTick(() => {
            if (this.$refs.nombre) {
                this.$refs.nombre.focus()
            }
        })
    }
}
</script>
      
<style scoped>
.record-card {
    max-width: 600px;
    min-width: 400px;
    width: 100%;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

.form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.form-select:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.alert {
    margin-top: 10px;
}

.accordion-button {
    font-weight: 500;
}

.accordion-button:not(.collapsed) {
    background-color: #e7f3ff;
    color: #0c63e4;
}

.form-text {
    font-size: 0.875em;
    color: #6c757d;
}

.bi {
    display: inline-block;
    vertical-align: -.125em;
    fill: currentColor;
}
</style>