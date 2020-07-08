import { TEST_SUCCESS } from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  data: '',
})

export const tests = (state = defaultState, { type, payload }) => {
  switch (type) {
    case TEST_SUCCESS:
      return state.set('data', payload)
    default:
      return state
  }
}