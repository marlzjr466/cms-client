export default () => ({
  metaModule: true,
  name: 'theme',

  metaStates: {
    mode: 'light'
  },

  metaMutations: {
    SET_MODE: (state, { payload }) => {
      state.mode = payload
    }
  },

  metaGetters: {},
  metaActions: {}
})