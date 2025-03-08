import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'auth',

  metaStates: {
    username: null
  },

  metaMutations: {
    SET_USERNAME: (state, { payload }) => {
      if (payload) {
        state.username = payload
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async login ({}, params) {
      try {
        const response = await baseApi.post('/authentications/login', params)
        
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async logout ({}, params) {
      try {
        const response = await baseApi.post('/authentications/logout', params)
        
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async changePassword ({}, params) {
      try {
        const response = await baseApi.patch('/authentications/change-password', params)
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    }
  }
})