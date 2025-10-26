# Redux Store Structure

## Overview

D.Buzz uses Redux for centralized state management with Redux Saga for handling side effects. The store is organized into feature-based modules, each containing actions, reducers, and sagas.

## Store Architecture

```javascript
{
  auth: { ... },        // Authentication state
  posts: { ... },       // Posts and content
  profile: { ... },     // User profiles
  wallet: { ... },      // Blockchain wallet
  settings: { ... },    // User preferences
  interface: { ... },   // UI state
  polling: { ... }      // Data polling
}
```

## Auth Module

**Location**: `/src/store/auth/`

### State Shape

```javascript
{
  user: {
    name: string,
    authority: object,
    json_metadata: object,
    posting_json_metadata: object
  } | null,
  isAuthenticated: boolean,
  loginMethod: 'hive' | 'ceramic' | 'keychain' | null,
  loading: boolean,
  error: string | null,
  ceramicDID: string | null
}
```

### Actions

```javascript
// Login actions
LOGIN_USER
LOGIN_USER_SUCCESS
LOGIN_USER_FAILURE

// Logout actions
LOGOUT_USER
LOGOUT_USER_SUCCESS

// Signup actions
SIGNUP_USER
SIGNUP_USER_SUCCESS
SIGNUP_USER_FAILURE

// Session management
RESTORE_SESSION
SWITCH_USER
```

### Usage Example

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { loginUser, logoutUser } from 'store/auth/actions'

const LoginButton = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector(state => state.auth)

  const handleLogin = () => {
    dispatch(loginUser({
      username: 'alice',
      method: 'keychain'
    }))
  }

  return <button onClick={handleLogin}>Login</button>
}
```

### Sagas

```javascript
// Watch for login action
function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginUserSaga)
}

// Handle login logic
function* loginUserSaga(action) {
  try {
    const { username, method } = action.payload

    // Authenticate based on method
    if (method === 'keychain') {
      const result = yield call(authenticateWithKeychain, username)
      yield put(loginUserSuccess(result))
    }

    // Store session
    yield call(storeSession, username)
  } catch (error) {
    yield put(loginUserFailure(error.message))
  }
}
```

## Posts Module

**Location**: `/src/store/posts/`
**Size**: Actions (15 KB), Sagas (31 KB), Reducers (4.5 KB)

### State Shape

```javascript
{
  feed: {
    items: Array<Post>,
    loading: boolean,
    hasMore: boolean,
    lastKey: string | null
  },
  trending: {
    items: Array<Post>,
    loading: boolean,
    hasMore: boolean
  },
  latest: {
    items: Array<Post>,
    loading: boolean,
    hasMore: boolean
  },
  userPosts: {
    [username]: {
      items: Array<Post>,
      loading: boolean
    }
  },
  currentPost: {
    post: Post | null,
    replies: Array<Comment>,
    loading: boolean
  },
  drafts: Array<Draft>,
  hiddenPosts: Array<string>
}
```

### Post Object Structure

```javascript
{
  author: string,
  permlink: string,
  title: string,
  body: string,
  created: string,
  updated: string,
  category: string,
  children: number,
  net_votes: number,
  active_votes: Array,
  author_reputation: number,
  pending_payout_value: string,
  json_metadata: {
    tags: Array<string>,
    image: Array<string>,
    links: Array<string>,
    app: string,
    format: string
  },
  stats: {
    flag_weight: number,
    total_votes: number
  }
}
```

### Actions

```javascript
// Feed actions
FETCH_FEED
FETCH_FEED_SUCCESS
FETCH_FEED_FAILURE

// Trending actions
FETCH_TRENDING
FETCH_TRENDING_SUCCESS

// Create post actions
CREATE_BUZZ
CREATE_BUZZ_SUCCESS
CREATE_BUZZ_FAILURE

// Update post actions
UPDATE_BUZZ
UPDATE_BUZZ_SUCCESS

// Delete post actions
DELETE_BUZZ
DELETE_BUZZ_SUCCESS

// Vote actions
VOTE_POST
VOTE_POST_SUCCESS

// Reply actions
CREATE_REPLY
FETCH_REPLIES

// Draft actions
SAVE_DRAFT
DELETE_DRAFT
LOAD_DRAFTS

