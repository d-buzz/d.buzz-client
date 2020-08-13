import {
  GET_REPLIES_SUCCESS,
  GET_CONTENT_SUCCESS,
  SET_HOME_IS_VISITED,
  SET_HOME_LAST_POST,
  SET_TRENDING_IS_VISITED,
  GET_TRENDING_TAGS_SUCCESS,
  GET_TRENDING_POSTS_SUCCESS,
  SET_TRENDING_LAST_POST,
  GET_HOME_POSTS_SUCCESS,
  CLEAR_HOME_POSTS,
  CLEAR_TRENDING_POSTS,
  SET_LATEST_IS_VISITED,
  GET_LATEST_POSTS_SUCCESS,
  SET_LATEST_LAST_POST,
  CLEAR_LATEST_POSTS,
  CLEAR_REPLIES,
  UPLOAD_FILE_SUCCESS,
  PUBLISH_POST_SUCCESS,
  PUBLISH_REPLY_SUCCESS,
  GET_SEARCH_TAG_SUCCESS,
  SET_LAST_SEARCH_TAG,
  SET_TAGS_IS_VISITED,
  CLEAR_TAGS_POST,
  FOLLOW_SUCCESS,
  SET_HAS_BEEN_FOLLOWED_RECENTLY,
  SET_HAS_BEEN_UNFOLLOWED_RECENTLY,
  SET_PAGE_FROM,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  last: [],
  replies: [],
  content: {},
  isHomeVisited: false,
  isTrendingVisited: false,
  isLatestVisited: false,
  tags: [],
  home: [],
  trending: [],
  latest: [],
  lastTrending: {},
  lastHome: {},
  lastLatest: {},
  images: [],
  published: {},
  appendReply: {},
  searchTag: [],
  lastSearchTag: {},
  isTagsVisited: false,
  following: false,
  hasBeenRecentlyFollowed: [],
  hasBeenRecentlyUnfollowed: [],
  pageFrom: '',
})

export const posts = (state = defaultState, { type, payload }) => {
  switch (type) {
    case SET_LATEST_LAST_POST:
      return state.set('lastLatest', payload)
    case SET_TRENDING_LAST_POST:
      return state.set('lastTrending', payload)
    case GET_TRENDING_POSTS_SUCCESS:
      return state.set('trending', payload)
    case GET_HOME_POSTS_SUCCESS:
      return state.set('home', payload)
    case GET_LATEST_POSTS_SUCCESS:
      return state.set('latest', payload)
    case GET_REPLIES_SUCCESS:
      return state.set('replies', payload)
    case GET_CONTENT_SUCCESS:
      return state.set('content', payload)
    case SET_HOME_IS_VISITED:
      return state.set('isHomeVisited', payload)
    case SET_HOME_LAST_POST:
      return state.set('lastHome', payload)
    case SET_TRENDING_IS_VISITED:
      return state.set('isTrendingVisited', payload)
    case SET_LATEST_IS_VISITED:
      return state.set('isLatestVisited', payload)
    case GET_TRENDING_TAGS_SUCCESS:
      return state.set('tags', payload)
    case CLEAR_HOME_POSTS:
      return state.set('home', [])
    case CLEAR_TRENDING_POSTS:
      return state.set('trending', [])
    case CLEAR_LATEST_POSTS:
      return state.set('latest', [])
    case CLEAR_REPLIES:
      return state.set('replies', [])
    case UPLOAD_FILE_SUCCESS:
      return state.set('images', payload)
    case PUBLISH_POST_SUCCESS:
      return state.set('published', payload)
    case PUBLISH_REPLY_SUCCESS:
      return state.set('appendReply', payload.reply)
    case GET_SEARCH_TAG_SUCCESS:
      return state.set('searchTag', payload)
    case SET_LAST_SEARCH_TAG:
      return state.set('lastSearchTag', payload)
    case SET_TAGS_IS_VISITED:
      return state.set('isTagsVisited', payload)
    case CLEAR_TAGS_POST:
      return state.set('searchTag', [])
    case FOLLOW_SUCCESS:
      return state.set('following', payload)
    case SET_HAS_BEEN_FOLLOWED_RECENTLY:
      return state.set('hasBeenRecentlyFollowed', payload)
    case SET_HAS_BEEN_UNFOLLOWED_RECENTLY:
      return state.set('hasBeenRecentlyUnfollowed', payload)
    case SET_PAGE_FROM:
      return state.set('pageFrom', payload)
    default:
      return state
  }
}
