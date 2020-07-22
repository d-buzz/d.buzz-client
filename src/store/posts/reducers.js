import {
  GET_REPLIES_SUCCESS,
  GET_CONTENT_SUCCESS,
  SET_HOME_IS_VISITED,
  SET_TRENDING_IS_VISITED,
  GET_TRENDING_TAGS_SUCCESS,
  GET_TRENDING_POSTS_SUCCESS,
  SET_TRENDING_LAST_POST,
  GET_HOME_POSTS_SUCCESS,
  CLEAR_HOME_POSTS,
  CLEAR_TRENDING_POSTS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  last: [],
  replies: [],
  content: {},
  isHomeVisited: false,
  isTrendingVisited: false,
  tags: [],
  home: [],
  trending: [],
  created: [],
  lastTrending: {},
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case SET_TRENDING_LAST_POST:
      return state.set('lastTrending', payload)
    case GET_TRENDING_POSTS_SUCCESS:
      return state.set('trending', payload)
    case GET_HOME_POSTS_SUCCESS:
      return state.set('home', payload)
    case GET_REPLIES_SUCCESS:
      return state.set('replies', payload)
    case GET_CONTENT_SUCCESS:
      return state.set('content', payload)
    case SET_HOME_IS_VISITED:
      return state.set('isHomeVisited', payload)
    case SET_TRENDING_IS_VISITED:
      return state.set('isTrendingVisited', payload)
    case GET_TRENDING_TAGS_SUCCESS:
      return state.set('tags', payload)
    case CLEAR_HOME_POSTS:
      return state.set('home', [])
    case CLEAR_TRENDING_POSTS:
      return state.set('trending', [])
    default:
      return state
  }
}