// Hide post actions
HIDE_POST
UNHIDE_POST
```

### Usage Example

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { fetchFeed, createBuzz } from 'store/posts/actions'

const Feed = () => {
  const dispatch = useDispatch()
  const { feed, loading } = useSelector(state => state.posts)

  useEffect(() => {
    dispatch(fetchFeed({ sort: 'trending', limit: 20 }))
  }, [dispatch])

  const handleCreateBuzz = (content) => {
    dispatch(createBuzz({
      body: content,
      tags: ['hive-193084', 'dbuzz']
    }))
  }

  if (loading) return <Loading />

  return (
    <div>
      {feed.items.map(post => (
        <PostCard key={post.permlink} post={post} />
      ))}
    </div>
  )
}
```

### Key Sagas

```javascript
// Fetch feed saga
function* fetchFeedSaga(action) {
  try {
    const { sort, limit, startAuthor, startPermlink } = action.payload

    const posts = yield call(api.callBridge, 'get_ranked_posts', {
      sort,
      tag: config.TAG,
      limit,
      start_author: startAuthor,
      start_permlink: startPermlink
    })

    yield put(fetchFeedSuccess(posts))
  } catch (error) {
    yield put(fetchFeedFailure(error.message))
  }
}

// Create buzz saga
function* createBuzzSaga(action) {
  try {
    const { body, tags, metadata } = action.payload
    const author = yield select(state => state.auth.user.name)

    const result = yield call(api.createPost, {
      author,
      body,
      tags,
      metadata
    })

    yield put(createBuzzSuccess(result))

    // Refresh feed after successful post
    yield put(fetchFeed({ sort: 'latest', limit: 20 }))
  } catch (error) {
    yield put(createBuzzFailure(error.message))
  }
}
```

## Profile Module

**Location**: `/src/store/profile/`

### State Shape

```javascript
{
  profiles: {
    [username]: {
      account: object,
      metadata: object,
      reputation: number,
      following: boolean,
      muted: boolean,
      blacklisted: boolean
    }
  },
  followers: {
    [username]: {
      items: Array<User>,
      loading: boolean,
      count: number
    }
  },
  following: {
    [username]: {
      items: Array<User>,
      loading: boolean,
      count: number
    }
  },
  currentProfile: string | null,
  loading: boolean
}
```

### Actions

```javascript
FETCH_PROFILE
FETCH_PROFILE_SUCCESS
UPDATE_PROFILE
FETCH_FOLLOWERS
FETCH_FOLLOWING
FOLLOW_USER
UNFOLLOW_USER
MUTE_USER
UNMUTE_USER
BLACKLIST_USER
UNBLACKLIST_USER
```

## Wallet Module

**Location**: `/src/store/wallet/`

### State Shape

```javascript
{
  balances: {
    HIVE: string,
    HBD: string,
    HIVE_POWER: string,
    savings_HIVE: string,
    savings_HBD: string
  },
  transactions: Array<Transaction>,
  loading: boolean,
  error: string | null
}
```

### Actions

```javascript
FETCH_BALANCES
FETCH_BALANCES_SUCCESS
FETCH_TRANSACTIONS
TRANSFER
TRANSFER_SUCCESS
POWER_UP
POWER_DOWN
```

## Settings Module

**Location**: `/src/store/settings/`

### State Shape

```javascript
{
  theme: 'light' | 'dark',
  muteList: Array<string>,
  mutedLists: Array<{ owner: string, name: string }>,
  blacklist: Array<string>,
  blacklistedLists: Array<{ owner: string, name: string }>,
  hiddenPosts: Array<string>,
  preferences: {
    showNSFW: boolean,
    hideDownvoted: boolean,
    minReputation: number,
    defaultSort: 'trending' | 'latest' | 'hot'
  }
}
```

### Actions

```javascript
CHANGE_THEME
UPDATE_MUTE_LIST
FOLLOW_MUTED_LIST
UPDATE_BLACKLIST
UPDATE_PREFERENCES
LOAD_SETTINGS
SAVE_SETTINGS
```

## Interface Module

**Location**: `/src/store/interface/`

### State Shape

