<template>
<div id="registro-dispositivo" class="card bg-transparent mb-3">
    <div class="card-body">
        <div class="text-center">
            <h4 class="card-title">Registro Dispositivo</h4>
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
                        required
                        placeholder="Nombre del dispositivo"
                    />
                    <label for="nombre">Nombre del dispositivo *</label>
                </div>
                <div class="form-floating p-1">
                    <input 
                        type="text"
                        id="ubicacion"
                        class="form-control"
                        v-model="dispositivo.ubicacion"
                        required
                        placeholder="Ubicación"
                    />
                    <label for="ubicacion">Ubicación *</label>
                </div>
                <div class="form-floating p-1">
                    <input 
                        type="text"
                        id="coordenadas"
                        class="form-control"
                        v-model="dispositivo.coordenadas"
                        required
                        placeholder="Coordenadas"
                    />
                    <label for="coordenadas">Coordenadas *</label>
                </div>
                
                <!-- Campos para los parámetros (puedes hacerlos editables o mantenerlos fijos) -->
                <div class="row mt-3">
                    <div class="col-md-6">
                        <h6>Potencia</h6>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Nominal</span>
                            <input type="number" step="0.1" class="form-control" v-model.number="dispositivo.potencia.nominal">
                            <span class="input-group-text">KW</span>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Mín</span>
                            <input type="number" step="0.1" class="form-control" v-model.number="dispositivo.potencia.min">
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Máx</span>
                            <input type="number" step="0.1" class="form-control" v-model.number="dispositivo.potencia.max">
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <h6>Voltaje</h6>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Nominal</span>
                            <input type="number" class="form-control" v-model.number="dispositivo.voltaje.nominal">
                            <span class="input-group-text">V</span>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Mín</span>
                            <input type="number" class="form-control" v-model.number="dispositivo.voltaje.min">
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Máx</span>
                            <input type="number" class="form-control" v-model.number="dispositivo.voltaje.max">
                        </div>
                    </div>
                </div>
                
                <div class="row mt-2">
                    <div class="col-md-6">
                        <h6>Corriente</h6>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Nominal</span>
                            <input type="number" class="form-control" v-model.number="dispositivo.corriente.nominal">
                            <span class="input-group-text">A</span>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Mín</span>
                            <input type="number" class="form-control" v-model.number="dispositivo.corriente.min">
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Máx</span>
                            <input type="number" class="form-control" v-model.number="dispositivo.corriente.max">
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <h6>Caudal</h6>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Nominal</span>
                            <input type="number" step="0.01" class="form-control" v-model.number="dispositivo.caudal.nominal">
                            <span class="input-group-text">m³/min</span>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Mín</span>
                            <input type="number" step="0.01" class="form-control" v-model.number="dispositivo.caudal.min">
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">Máx</span>
                            <input type="number" step="0.01" class="form-control" v-model.number="dispositivo.caudal.max">
                        </div>
                    </div>
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
                    <i class="bi bi-save"></i> Guardar 
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="limpiar"> 
                    <i class="bi bi-x-circle"></i> Cancelar 
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'RegistroDispositivo',
    data() {
        return { 
            dispositivo: {
                nombre: '',
                ubicacion: '',
                coordenadas: '19.7060° N, 101.1950° W',
                potencia: { nominal: 7.4, min: 6.2, max: 8.6, um: 'KW' },
                voltaje: { nominal: 240, min: 230, max: 250, um: 'Volts' },
                corriente: { nominal: 30, min: 25, max: 35, um: 'Amperes' },
                caudal: { nominal: 1, min: 0.1, max: 1.2, um: 'm³/min' },
                estado: 1
            },
            alerta: {
                mensaje: '',
            }
        };
    },
    mounted() {
        this.$refs.nombre.focus();
    },
    methods: {
        validarFormulario() {
            // Validar campos principales
            if (!this.dispositivo.nombre.trim()) {
                this.alerta.mensaje = 'El nombre del dispositivo es obligatorio';
                return false;
            }
            
            if (!this.dispositivo.ubicacion.trim()) {
                this.alerta.mensaje = 'La ubicación es obligatoria';
                return false;
            }
            
            if (!this.dispositivo.coordenadas.trim()) {
                this.alerta.mensaje = 'Las coordenadas son obligatorias';
                return false;
            }
            
            // Validar rangos numéricos
            const validarRango = (parametro, nombre) => {
                if (parametro.min >= parametro.max) {
                    this.alerta.mensaje = `En ${nombre}, el valor mínimo debe ser menor que el máximo`;
                    return false;
                }
                if (parametro.nominal < parametro.min || parametro.nominal > parametro.max) {
                    this.alerta.mensaje = `En ${nombre}, el valor nominal debe estar dentro del rango min-max`;
                    return false;
                }
                return true;
            };
            
            if (!validarRango(this.dispositivo.potencia, 'Potencia')) return false;
            if (!validarRango(this.dispositivo.voltaje, 'Voltaje')) return false;
            if (!validarRango(this.dispositivo.corriente, 'Corriente')) return false;
            if (!validarRango(this.dispositivo.caudal, 'Caudal')) return false;
            
            // Verificar duplicados por nombre
            const existe = this.$store.state.dispositivos.some(
                d => d.nombre.toLowerCase() === this.dispositivo.nombre.trim().toLowerCase()
            );
            
            if (existe) {
                this.alerta.mensaje = `El dispositivo con nombre "${this.dispositivo.nombre}" ya existe`;
                return false;
            }
            
            this.alerta.mensaje = '';
            return true;
        },
        
        guardar() {
            if (!this.validarFormulario()) return;
            
            // Crear el objeto para enviar a la base de datos
            const payload = {
                nombre: this.dispositivo.nombre,
                ubicacion: this.dispositivo.ubicacion,
                coordenadas: this.dispositivo.coordenadas,
                potencia: JSON.stringify(this.dispositivo.potencia),
                voltaje: JSON.stringify(this.dispositivo.voltaje),
                corriente: JSON.stringify(this.dispositivo.corriente),
                caudal: JSON.stringify(this.dispositivo.caudal),
                estado: this.dispositivo.estado,
                registro_usuario: this.$store.state.usuario.id // Ajusta según tu sistema de usuarios
            };

            // Ejemplo de conexión con AWS (ajusta a tu API)
            this.$axios.post('/dispositivos', payload)
                .then(response => {
                    // Agregar el dispositivo al store
                    const nuevoDispositivo = {
                        id: response.data.id,
                        ...this.dispositivo,
                        registro_fecha: new Date().toISOString()
                    };
                    this.$store.commit('agregarDispositivo', nuevoDispositivo);
                    this.$router.push('/menu/dispositivos');
                })
                .catch(error => {
                    this.alerta.mensaje = error.response?.data?.message || 'Error al guardar el dispositivo';
                });
        },
        
        limpiar() {
            // Restablecer solo los campos editables
            this.dispositivo.nombre = '';
            this.dispositivo.ubicacion = '';
            this.dispositivo.coordenadas = '19.7060° N, 101.1950° W';
            
            // Restablecer valores predeterminados para los parámetros
            this.dispositivo.potencia = { nominal: 7.4, min: 6.2, max: 8.6, um: 'KW' };
            this.dispositivo.voltaje = { nominal: 240, min: 230, max: 250, um: 'Volts' };
            this.dispositivo.corriente = { nominal: 30, min: 25, max: 35, um: 'Amperes' };
            this.dispositivo.caudal = { nominal: 1, min: 0.1, max: 1.2, um: 'm³/min' };
            
            this.alerta.mensaje = '';
            this.$refs.nombre.focus();
        }    
    }
}
</script>