import {select, call, put, takeEvery} from "redux-saga/effects"
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

  UPLOAD_VIDEO_REQUEST,
  uploadVideoSuccess,
  uploadVideoError,

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

  setContentRedirect,

  PUBLISH_UPDATE_REQUEST,
  publishUpdateSuccess,
  publishUpdateFailure,

  saveReceptUpvotes,
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
  uploadImage,
  fetchFollowCount,
  isFollowing,
  getLinkMeta,
  invokeFilter,
  generateUpdateOperation,
  invokeMuteFilter,
  getMutePattern,
  uploadVideo,
  hasFollowService,
  hasUnFollowService,
  fetchSingleProfile,
  searchHiveTags,
  searchPostGeneral,
} from 'services/api'
import {createPatch, errorMessageComposer, censorLinks, stripHtml} from 'services/helper'

import moment from 'moment'
import {
  checkCeramicLogin,
  checkForCeramicAccount,
  getChildPostsRequest,
  getFollowingFeed,
  getSinglePost,
} from "services/ceramic"
import {broadcastNotification} from "store/interface/actions"

const footnote = (body) => {
  const footnoteAppend = '<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>'
  body = `${body} ${footnoteAppend}`

  return body
}

const invokeHideBuzzFilter = (items) => {
  let hiddenBuzzes = localStorage.getItem('hiddenBuzzes')

  if (!hiddenBuzzes) {
    hiddenBuzzes = []
  } else {
    hiddenBuzzes = JSON.parse(hiddenBuzzes)
  }

  return items.filter((item) => hiddenBuzzes.filter((hidden) => hidden.author === item.author && hidden.permlink === item.permlink).length === 0)
}

const censorCheck = (content, censoredList) => {
  const copyContent = content

  const result = censoredList.filter(({
    author,
    permlink,
  }) => `${author}/${permlink}` === `${content.author}/${content.permlink}`)

  copyContent.censored = {status: false, reason: null}

  if (result.length !== 0) {
    copyContent.body = censorLinks(copyContent.body)
    copyContent.censored = {status: true, reason: result[0].type}
  }

  return copyContent
}

function* getRepliesRequest(payload, meta) {
  const {author, permlink} = payload
  try {
    if (!checkForCeramicAccount(author)) {
      const mutelist = yield select(state => state.auth.get('mutelist'))
      let replies = yield call(fetchDiscussions, author, permlink)
      replies = invokeMuteFilter(replies, mutelist)
      // console.log(replies)
      yield put(getRepliesSuccess(replies, meta))
    } else {
      const replies = yield call(getChildPostsRequest, permlink)
      yield put(getRepliesSuccess(replies, meta))
    }
  } catch (error) {
    yield put(getRepliesFailure(error, meta))
  }
}

function* getContentRequest(payload, meta) {
  const {author, permlink} = payload
  const contentRedirect = yield select(state => state.posts.get('contentRedirect'))
  const censoredList = yield select(state => state.auth.get('censorList'))

  try {
    let data = {}

    if (!checkForCeramicAccount(author)) {
      if (!contentRedirect) {
        const fromPage = yield select(state => state.posts.get('pageFrom'))
        if (!fromPage) {
          data = yield call(fetchContent, author, permlink)
        } else {

          if (fromPage === 'home') {
            const home = yield select(state => state.posts.get('home'))
            const filtered = home.filter((item) => item.author === author && item.permlink === permlink)
            data = filtered[0]
          } else if (fromPage === 'trending') {
            const trending = yield select(state => state.posts.get('trending'))
            const filtered = trending.filter((item) => item.author === author && item.permlink === permlink)
            data = filtered[0]
          } else if (fromPage === 'latest') {
            const latest = yield select(state => state.posts.get('latest'))
            const filtered = latest.filter((item) => item.author === author && item.permlink === permlink)
            data = filtered[0]
          } else if (fromPage === 'profile') {
            const profilePosts = yield select(state => state.profile.get('posts'))
            let filtered = profilePosts.filter((item) => item.author === author && item.permlink === permlink)

            if (filtered.length === 0) {
              const profileReplies = yield select(state => state.profile.get('replies'))
              filtered = profileReplies.filter((item) => item.author === author && item.permlink === permlink)
            }

            data = filtered[0]
          }
        }
      } else {
        data = contentRedirect
      }
    } else {
      // GET CERAMIC POST REQUEST
      const {
        streamId,
        parentId,
        creatorId,
        createdAt,
        updatedAt,
        content,
        debug_metadata,
        replies,
        profile,
      } = yield call(getSinglePost, permlink)
      const {title, body} = content

      data = {
        ceramicProfile: profile,
        parent_author: parentId ? author : null,
        author: creatorId,
        json_metadata: debug_metadata,
        created: createdAt,
        updated_at: updatedAt,
        root_author: creatorId,
        root_title: title,
        root_permlink: streamId,
        parent_permlink: parentId,
        body: body,
        children: replies.length,
      }
    }

    data = censorCheck(data, censoredList)

    yield put(setContentRedirect(null))
    yield put(getContentSuccess(data, meta))
  } catch (error) {
    yield put(getContentFailure(error, meta))
  }
}

