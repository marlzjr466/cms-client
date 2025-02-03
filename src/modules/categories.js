import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'categories',

  metaStates: {
    list: [],
    count: 0
  },
  
  metaMutations: {
    SET_LIST: (state, { payload }) => {
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
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/categories', { params: { data } })
        
        commit('SET_LIST', response.data)
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
        const response = await baseApi.post('/categories', params)
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
        const response = await baseApi.patch('/categories', params)
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