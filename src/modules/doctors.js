import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'doctors',

  metaStates: {
    list: [],
    count: 0
  },
  
  metaMutations: {
    SET_DOCTORS: (state, { payload }) => {
      if (payload) {
        state.list = payload.list
        state.count = payload.count
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }, params) {
      try {
        const response = await baseApi.get('/doctors', { params })
        
        commit('SET_DOCTORS', response.data)
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async create ({}, params) {
      try {
        const response = await baseApi.post('/doctors', params)
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async patch ({}, params) {
      try {
        const response = await baseApi.patch('/doctors', params)
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