function* getTrendingTagsRequests(meta) {
  try {
    let data = yield call(fetchTrendingTags)
    data = data.filter((tag) => !tag.name.includes('hive'))
    yield put(getTrendingTagsSuccess(data, meta))
  } catch (error) {
    yield put(getTrendingTagsFailure(error, meta))
  }
}

function* getTrendingPostsRequest(payload, meta) {
  const censoredList = yield select(state => state.auth.get('censorList'))
  const {start_permlink, start_author} = payload

  const params = {sort: 'trending', start_permlink, start_author}
  const method = 'get_ranked_posts'

  try {
    const old = yield select(state => state.posts.get('trending'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    yield put(setTrendingLastPost(data[data.length - 1]))
    data = data.filter(item => invokeFilter(item))

    const mutelist = yield select(state => state.auth.get('mutelist'))
    const opacityUsers = yield select(state => state.auth.get('opacityUsers'))
    data = invokeMuteFilter(data, mutelist, opacityUsers)
    data = invokeHideBuzzFilter(data)
    data.map((item) => censorCheck(item, censoredList))

    yield put(getTrendingPostsSuccess(data, meta))
  } catch (error) {
    yield put(getTrendingPostsFailure(error, meta))
  }
}

function* getHomePostsRequest(payload, meta) {
  const censoredList = yield select(state => state.auth.get('censorList'))
  const {start_permlink, start_author} = payload
  const user = yield select(state => state.auth.get('user'))
  const {username: account} = user

  const params = {sort: 'feed', account, limit: 20, start_permlink, start_author}
  const method = 'get_account_posts'

  try {
    if (!checkCeramicLogin(account)) {
      const old = yield select(state => state.posts.get('home'))
      let data = yield call(callBridge, method, params, false)

      data = [...old, ...data]
      data = data.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
      })

      yield put(setHomeLastPost(data[data.length - 1]))
      const mutelist = yield select(state => state.auth.get('mutelist'))

      data = data.filter(item => invokeFilter(item))
      const opacityUsers = yield select(state => state.auth.get('opacityUsers'))
      data = invokeMuteFilter(data, mutelist, opacityUsers)
      data = invokeHideBuzzFilter(data)
      data.map((item) => censorCheck(item, censoredList))

      yield put(getHomePostsSuccess(data, meta))
    } else {
      let data = yield call(getFollowingFeed, account)

      if (data === null) {
        data = []
      }

      yield put(getHomePostsSuccess(data, meta))
    }
  } catch (error) {
    yield put(getHomePostsFailure(error, meta))
  }
}

function patternMute(patterns, data) {
  return data.filter((item) => !patterns.includes(`${item.body}`.trim()))
}

