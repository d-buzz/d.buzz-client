import { 
  GET_RANKED_POST_SUCCESS,
  SET_LAST_POST,
  GET_REPLIES_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  items: [],
  last: [],
  replies: [],
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_RANKED_POST_SUCCESS:
      return state.set('items', payload)
    case SET_LAST_POST:
      return state.set('last', payload)
    case GET_REPLIES_SUCCESS:
      return state.set('replies', payload)
    default:
      return state
  }
}