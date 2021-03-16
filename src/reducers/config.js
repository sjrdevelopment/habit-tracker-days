const initialState = {}

export default (state = { ...initialState }, action) => {
  switch (action.type) {
    case 'TEST_ACTION':
      return {
        ...state,
      }
    default:
      return state
  }
}