function* getLatestPostsRequest(payload, meta) {
  const censoredList = yield select(state => state.auth.get('censorList'))
  const {start_permlink, start_author} = payload


  const params = {sort: 'created', start_permlink, start_author, limit: 20}
  const method = 'get_ranked_posts'

  try {
    const old = yield select(state => state.posts.get('latest'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    yield put(setLatestLastPost(data[data.length - 1]))
    data = data.filter(item => invokeFilter(item))

    const mutelist = yield select(state => state.auth.get('mutelist'))
    const opacityUsers = yield select(state => state.auth.get('opacityUsers'))
    const patterns = yield call(getMutePattern)
    data = invokeMuteFilter(data, mutelist, opacityUsers)
    data = invokeHideBuzzFilter(data)

    data = patternMute(patterns, data)

    data.map((item) => censorCheck(item, censoredList))

    yield put(getLatestPostsSuccess(data, meta))
  } catch (error) {
    yield put(getLatestPostsFailure(error, meta))
  }
}

function* upvoteRequest(payload, meta) {
  const {author, permlink, percentage} = payload
  const user = yield select(state => state.auth.get('user'))
  const {username, is_authenticated, useKeychain} = user
  let recentUpvotes = yield select(state => state.posts.get('recentUpvotes'))
  const weight = percentage * 100
  let success = false

  try {
    if (is_authenticated) {
      if (useKeychain) {
        const result = yield call(keychainUpvote, username, permlink, author, weight)
        success = result.success
      } else {
        let {login_data} = user
        login_data = extractLoginData(login_data)
        const wif = login_data[1]

        const result = yield call(broadcastVote, wif, username, author, permlink, weight)
        success = result.id ? true : false
      }

      if (success) {
        recentUpvotes = [...recentUpvotes, permlink]
        yield put(saveReceptUpvotes(recentUpvotes))
        yield put(upvoteSuccess({success: true}, meta))
      }
    } else {
      yield put(upvoteFailure({success: false, errorMessage: 'No authentication'}, meta))
    }

  } catch (error) {
    const errorMessage = errorMessageComposer('upvote', error)
    yield put(upvoteFailure({success: false, errorMessage}, meta))
  }
}

function* fileUploadRequest(payload, meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const old = yield select(state => state.posts.get('images'))
    const {is_authenticated} = user
    const {file, progress} = payload

    if (is_authenticated) {

      const result = yield call(uploadImage, file, progress)

      let images = []

      if (Array.isArray(old) && old.length !== 0) {
        images = [...old]
      }

      const {imageUrl} = result

      images.push(imageUrl)

      yield put(uploadFileSuccess(images, meta))
    } else {
      yield put(uploadFileError('authentication required', meta))
    }
  } catch (error) {
    yield put(uploadFileError(error, meta))
  }
}

function* videoUploadRequest(payload, meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const {is_authenticated} = user
    const {video, progress} = payload

    if (is_authenticated) {

      const result = yield call(uploadVideo, video, user.username, progress)

      const ipfsHash = result.hashV0

      yield put(uploadVideoSuccess(ipfsHash, meta))
    } else {
      yield put(uploadVideoError('authentication required', meta))
    }
  } catch (error) {
    yield put(uploadVideoError(error, meta))
  }
}

