import Swal from "sweetalert2"

export default {
  success (options = {}) {
    return Swal.fire({
      ...options,
      title: options.title || 'Success',
      text: options.text || 'The operation has been successfully resolved!',
      confirmButtonText: 'OK',
      icon: 'success'
    })
  },

  error (options = {}) {
    return Swal.fire({
      ...options,
      title: options.title || 'Error',
      text: options.text || 'The operation has been successfully resolved!',
      confirmButtonText: 'OK',
      icon: 'error'
    })
  },

  info (options = {}) {
    return Swal.fire({
      ...options,
      title: options.title || 'Info',
      text: options.text || 'Info',
      confirmButtonText: 'OK',
      icon: 'info'
    })
  },

  warning (options = {}) {
    return Swal.fire({
      ...options,
      title: options.title || 'Warning',
      text: options.text || 'Warning',
      confirmButtonText: 'OK',
      icon: 'warning'
    })
  },

  async prompt (_options = {}) {
    const { onConfirm, onDeny, ...options } = Object.assign({
      title: 'Prompt',
      text: 'Are you sure?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      denyButtonText: 'Cancel',
    }, _options)

    const invokeFn = fn => typeof fn === 'function' && fn()

    return Swal
      .fire({
        ...options,
        icon: 'info'
      })
      .then(result => {
        return invokeFn(result.isConfirmed ? onConfirm : onDeny)
      })
  },

  close () {
    return Swal.close()
  },

  showLoading () {
    return Swal.showLoading()
  }
}

/*
  swal.prompt({
    async onConfirm () {
      try {
        ...

        swal.success()
      } catch (error) {
        swal.error({
          text: error.message
        })
      }
    }
  })

  swal.success({
    title: 'Success',
    text: 'Account created successfully!'
  })

  swal.error({
    title: 'Error',
    text: error.message
  })
*/
