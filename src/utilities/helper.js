import moment from 'moment'

function formatQueueNumber (number) {
  return String(number).padStart(4, '0')
}

function getDate (format, date = new Date()) {
  return moment(date).format(format)
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
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
  storage
}