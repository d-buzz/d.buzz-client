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

  GET_FOLLOW_DETAILS_REQUEST,
  getFollowDetailsSuccess,
  getFollowDetailsFailure,

  GET_LINK_META_REQUEST,
  getLinkMetaSuccess,
  getLinkMetaFailure,
} from './actions'

import {
  callBridge,
  fetchContent,
  fetchTrendingTags,
  extractLoginData,
  broadcastVote,
  keychainUpvote,
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
  uploadIpfsImage,
  fetchFollowCount,
  isFollowing,
  getLinkMeta,
  invokeFilter,
} from 'services/api'
import stripHtml from 'string-strip-html'

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
    const old = yield select(state => state.posts.get('trending'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    yield put(setTrendingLastPost(data[data.length-1]))
    yield put(getTrendingPostsSuccess(data, meta))
  } catch(error) {
    yield put(getTrendingPostsFailure(error, meta))
  }
}

function* getHomePostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload
  const user = yield select(state => state.auth.get('user'))
  const { username: account } = user

  const params = {sort: 'feed', account, limit: 50, start_permlink, start_author }
  const method = 'get_account_posts'

  try {
    const old = yield select(state => state.posts.get('home'))
    let data = yield call(callBridge, method, params, false)

    data = [...old, ...data]
    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    yield put(setHomeLastPost(data[data.length-1]))

    data = data.filter(item => invokeFilter(item))

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
    const old = yield select(state => state.posts.get('latest'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

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
    const { is_authenticated } = user
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

      const result = yield call(uploadIpfsImage, data)

      let images = []

      if(Array.isArray(old) && old.length !== 0) {
        images = [ ...old ]
      }

      const ipfsHash = result.hash
      const postUrl = `https://ipfs.io/ipfs/${ipfsHash}`
      images.push(postUrl)

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
    const { tags } = payload
    let { body } = payload

    const footnoteAppend = '<br /><br /> Posted via <a href="https://next.d.buzz/" data-link="promote-link">D.Buzz</a>'

    body = `${body} ${footnoteAppend}`

    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user
    let title = stripHtml(body)

    if(title.length > 70) {
      title = `${title.substr(0, 70)} ...`
    }

    const operations = yield call(generatePostOperations, username, title, body, tags)

    let success = false
    const comment_options = operations[1]
    const permlink = comment_options[1].permlink

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
    const { parent_author, parent_permlink, ref, treeHistory } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user

    let { body } = payload

    const footNoteAppend = '<br /><br /> Posted via <a href="https://next.d.buzz/" data-link="promote-link">D.Buzz</a>'

    body = `${body} ${footNoteAppend}`

    let replyData = {}

    let success = false
    const operation = yield call(generateReplyOperation, username, body, parent_author, parent_permlink)

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
      // const reply = yield call(fetchContent, username, meta[1].permlink)

      console.log({ meta })

      const reply = {
        author: username,
        category: 'hive-193084',
        permlink: meta[1].permlink,
        title: meta[1].title,
        body: meta[1].body,
        replies: [],
        total_payout_value: '0.000 HBD',
        curator_payout_value: '0.000 HBD',
        pending_payout_value: '0.000 HBD',
        active_votes: [],
        parent_author,
        parent_permlink,
        root_author: parent_author,
        root_permlink: parent_permlink,
        children: 0,
      }

      reply.body = reply.body.replace('<br /><br /> Posted via <a href="https://next.d.buzz/" data-link="promote-link">D.Buzz</a>', '')

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

function* getFollowDetailsRequest(payload, meta) {
  try {
    const { name } = payload
    const user = yield select(state => state.auth.get('user'))
    const { is_authenticated, username } = user
    const count = yield call(fetchFollowCount, name)

    let isFollowed = false

    if(is_authenticated) {
      isFollowed = yield call(isFollowing, username, name)
    }

    yield put(getFollowDetailsSuccess({ isFollowed, count }, meta))
  } catch(error) {
    yield put(getFollowDetailsFailure(error, meta))
  }
}

function* getLinkMetaRequest(payload, meta) {
  try {
    const { url } = payload
    const data = yield call(getLinkMeta, url)

    yield put(getLinkMetaSuccess(data, meta))
    //
  } catch(error) {
    yield put(getLinkMetaFailure(error, meta))
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

function* watchGetFollowDetailsRequest({ payload, meta }) {
  yield call(getFollowDetailsRequest, payload, meta)
}

function* watchGetLinkMetaRequest({ payload, meta }) {
  yield call(getLinkMetaRequest, payload, meta)
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
  yield takeEvery(GET_FOLLOW_DETAILS_REQUEST, watchGetFollowDetailsRequest)
  yield takeEvery(GET_LINK_META_REQUEST, watchGetLinkMetaRequest)
}