function* publishPostRequest(payload, meta) {
  const {tags, payout, perm} = payload
  let {body} = payload
  let success = false

  const user = yield select(state => state.auth.get('user'))
  const {username, useKeychain, is_authenticated} = user

  const dbuzzImageRegex = /!\[(?:[^\]]*?)\]\((.+?)\)|(https:\/\/storageapi\.fleek\.co\/[a-z-]+\/dbuzz-images\/(dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp|HEIC))|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi
  const images = body.match(dbuzzImageRegex)
  body = `${body}`.replace(dbuzzImageRegex, '').trimStart()

  let title = stripHtml(body)
  title = `${title}`.trim()

  const titleLimit = 82

  if (title.length > titleLimit) {
    const lastSpace = title.substr(0, titleLimit).lastIndexOf(" ")

    if (lastSpace !== -1) {
      title = `${title.substring(0, lastSpace)} ...`
      body = `... ${body.replace(title.substring(0, lastSpace), '')}`
    } else {
      title = ''
    }
  } else {
    title = ''
  }

  if (images) {
    body += `\n${images.toString().replace(/,/gi, ' ')}`
  }

  body = footnote(body)


  try {
    const operations = yield call(generatePostOperations, username, title, body, tags, payout, perm)

    const comment_options = operations[1]
    const permlink = comment_options[1].permlink
    const is_buzz_post = true

    if (useKeychain && is_authenticated) {
      const result = yield call(broadcastKeychainOperation, username, operations)
      success = result.success

      if (!success) {
        yield put(publishPostFailure('Unable to publish post', meta))
      }
    } else {
      let {login_data} = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]

      const result = yield call(broadcastOperation, operations, [wif], is_buzz_post)

      success = result.success
    }

    if (success) {
      const comment = operations[0]
      const json_metadata = comment[1].json_metadata

      let currentDatetime = moment().toISOString()
      currentDatetime = currentDatetime.replace('Z', '')

      let cashout_time = moment().add(7, 'days').toISOString()
      cashout_time = cashout_time.replace('Z', '')

      let body = comment[1].body
      body = body.replace('<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>', '')

      const content = {
        author: username,
        category: 'hive-193084',
        permlink,
        title: comment[1].title,
        body: body,
        replies: [],
        total_payout_value: '0.000 HBD',
        curator_payout_value: '0.000 HBD',
        pending_payout_value: '0.000 HBD',
        active_votes: [],
        root_author: "",
        parent_author: null,
        parent_permlink: "hive-190384",
        root_permlink: permlink,
        root_title: title,
        json_metadata,
        children: 0,
        created: currentDatetime,
        cashout_time,
        max_accepted_payout: `${payout.toFixed(3)} HBD`,
      }

      yield put(setContentRedirect(content))
    }

    const data = {
      success,
      author: username,
      permlink,
    }

    yield put(publishPostSuccess(data, meta))
  } catch (error) {
    if (error?.data?.stack?.[0]?.data?.last_root_post !== undefined &&
      error.data.stack[0].data.last_root_post !== null) {

      const last_root_post = new Date(error.data.stack[0].data.last_root_post)
      const now = new Date(error.data.stack[0].data.now)
      const differenceInMinutes = getTimeLeftInPostingBuzzAgain(last_root_post, now)

      const errorMessage = errorMessageComposer('post_limit', null, differenceInMinutes)

      yield put(publishPostFailure({errorMessage}, meta))

    } else {
      const errorMessage = errorMessageComposer('post', error)
      yield put(publishPostFailure({errorMessage}, meta))
    }

  }
}

function getTimeLeftInPostingBuzzAgain(last_root_post, now) {
  // Convert datetime to timestamps
  const timestamp1 = last_root_post.getTime()
  const timestamp2 = now.getTime()

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = timestamp2 - timestamp1

  // Convert milliseconds to minutes
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60)
  return differenceInMinutes
}

