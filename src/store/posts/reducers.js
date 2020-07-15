import { 
  GET_RANKED_POST_SUCCESS,
  SET_LAST_POST,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  items: [],
  last: [],
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_RANKED_POST_SUCCESS:
      return state.set('items', payload)
    case SET_LAST_POST:
      return state.set('last', payload)
    default:
      return state
  }
}