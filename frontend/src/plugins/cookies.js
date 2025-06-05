import Cookies from 'js-cookie'

export default {
  install: (app) => {
    app.config.globalProperties.$cookies = Cookies
  }
}