function* publishReplyRequest(payload, meta) {
  const {parent_author, parent_permlink, ref, treeHistory} = payload
  const user = yield select(state => state.auth.get('user'))
  const {username, useKeychain, is_authenticated} = user
  let {body} = payload
  body = footnote(body)

  let replyData = {}

  let success = false

  try {
    if (is_authenticated) {
      const operation = yield call(generateReplyOperation, username, body, parent_author, parent_permlink)

      if (useKeychain) {
        const result = yield call(broadcastKeychainOperation, username, operation)
        success = result.success
      } else {
        let {login_data} = user
        login_data = extractLoginData(login_data)

        const wif = login_data[1]
        const result = yield call(broadcastOperation, operation, [wif])
        success = result.success
      }

      if (success) {
        const meta = operation[0]

        let currentDatetime = moment().toISOString()
        currentDatetime = currentDatetime.replace('Z', '')

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
          created: currentDatetime,
        }

        reply.body = reply.body.replace('<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>', '')

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
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('reply', error)
    yield put(publishReplyFailure({errorMessage}, meta))
  }
}

function* getSearchTags(payload, meta) {
  try {
    const {tag} = payload
    const searchPosts = yield call(searchPostTags, tag)

    yield put(getSearchTagsSuccess(searchPosts, meta))
  } catch (error) {
    yield put(getSearchTagFailure(error, meta))
  }
}

function* followRequest(payload, meta) {
  const {following} = payload
  const user = yield select(state => state.auth.get('user'))
  const {username, useKeychain, is_authenticated, useHAS} = user

  const operation = yield call(generateFollowOperation, username, following)
  let success = false


  if (useHAS && is_authenticated) {
    let recentFollows = yield select(state => state.posts.get('hasBeenRecentlyFollowed'))
    let recentUnfollows = yield select(state => state.posts.get('hasBeenRecentlyUnfollowed'))

    yield call(hasFollowService, username, following)

    import('@mintrawa/hive-auth-client').then((HiveAuth) => {
      HiveAuth.hacMsg.subscribe(m => {
        broadcastNotification('warning', 'Please open Hive Keychain app on your phone and confirm the transaction.', 600000)
        if (m.type === 'sign_wait') {
          console.log('%c[HAC Sign wait]', 'color: goldenrod', m.msg ? m.msg.uuid : null)
        }

        if (m.type === 'tx_result') {
          console.log('%c[HAC Sign result]', 'color: goldenrod', m.msg ? m.msg : null)
          if (m.msg?.status === 'accepted') {
            if (!Array.isArray(recentUnfollows)) {
              recentUnfollows = []
            } else {
              const index = recentUnfollows.findIndex((item) => item === following)
              if (index) {
                recentUnfollows.splice(index, 1)
              }
            }

            if (!Array.isArray(recentFollows)) {
              recentFollows = []
            }
            recentFollows.push(following)
            setHasBeenFollowedRecently(recentFollows)
            setHasBeenUnfollowedRecently(recentUnfollows)

          } else if (m.msg?.status === 'error') {
            const error = m.msg?.status.error

            followFailure(error, meta)
          }

        }

      })
    })


    if (success) {
      console.log('succe', success)
      yield put(followSuccess(success, meta))
    } else {
      const error = 'transaction error'
      yield put(followFailure(error, meta))
    }

  } else {
    try {

      if (useKeychain) {
        const result = yield call(broadcastKeychainOperation, username, operation)
        success = result.success
      } else {
        let {login_data} = user
        login_data = extractLoginData(login_data)

        const wif = login_data[1]
        const result = yield call(broadcastOperation, operation, [wif])
        success = result.success
      }

      if (success) {
        let recentFollows = yield select(state => state.posts.get('hasBeenRecentlyFollowed'))
        let recentUnfollows = yield select(state => state.posts.get('hasBeenRecentlyUnfollowed'))

        if (!Array.isArray(recentUnfollows)) {
          recentUnfollows = []
        } else {
          const index = recentUnfollows.findIndex((item) => item === following)
          if (index) {
            recentUnfollows.splice(index, 1)
          }
        }

        if (!Array.isArray(recentFollows)) {
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
}

function* unfollowRequest(payload, meta) {
  const {following} = payload
  const user = yield select(state => state.auth.get('user'))
  const {username, useKeychain, useHAS, is_authenticated} = user

  const operation = yield call(generateUnfollowOperation, username, following)
  let success = false

  if (useHAS && is_authenticated) {
    let recentFollows = yield select(state => state.posts.get('hasBeenRecentlyFollowed'))
    let recentUnfollows = yield select(state => state.posts.get('hasBeenRecentlyUnfollowed'))
    yield call(hasUnFollowService, username, following)

    import('@mintrawa/hive-auth-client').then((HiveAuth) => {
      HiveAuth.hacMsg.subscribe(m => {
        broadcastNotification('warning', 'Please open Hive Keychain app on your phone and confirm the transaction.', 600000)
        if (m.type === 'sign_wait') {
          console.log('%c[HAC Sign wait]', 'color: goldenrod', m.msg ? m.msg.uuid : null)
        }

        if (m.type === 'tx_result') {
          console.log('%c[HAC Sign result]', 'color: goldenrod', m.msg ? m.msg : null)
          if (m.msg?.status === 'accepted') {
            if (!Array.isArray(recentFollows)) {
              recentFollows = []
            } else {
              const index = recentFollows.findIndex((item) => item === following)
              if (index) {
                recentFollows.splice(index, 1)
              }
            }

            if (!Array.isArray(recentUnfollows)) {
              recentUnfollows = []
            }
            recentUnfollows.push(following)

            setHasBeenFollowedRecently(recentFollows)
            setHasBeenUnfollowedRecently(recentUnfollows)

          } else if (m.msg?.status === 'error') {
            const error = m.msg?.status.error

            followFailure(error, meta)
          }

        }

      })
    })

    if (success) {
      console.log('success', success)
      yield put(unfollowSuccess(success, meta))
    } else {
      const error = 'transaction error'
      yield put(unfollowFailure(error, meta))
    }

  } else {
    try {
      if (useKeychain) {
        const result = yield call(broadcastKeychainOperation, username, operation)
        success = result.success
      } else {
        let {login_data} = user
        login_data = extractLoginData(login_data)

        const wif = login_data[1]
        const result = yield call(broadcastOperation, operation, [wif])
        success = result.success
      }

      if (success) {
        let recentFollows = yield select(state => state.posts.get('hasBeenRecentlyFollowed'))
        let recentUnfollows = yield select(state => state.posts.get('hasBeenRecentlyUnfollowed'))

        if (!Array.isArray(recentFollows)) {
          recentFollows = []
        } else {
          const index = recentFollows.findIndex((item) => item === following)
          if (index) {
            recentFollows.splice(index, 1)
          }
        }

        if (!Array.isArray(recentUnfollows)) {
          recentUnfollows = []
        }
        recentUnfollows.push(following)

        yield put(setHasBeenFollowedRecently(recentFollows))
        yield put(setHasBeenUnfollowedRecently(recentUnfollows))
      }

      yield put(unfollowSuccess(success, meta))
    } catch (error) {
      yield put(unfollowFailure(error, meta))
    }
  }
}

function* searchRequest(payload, meta) {
  try {
    let { query } = payload

    query = query.toLowerCase()
    let results = []

    if(`${query}`.match(/^@/g)) {
      query = `${query}`.replace('@', '')
      results = yield call(searchPostAuthor, query)
    }
    else {
      // Split the URL path and get the keyword ("trending" or "latest")
      const parts = window.location.pathname.split('/')
      const keyword = parts[2]

      // Prepare a payload object
      const tag = query.startsWith("#") ? query.replace("#", "") : query
      const payload = {
        tag: tag,
        sort: keyword === "latest" ? "newest" : "popularity",
      }

      // Check if the query starts with a hashtag
      if (query.startsWith("#")) {
        // Call searchHiveTags if the query starts with a hashtag
        results = yield call(searchHiveTags, payload)
      } else {
        // Call searchPostGeneral for general queries
        results = yield call(searchPostGeneral, payload)
      }
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
    const {name} = payload
    const user = yield select(state => state.auth.get('user'))
    const {is_authenticated, username} = user
    const count = yield call(fetchFollowCount, name)

    let isFollowed = false

    if (is_authenticated) {
      isFollowed = yield call(isFollowing, username, name)
    }

    const account = yield call(fetchSingleProfile, name)


    yield put(getFollowDetailsSuccess({isFollowed, count, account}, meta))
  } catch (error) {
    yield put(getFollowDetailsFailure(error, meta))
  }
}

function* getLinkMetaRequest(payload, meta) {
  try {
    const {url} = payload
    const data = yield call(getLinkMeta, url)

    yield put(getLinkMetaSuccess(data, meta))
    //
  } catch (error) {
    yield put(getLinkMetaFailure(error, meta))
  }
}

function* publishUpdateRequest(payload, meta) {
  try {
    const {permlink, body: altered} = payload

    const user = yield select(state => state.auth.get('user'))
    const {username, useKeychain} = user

    const original = yield call(fetchContent, username, permlink)
    const {
      parent_author,
      parent_permlink,
      author,
      body,
      json_metadata,
    } = original


    let updatedTitle
    let updatedBody

    const dbuzzImageRegex = /!\[(?:[^\]]*?)\]\((.+?)\)|(https:\/\/storageapi\.fleek\.co\/[a-z-]+\/dbuzz-images\/(dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp|HEIC))|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi
    const images = altered.match(dbuzzImageRegex)
    updatedBody = `${altered}`.replace(dbuzzImageRegex, '').trimStart()

    updatedTitle = `${stripHtml(updatedBody)}`.trim()
    updatedTitle = `${updatedTitle}`.trim()

    const titleLimit = 82

    if (updatedTitle.length > titleLimit) {
      const lastSpace = updatedTitle.substr(0, titleLimit).lastIndexOf(" ")

      if (lastSpace !== -1) {
        updatedBody = `... ${updatedBody.replace(updatedBody.substring(0, lastSpace), '')}`
        updatedTitle = `${updatedTitle.substring(0, lastSpace)} ...`
      } else {
        updatedTitle = ''
      }
    } else {
      updatedTitle = ''
    }

    if (images) {
      updatedBody += `\n${images.toString().replace(/,/gi, ' ')}`
    }

    console.log(updatedTitle)
    console.log(updatedBody)

    const patch = createPatch(body.trim(), updatedBody.trim())
    const operation = yield call(generateUpdateOperation, parent_author, parent_permlink, author, permlink, updatedTitle, patch, json_metadata)

    let success = false

    if (useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success
    } else {
      let {login_data} = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result.success
    }

    yield put(publishUpdateSuccess(success, meta))

  } catch (error) {
    yield put(publishUpdateFailure(error, meta))
  }
}


function* watchGetRepliesRequest({payload, meta}) {
  yield call(getRepliesRequest, payload, meta)
}

function* watchGetContentRequest({payload, meta}) {
  yield call(getContentRequest, payload, meta)
}

function* watchGetTrendingTagsRequest({meta}) {
  yield call(getTrendingTagsRequests, meta)
}

function* watchGetTrendingPostsRequest({payload, meta}) {
  yield call(getTrendingPostsRequest, payload, meta)
}

function* watchGetHomePostsRequest({payload, meta}) {
  yield call(getHomePostsRequest, payload, meta)
}

function* watchGetLatestPostsRequest({payload, meta}) {
  yield call(getLatestPostsRequest, payload, meta)
}

function* watchUpvoteRequest({payload, meta}) {
  yield call(upvoteRequest, payload, meta)
}

function* watchUploadFileUploadRequest({payload, meta}) {
  yield call(fileUploadRequest, payload, meta)
}

function* watchUploadVideoRequest({payload, meta}) {
  yield call(videoUploadRequest, payload, meta)
}

function* watchPublishPostRequest({payload, meta}) {
  yield call(publishPostRequest, payload, meta)
}

function* watchPublishReplyRequest({payload, meta}) {
  yield call(publishReplyRequest, payload, meta)
}

function* watchGetSearchTags({payload, meta}) {
  yield call(getSearchTags, payload, meta)
}

function* watchFollowRequest({payload, meta}) {
  yield call(followRequest, payload, meta)
}

function* watchUnfollowRequest({payload, meta}) {
  yield call(unfollowRequest, payload, meta)
}

function* watchSearchRequest({payload, meta}) {
  yield call(searchRequest, payload, meta)
}

function* watchGetFollowDetailsRequest({payload, meta}) {
  yield call(getFollowDetailsRequest, payload, meta)
}

function* watchGetLinkMetaRequest({payload, meta}) {
  yield call(getLinkMetaRequest, payload, meta)
}

function* watchPublishUpdateRequest({payload, meta}) {
  yield call(publishUpdateRequest, payload, meta)
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
  yield takeEvery(UPLOAD_VIDEO_REQUEST, watchUploadVideoRequest)
  yield takeEvery(PUBLISH_POST_REQUEST, watchPublishPostRequest)
  yield takeEvery(PUBLISH_REPLY_REQUEST, watchPublishReplyRequest)
  yield takeEvery(GET_SEARCH_TAG_REQUEST, watchGetSearchTags)
  yield takeEvery(FOLLOW_REQUEST, watchFollowRequest)
  yield takeEvery(UNFOLLOW_REQUEST, watchUnfollowRequest)
  yield takeEvery(SEARCH_REQUEST, watchSearchRequest)
  yield takeEvery(GET_FOLLOW_DETAILS_REQUEST, watchGetFollowDetailsRequest)
  yield takeEvery(GET_LINK_META_REQUEST, watchGetLinkMetaRequest)
  yield takeEvery(PUBLISH_UPDATE_REQUEST, watchPublishUpdateRequest)
}
