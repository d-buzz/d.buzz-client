import {
  GET_RANKED_POST_SUCCESS,
  SET_LAST_POST,
  GET_REPLIES_SUCCESS,
  GET_CONTENT_SUCCESS,
  SET_HOME_IS_VISITED,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  items: [],
  last: [],
  replies: [],
  content: {},
  isHomeVisited: false,
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_RANKED_POST_SUCCESS:
      return state.set('items', payload)
    case SET_LAST_POST:
      return state.set('last', payload)
    case GET_REPLIES_SUCCESS:
      return state.set('replies', payload)
    case GET_CONTENT_SUCCESS:
      return state.set('content', payload)
    case SET_HOME_IS_VISITED:
      return state.set('isHomeVisited', payload)
    default:
      return state
  }
}
