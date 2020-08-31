import { select, call, put, takeEvery } from "redux-saga/effects"
import {
  GET_REPLIES_REQUEST,
  getRepliesSuccess,
  getRepliesFailure,

  GET_CONTENT_REQUEST,
  getContentSuccess,
  getContentFailure,

  GET_TRENDING_POSTS_REQUEST,
  getTrendingPostsSuccess,
  getTrendingPostsFailure,
  setTrendingLastPost,

  GET_HOME_POSTS_REQUEST,
  getHomePostsSuccess,
  getHomePostsFailure,
  setHomeLastPost,

  GET_LATEST_POSTS_REQUEST,
  getLatestPostsSuccess,
  getLatestPostsFailure,
  setLatestLastPost,

  GET_TRENDING_TAGS_REQUEST,
  getTrendingTagsSuccess,
  getTrendingTagsFailure,

  UPVOTE_REQUEST,
  upvoteSuccess,
  upvoteFailure,

  UPLOAD_FILE_REQUEST,
  uploadFileSuccess,
  uploadFileError,

  PUBLISH_POST_REQUEST,
  publishPostSuccess,
  publishPostFailure,

  PUBLISH_REPLY_REQUEST,
  publishReplySuccess,
  publishReplyFailure,

  GET_SEARCH_TAG_REQUEST,
  getSearchTagsSuccess,
  getSearchTagFailure,

  FOLLOW_REQUEST,
  followSuccess,
  followFailure,
  setHasBeenFollowedRecently,

  UNFOLLOW_REQUEST,
  unfollowSuccess,
  unfollowFailure,
  setHasBeenUnfollowedRecently,

  SEARCH_REQUEST,
  searchSuccess,
  searchFailure,
} from './actions'

import {
  callBridge,
  fetchContent,
  fetchTrendingTags,
  fetchProfile,
  extractLoginData,
  broadcastVote,
  keychainUpvote,
  uploadImage,
  generatePostOperations,
  broadcastOperation,
  broadcastKeychainOperation,
  generateReplyOperation,
  generateFollowOperation,
  generateUnfollowOperation,
  fetchDiscussions,
  searchPostTags,
  searchPostAuthor,
  searchPeople,
  searchPostGeneral,
} from 'services/api'
import stripHtml from 'string-strip-html'
import { Signature, hash } from '@hiveio/hive-js/lib/auth/ecc'

function* getRepliesRequest(payload, meta) {
  const { author, permlink } = payload
  try {
    const replies = yield call(fetchDiscussions, author, permlink)

    yield put(getRepliesSuccess(replies, meta))
  } catch(error) {
    yield put(getRepliesFailure(error, meta))
  }
}

function* getContentRequest(payload, meta) {
  const { author, permlink } = payload
  try {
    let data = {}
    const fromPage = yield select(state => state.posts.get('pageFrom'))
    if(!fromPage) {
      data = yield call(fetchContent, author, permlink)
    } else {

      if(fromPage === 'home') {
        const home = yield select(state => state.posts.get('home'))
        const filtered = home.filter((item) => item.author === author && item.permlink === permlink)
        data = filtered[0]
      } else if(fromPage === 'trending') {
        const trending = yield select(state => state.posts.get('trending'))
        const filtered = trending.filter((item) => item.author === author && item.permlink === permlink)
        data = filtered[0]
      } else if(fromPage === 'latest') {
        const latest = yield select(state => state.posts.get('latest'))
        const filtered = latest.filter((item) => item.author === author && item.permlink === permlink)
        data = filtered[0]
      } else if(fromPage === 'profile') {
        const profilePosts = yield select(state => state.profile.get('posts'))
        let filtered = profilePosts.filter((item) => item.author === author && item.permlink === permlink)

        if(filtered.length === 0) {
          const profileReplies = yield select(state => state.profile.get('replies'))
          filtered = profileReplies.filter((item) => item.author === author && item.permlink === permlink)
        }

        data = filtered[0]
      }
    }
    yield put(getContentSuccess(data, meta))
  } catch(error) {
    yield put(getContentFailure(error, meta))
  }
}

