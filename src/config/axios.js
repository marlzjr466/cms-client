import axios from 'axios'
import _ from 'lodash'
import env from '@constants'
import { storage } from '@utilities/helper'

const baseApi = (() => {
  const instance = axios.create({
    baseURL: env.API_URL,
    timeout: 10000
  })

  instance.interceptors.request.use(config => {
    const token = storage.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    return config
  })

  const successResponse = response => {
    const status = _.get(response, 'status')
    const customMessage = `${_.toUpper(response.config.method)} ${response.config.url}`

    if (status !== 200) {
      throw new Error(`Client responded with a status: "${status}" on ${customMessage}`)
    }

    return response
  }

  const errorResponse = err => {
    throw new Error(err.response.data)
  }

  instance.interceptors.response.use(
    successResponse,
    errorResponse
  )

  return instance
})()

export {
  baseApi
}