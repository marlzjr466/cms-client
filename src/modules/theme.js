import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'theme',

  metaStates: {
    mode: 'light'
  },

  metaMutations: {
    SET_MODE: (state, { payload }) => {
      state.mode = payload.mode
    }
  },

  metaGetters: {},
  metaActions: {
    async fetch ({ commit }, params) {
      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/settings', { params: { data } })
        
        commit('SET_MODE', response.data)
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
        console.log('params', params)
        const response = await baseApi.patch('/settings', params)
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