function* getTrendingTagsRequests(meta) {
  try {
    let data = yield call(fetchTrendingTags)

    data = data.filter((tag) => !tag.name.includes('hive') && !tag.name.split('')[1].match(new RegExp('^\\d+$')))

    yield put(getTrendingTagsSuccess(data, meta))
  } catch (error) {
    yield put(getTrendingTagsFailure(error, meta))
  }
}

function* getTrendingPostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload

  const params = { sort: 'trending', start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('trending'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    yield put(setTrendingLastPost(data[data.length-1]))
    yield put(getTrendingPostsSuccess(data, meta))
  } catch(error) {
    yield put(getTrendingPostsFailure(error, meta))
  }
}

function* getHomePostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload

  const params = { sort: 'trending', start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('home'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    yield put(setHomeLastPost(data[data.length-1]))
    yield put(getHomePostsSuccess(data, meta))
  } catch(error) {
    yield put(getHomePostsFailure(error, meta))
  }
}

function* getLatestPostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload

  const params = { sort: 'created', start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('latest'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    yield put(setLatestLastPost(data[data.length-1]))
    yield put(getLatestPostsSuccess(data, meta))
  } catch(error) {
    yield put(getLatestPostsFailure(error, meta))
  }
}

function* upvoteRequest(payload, meta) {

  try {
    const { author, permlink, percentage } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, is_authenticated, useKeychain } = user
    const weight = percentage * 100

    if(is_authenticated) {
      if(useKeychain) {
        try {
          const result = yield call(keychainUpvote, username, permlink, author, weight)
          if(result.success) {
            yield put(upvoteSuccess({ success: true }, meta))
          } else {
            yield put(upvoteFailure({ success: false }, meta))
          }
        } catch(error) {
          yield put(upvoteFailure({ success: true, error }, meta))
        }
      } else {
        let { login_data } = user
        login_data = extractLoginData(login_data)
        const wif = login_data[1]

        yield call(broadcastVote, wif, username, author, permlink, weight)
        yield put(upvoteSuccess({ success: true }, meta))
      }
    } else {
      yield put(upvoteFailure({ success: true, error: 'No authentication' }, meta))
    }

  } catch(error) {
    yield put(upvoteFailure({ success: true, error }, meta))
  }
}

function* fileUploadRequest(payload, meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const old = yield select(state => state.posts.get('images'))
    const { username, is_authenticated, useKeychain } = user
    const { file } = payload

    if(is_authenticated) {
      let data

      if(file) {
        const reader = new FileReader()
        data = yield new Promise((resolve) => {
          reader.addEventListener('load', () => {
            const result = new Buffer(reader.result, 'binary')
            resolve(result)
          })
          reader.readAsBinaryString(file)
        })
      }

      const formData = new FormData()
      formData.append('file', file)

      const prefix = new Buffer('ImageSigningChallenge')
      const buf = Buffer.concat([prefix, data])
      const bufSha = hash.sha256(buf)

      let sig

      if(useKeychain) {
        const response = yield new Promise(resolve => {
          window.hive_keychain.requestSignBuffer(
            username,
            JSON.stringify(buf),
            'Posting',
            response => {
              resolve(response)
            },
          )
        })

        if (response.success) {
          sig = response.result
        }

      } else {
        let { login_data } = user
        login_data = extractLoginData(login_data)
        const wif = login_data[1]
        sig = Signature.signBufferSha256(bufSha, wif).toHex()
      }

      const postUrl = `https://images.hive.blog/${username}/${sig}`
      const result = yield call(uploadImage, postUrl, formData)

      let images = []

      if(Array.isArray(old) && old.length !== 0) {
        images = [ ...old ]
      }

      images.push(result.data.url)

      yield put(uploadFileSuccess(images, meta))
    } else {
      yield put(uploadFileError('authentication required', meta))
    }
  } catch (error) {
    yield put(uploadFileError(error, meta))
  }
}

