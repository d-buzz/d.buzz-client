import { GET_RANKED_POST_SUCCESS } from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  items: [],
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_RANKED_POST_SUCCESS:
      return state.set('items', payload)
    default:
      return state
  }
}