```javascript
{
  activeModal: string | null,
  modalProps: object,
  sidebarOpen: boolean,
  notifications: Array<Notification>,
  banners: {
    installApp: boolean,
    ceramic: boolean
  },
  alerts: Array<Alert>
}
```

### Actions

```javascript
OPEN_MODAL
CLOSE_MODAL
TOGGLE_SIDEBAR
ADD_NOTIFICATION
REMOVE_NOTIFICATION
DISMISS_BANNER
SHOW_ALERT
HIDE_ALERT
```

### Usage Example

```javascript
import { openModal, closeModal } from 'store/interface/actions'

const BuzzButton = () => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(openModal({
      modal: 'BuzzFormModal',
      props: { mode: 'create' }
    }))
  }

  return <button onClick={handleClick}>Create Buzz</button>
}
```

## Polling Module

**Location**: `/src/store/polling/`

### State Shape

```javascript
{
  intervals: {
    feed: number | null,
    notifications: number | null
  },
  enabled: boolean
}
```

### Actions

```javascript
START_POLLING
STOP_POLLING
UPDATE_INTERVAL
```

## Selectors

### Basic Selectors

```javascript
// Auth selectors
export const selectUser = state => state.auth.user
export const selectIsAuthenticated = state => state.auth.isAuthenticated

// Post selectors
export const selectFeedPosts = state => state.posts.feed.items
export const selectCurrentPost = state => state.posts.currentPost.post

// Profile selectors
export const selectProfile = (state, username) => state.profile.profiles[username]
```

### Memoized Selectors (Reselect)

```javascript
import { createSelector } from 'reselect'

// Filter muted posts
export const selectFilteredFeed = createSelector(
  [selectFeedPosts, selectMuteList],
  (posts, muteList) => {
    return posts.filter(post => !muteList.includes(post.author))
  }
)

// Get user's own posts
export const selectUserPosts = createSelector(
  [selectFeedPosts, selectUser],
  (posts, user) => {
    return posts.filter(post => post.author === user.name)
  }
)
```

## Middleware

### Redux Saga Middleware

Handles all asynchronous operations:

```javascript
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)
```

### Redux DevTools

```javascript
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)
```

## Store Configuration

```javascript
// /src/store/index.js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'

// Reducers
import authReducer from './auth/reducers'
import postsReducer from './posts/reducers'
import profileReducer from './profile/reducers'
import walletReducer from './wallet/reducers'
import settingsReducer from './settings/reducers'
import interfaceReducer from './interface/reducers'
import pollingReducer from './polling/reducers'

// Sagas
import { watchAuth } from './auth/sagas'
import { watchPosts } from './posts/sagas'
import { watchProfile } from './profile/sagas'
import { watchWallet } from './wallet/sagas'
import { watchSettings } from './settings/sagas'
import { watchInterface } from './interface/sagas'
import { watchPolling } from './polling/sagas'

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  profile: profileReducer,
  wallet: walletReducer,
  settings: settingsReducer,
  interface: interfaceReducer,
  polling: pollingReducer
})

// Root saga
function* rootSaga() {
  yield all([
    fork(watchAuth),
    fork(watchPosts),
    fork(watchProfile),
    fork(watchWallet),
    fork(watchSettings),
    fork(watchInterface),
    fork(watchPolling)
  ])
}

// Create store
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

export default store
```

## Persistence

### LocalStorage Persistence

```javascript
// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      settings: state.settings
    })
    localStorage.setItem('state', serializedState)
  } catch (error) {
    console.error('Could not save state', error)
  }
}

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    return undefined
  }
}

// Create store with persisted state
const persistedState = loadState()
const store = createStore(rootReducer, persistedState, enhancers)

// Subscribe to state changes
store.subscribe(() => {
  saveState(store.getState())
})
```

## Best Practices

1. **Keep actions simple**: Actions should be plain objects
2. **Put logic in sagas**: Business logic belongs in sagas, not reducers
3. **Use selectors**: Centralize state access logic
4. **Normalize data**: Use normalized state shape for entities
5. **Memoize selectors**: Use reselect for computed values
6. **Handle errors**: Always handle saga errors
7. **Type actions**: Use constants for action types
8. **Test reducers**: Reducers are pure functions, easy to test
