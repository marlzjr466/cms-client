import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'records',

  metaStates: {
    list: [],
    count: 0,
    servePatientsCount: 0
  },
  
  metaMutations: {
    SET_LIST: (state, { payload }) => {
      if (payload) {
        state.list = payload.list
        state.count = payload.count
      }
    },

    SET_SERVE_PATIENTS_COUNT: (state, { payload }) => {
      if (payload) {
        state.servePatientsCount = payload.count
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }, params) {
      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/records', { params: { data } })
        
        commit('SET_LIST', response.data)
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async find ({}, params) {
      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/records', { params: { data } })
        
        return response.data
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
        const response = await baseApi.post('/records', params)
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
        const response = await baseApi.patch('/records', params)
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async getServePatients ({ commit }, params) {
      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/records', { params: { data } })

        commit('SET_SERVE_PATIENTS_COUNT', response.data)
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },
  }
})