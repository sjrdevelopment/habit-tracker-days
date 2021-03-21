const initialState = {}

export default (state = { ...initialState }, action) => {
  switch (action.type) {
    case 'TEST_ACTION':
      return {
        ...state,
        hello: 'test',
      }
    case 'HABIT_ADD':
      return {
        ...state,
        combinedItems: [...state.combinedItems, action.payload],
      }
    case 'HABIT_REMOVE':
      console.log(action.payload)

      const newCombined = state.combinedItems.filter((item) => {
        return item.id !== action.payload.id
      })

      return {
        ...state,
        combinedItems: newCombined,
      }
    default:
      return state
  }
}
