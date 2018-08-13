// import something here
import VueAcl from 'src/services/aclService'

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  Vue.use(VueAcl, {router: router, init: 'public', fail: '/deny', secure: '/initializing', save: true})
}