function* publishPostRequest(payload, meta) {
  try {
    const { body, tags } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user
    let title = stripHtml(body)

    if(title.length > 70) {
      title = `${title.substr(0, 70)} ...`
    }

    const operations = yield call(generatePostOperations, username, title, body, tags)

    let success = false
    const comment_options = operations[1]
    let permlink = comment_options[1].permlink

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operations)
      success = result.success

      if(!success) {
        yield put(publishPostFailure('Unable to publish post', meta))
      }

    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operations, [wif])

      success = result.success
    }

    console.log({ operations })

    const data = {
      success,
      author: username,
      permlink,
    }

    yield put(publishPostSuccess(data, meta))
  } catch (error) {
    yield put(publishPostFailure(error, meta))
  }
}

function* publishReplyRequest(payload, meta) {
  try {
    const { parent_author, parent_permlink, body, ref, treeHistory } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user

    let replyData = {}

    let success = false
    const operation = yield call(generateReplyOperation, username, body, parent_author, parent_permlink)

    console.log({ operation })

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result.success
    }

    if(success) {
      const meta = operation[0]
      const reply = yield call(fetchContent, username, meta[1].permlink)
      const profile = yield call(fetchProfile, [username])
      reply.profile = profile[0]
      reply.refMeta = {
        ref,
        author: parent_author,
        permlink: parent_permlink,
        treeHistory,
      }
      replyData = reply
    }

    const data = {
      success,
      reply: replyData,
    }

    yield put(publishReplySuccess(data, meta))
  } catch(error) {
    console.log({ error })
    yield put(publishReplyFailure(error, meta))
  }
}

function* getSearchTags(payload, meta) {
  try {
    const { tag } = payload
    const searchPosts = yield call(searchPostTags,   tag)

    yield put(getSearchTagsSuccess(searchPosts, meta))
  } catch(error) {
    yield put(getSearchTagFailure(error, meta))
  }
}

function* followRequest(payload, meta) {
  try {
    const { following } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user

    const operation = yield call(generateFollowOperation, username, following)
    let success = false


    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result.success
    }

    if(success) {
      let recentFollows = yield select(state => state.posts.get('hasBeenRecentlyFollowed'))
      let recentUnfollows = yield select(state => state.posts.get('hasBeenRecentlyUnfollowed'))

      if(!Array.isArray(recentUnfollows)) {
        recentUnfollows = []
      } else {
        const index = recentUnfollows.findIndex((item) => item === following)
        if(index) {
          recentUnfollows.splice(index, 1)
        }
      }

      if(!Array.isArray(recentFollows)) {
        recentFollows = []
      }
      recentFollows.push(following)
      yield put(setHasBeenFollowedRecently(recentFollows))
      yield put(setHasBeenUnfollowedRecently(recentUnfollows))
    }

    yield put(followSuccess(success, meta))
  } catch (error) {
    yield put(followFailure(error, meta))
  }
}

function* unfollowRequest(payload, meta) {
  try {
    const { following } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user

    const operation = yield call(generateUnfollowOperation, username, following)
    let success = false


    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result.success
    }

    if(success) {
      let recentFollows = yield select(state => state.posts.get('hasBeenRecentlyFollowed'))
      let recentUnfollows = yield select(state => state.posts.get('hasBeenRecentlyUnfollowed'))

      if(!Array.isArray(recentFollows)) {
        recentFollows = []
      } else {
        const index = recentFollows.findIndex((item) => item === following)
        if(index) {
          recentFollows.splice(index, 1)
        }
      }

      if(!Array.isArray(recentUnfollows)) {
        recentUnfollows = []
      }
      recentUnfollows.push(following)

      yield put(setHasBeenFollowedRecently(recentFollows))
      yield put(setHasBeenUnfollowedRecently(recentUnfollows))
    }

    yield put(unfollowSuccess(success, meta))
  } catch(error) {
    yield put(unfollowFailure(error, meta))
  }
}

