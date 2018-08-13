import {date} from 'quasar'
import * as moment from 'moment'

export default {
  methods: {
    getFirstDayOfCurrentYear (format) {
      let timeStamp = date.buildDate({date: 1, month: 1})
      return this.formatDate(timeStamp, format)
    },
    getCurrentDate (format) {
      let timeStamp = Date.now()
      return this.formatDate(timeStamp, format)
    },
    checkDateValidity (val) {
      if (val !== '') {
        let diff = date.getDateDiff(this.getCurrentDate(), val, 'days')
        if (diff < 0) {
          return true
        }
      }
      return false
    },
    getDateDiff (valFrom, valTo, unit, withUnit) {
      let appliedUnit = ''
      if (typeof unit === 'undefined' || unit === '' || unit === null) {
        appliedUnit = 'days'
      } else {
        appliedUnit = unit
      }
      if (valFrom === null) {
        valFrom = this.getCurrentDate()
      }
      if (valTo === null) {
        valTo = this.getCurrentDate()
      }
      if (valFrom !== '' && valTo !== '') {
        let diff = date.getDateDiff(valFrom, valTo, appliedUnit)
        if (withUnit) {
          return diff + ' (' + unit + ')'
        }
        return diff
      }
    },
    formatDate (val, format) {
      let appliedFormat = ''
      if (typeof format === 'undefined' || format === '' || format === null) {
        appliedFormat = 'YYYY-MM-DD'
      } else {
        appliedFormat = format
      }
      if (val !== '') {
        return date.formatDate(val, appliedFormat)
      }
      return '-'
    },
    humanizeDateTime (val) {
      return moment(val).fromNow()
    },
    getsubtractFromDate (fromDate = this.getCurrentDate(), days, format) {
      return this.formatDate(date.subtractFromDate(fromDate, {days: days}), format)
    },
    getGMTDateTime () {
      var d = new Date()
      var localTime = d.getTime()
      var localOffset = d.getTimezoneOffset() * 60000

      // obtain UTC time in msec
      let utc = localTime + localOffset
      // using supplied offset
      var nd = new Date(utc + (3600000 * 8))
      return nd.toLocaleString() + ' GMT (+8.00)'
    }
  }
}
