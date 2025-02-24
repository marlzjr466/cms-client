import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'queues',

  metaStates: {
    list: [],
    count: 0,
    current: null
  },
  
  metaMutations: {
    SET_LIST: (state, { payload }) => {
      if (payload) {
        state.list = payload.list
        state.count = payload.count
      }
    },

    SET_CURRENT: (state, { payload }) => {
      state.current = payload || null
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }, params) {
      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/queues', { params: { data } })
        
        commit('SET_LIST', response.data)
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async getCurrent ({ commit }, id) {
      try {
        const filters = {
          is_first: true,
          filters: [
            {
              field: 'doctor_id',
              value: id
            },
            {
              field: 'status',
              value: 'in-progress'
            }
          ],
          aggregate: [
            {
              table: 'patients',
              filters: [
                {
                  field: 'id',
                  key: 'patient_id'
                }
              ],
              is_first: true,
              columns: ['id', 'first_name', 'last_name', 'gender', 'birth_date']
            }
          ]
        }

        const data = btoa(JSON.stringify(filters))
        const response = await baseApi.get('/queues', { params: { data } })
        
        commit('SET_CURRENT', response.data)
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
        const response = await baseApi.post('/queues', params)
        return response.data
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async patch ({ commit }, params) {
      try {
        const response = await baseApi.patch('/queues', params)
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