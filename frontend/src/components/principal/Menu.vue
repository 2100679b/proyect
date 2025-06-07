<template>
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Monitor</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarScroll">
          <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li class="nav-item">
              <router-link
                class="nav-link"
                active-class="active"
                to="/menu/dispositivos"
              >
                <i class="bi bi-hdd-stack"></i> Dispositivos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                active-class="active"
                to="/menu/dispositivos/agregar"
              >
                <i class="bi bi-plus-circle"></i> Agregar Dispositivo
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-link-45deg"></i> Opciones
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Opción 1</a></li>
                <li><a class="dropdown-item" href="#">Opción 2</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#">Opción 3</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                active-class="active"
                to="/login"
              >
                <i class="bi bi-box-arrow-right"></i> Salir
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="col py-0 vh-100 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
@import './Menu.css'; /* Importa el archivo CSS externo */
</style>