import {
  GET_RANKED_POST_SUCCESS,
  SET_LAST_POST,
  GET_REPLIES_SUCCESS,
  GET_CONTENT_SUCCESS,
  SET_HOME_IS_VISITED,
  GET_TRENDING_TAGS_SUCCESS,
  GET_TRENDING_POSTS_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  items: [],
  last: [],
  replies: [],
  content: {},
  isHomeVisited: false,
  tags: [],
  trending: [],
  created: [],
  lastTrending: {},
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_RANKED_POST_SUCCESS:
      return state.setIn('items', payload)
    case SET_LAST_POST:
      return state.set('last', payload)
    case GET_TRENDING_POSTS_SUCCESS:
      return state.set('trending', payload)
    case GET_REPLIES_SUCCESS:
      return state.set('replies', payload)
    case GET_CONTENT_SUCCESS:
      return state.set('content', payload)
    case SET_HOME_IS_VISITED:
      return state.set('isHomeVisited', payload)
    case GET_TRENDING_TAGS_SUCCESS:
      return state.set('tags', payload)
    default:
      return state
  }
}