function* searchRequest(payload, meta) {
  try {
    let { query } = payload
    let results = []

    if(`${query}`.match(/^@/g)) {
      query = `${query}`.replace('@', '')
      results = yield call(searchPostAuthor, query)
    }else if(`${query}`.match(/^#/g)) {
      query = `${query}`.replace('#', '')
      results = yield call(searchPostTags, query)
    } else {
      results = yield call(searchPostGeneral, query)
    }

    const profile = yield call(searchPeople, query)

    results.people = profile.reputations

    yield put(searchSuccess(results, meta))
  } catch(error) {
    yield put(searchFailure(error, meta))
  }
}


function* watchGetRepliesRequest({ payload, meta }) {
  yield call(getRepliesRequest, payload, meta)
}

function* watchGetContentRequest({ payload, meta }) {
  yield call(getContentRequest, payload, meta)
}

function* watchGetTrendingTagsRequest({ meta }) {
  yield call(getTrendingTagsRequests, meta)
}

function* watchGetTrendingPostsRequest({ payload, meta }) {
  yield call(getTrendingPostsRequest, payload, meta)
}

function* watchGetHomePostsRequest({ payload, meta }) {
  yield call(getHomePostsRequest, payload, meta)
}

function* watchGetLatestPostsRequest({payload, meta}) {
  yield call(getLatestPostsRequest, payload, meta)
}

function* watchUpvoteRequest({ payload, meta }) {
  yield call(upvoteRequest, payload, meta)
}

function* watchUploadFileUploadRequest({ payload, meta }) {
  yield call(fileUploadRequest, payload, meta)
}

function* watchPublishPostRequest({ payload, meta }) {
  yield call(publishPostRequest, payload, meta)
}

function* watchPublishReplyRequest({ payload, meta }) {
  yield call(publishReplyRequest, payload, meta)
}

function* watchGetSearchTags({ payload, meta }) {
  yield call(getSearchTags, payload, meta)
}

function* watchFollowRequest({ payload, meta }) {
  yield call(followRequest, payload, meta)
}

function* watchUnfollowRequest({ payload, meta }) {
  yield call(unfollowRequest, payload, meta)
}

function* watchSearchRequest({ payload, meta }) {
  yield call(searchRequest, payload, meta)
}


export default function* sagas() {
  yield takeEvery(GET_LATEST_POSTS_REQUEST, watchGetLatestPostsRequest)
  yield takeEvery(GET_HOME_POSTS_REQUEST, watchGetHomePostsRequest)
  yield takeEvery(GET_TRENDING_POSTS_REQUEST, watchGetTrendingPostsRequest)
  yield takeEvery(GET_REPLIES_REQUEST, watchGetRepliesRequest)
  yield takeEvery(GET_CONTENT_REQUEST, watchGetContentRequest)
  yield takeEvery(GET_TRENDING_TAGS_REQUEST, watchGetTrendingTagsRequest)
  yield takeEvery(UPVOTE_REQUEST, watchUpvoteRequest)
  yield takeEvery(UPLOAD_FILE_REQUEST, watchUploadFileUploadRequest)
  yield takeEvery(PUBLISH_POST_REQUEST, watchPublishPostRequest)
  yield takeEvery(PUBLISH_REPLY_REQUEST, watchPublishReplyRequest)
  yield takeEvery(GET_SEARCH_TAG_REQUEST, watchGetSearchTags)
  yield takeEvery(FOLLOW_REQUEST, watchFollowRequest)
  yield takeEvery(UNFOLLOW_REQUEST, watchUnfollowRequest)
  yield takeEvery(SEARCH_REQUEST, watchSearchRequest)
}
