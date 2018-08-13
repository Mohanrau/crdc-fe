import {
  SET_REPORT_LIST_DATA
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_REPORT_LIST_DATA] (state, payload) {
    Vue.set(state.reportsList, 'list', payload.list)
  }

}
