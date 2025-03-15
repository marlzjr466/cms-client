import { baseApi } from "@config/axios"

export default () => ({
  metaModule: true,
  name: 'admins',

  metaStates: {
    list: [],
    count: 0,
    profile: null,
    onlineStaff: [],
    dashboardData: {
      patientsCount: 0,
      inventoryCount: 0,
      overallSales: 0,
      todaysPatientsCount: 0,
      todaysTotalSales: 0
    }
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
    },

    SET_DASHBOARD_DATA: (state, { payload }) => {
      if (payload) {
        state.dashboardData.patientsCount = payload.patientsCount || 0
        state.dashboardData.inventoryCount = payload.inventoryCount || 0
        state.dashboardData.overallSales = payload.overallSales || 0
        state.dashboardData.todaysPatientsCount = payload.todaysPatientsCount || 0
        state.dashboardData.todaysTotalSales = payload.todaysTotalSales || 0
      }
    },

    SET_ONLINE_STAFF: (state, { payload }) => {
      if (payload) {
        state.onlineStaff = payload
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
    },

    async getDashboardData ({ commit }) {
      try {
        const response = await baseApi.get('/admins/dashboard-data')
        
        commit('SET_DASHBOARD_DATA', response.data)
      } catch (error) {
        return {
          error: {
            message: error.message
          }
        }
      }
    },

    async getOnlineStaff ({ commit }) {
      try {
        const response = await baseApi.get('/admins/online-staff')
        
        commit('SET_ONLINE_STAFF', response.data)
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