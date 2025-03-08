import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'admins',

  metaStates: {
    list: [],
    count: 0,
    profile: null
  },
  
  metaMutations: {
    SET_LIST: (state, { payload }) => {
      if (payload) {
        state.list = payload.list
        state.count = payload.count
      }
    },

    SET_PROFILE: (state, { payload }) => {
      if (payload) {
        state.profile = payload
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }, params) {
      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/admins', { params: { data } })
        
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
        const response = await baseApi.post('/admins', params)
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
        const response = await baseApi.patch('/admins', params)
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async getProfile ({ commit }, id) {
      try {
        const params = {
          is_first: true,
          filters: [
            {
              field: 'id',
              value: id
            }
          ]
        }

        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/admins', { params: { data } })
        
        commit('SET_PROFILE', response.data)
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