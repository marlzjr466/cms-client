import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'clinic',

  metaStates: {
    info: null
  },
  
  metaMutations: {
    SET_INFO: (state, { payload }) => {
      if (payload) {
        state.info = payload
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }) {
      try {
        const response = await baseApi.get('/clinic')
        
        commit('SET_INFO', response.data)
      } catch (error) {
        throw error
      }
    },

    async patch ({}, params) {
      try {
        const response = await baseApi.patch('/clinic', params)
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})