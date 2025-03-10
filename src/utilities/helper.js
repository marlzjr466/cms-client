import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import _ from 'lodash'

function decodeToken (token) {
  return jwtDecode(token)
}

function formatQueueNumber (number) {
  return String(number).padStart(4, '0')
}

function getDate (format, date = new Date()) {
  return moment(date).format(format)
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formattedNumber (number) {
  return new Intl.NumberFormat("en-US").format(number)
}

function formatWithCurrency(value, currency = 'PHP') {
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  })

  const numericValue = parseFloat(value);

  if (Number.isNaN(numericValue)) {
      return 'Invalid number';
  }

  // Return the formatted currency string
  return formatter.format(numericValue);
}

function getAge (birthDate) {
    const today = new Date()
    const birth = new Date(birthDate)
  
    let age = _.subtract(today.getFullYear(), birth.getFullYear())

    // Check if birthday has occurred this year
    if (
      _.gt(birth.getMonth(), today.getMonth()) ||
      (_.eq(birth.getMonth(), today.getMonth()) && _.gte(birth.getDate(), today.getDate()))
    ) {
      --age
    }

    return age
  }

const storage = {
  set (name, value) {
    localStorage[name] = value
  },

  get (name) {
    return localStorage[name]
  },

  clear () {
    return localStorage.clear()
  }
}

export {
  formatQueueNumber,
  getDate,
  sleep,
  storage,
  formattedNumber,
  formatWithCurrency,
  decodeToken,
  getAge
}