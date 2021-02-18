const initialState = {}

export default (state = { ...initialState }, action) => {
  switch (action.type) {
    case 'TEST_ACTION':
      return {
        ...state,
        hello: 'test',
      }
    default:
      return state
  }
}
