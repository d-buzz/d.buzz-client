# Application Architecture

## High-Level Architecture

D.Buzz follows a modern React application architecture with clear separation between presentation, business logic, and data layers.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Pages     │  │   Sections   │  │    Modals    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Common     │  │   Layouts    │  │   Elements   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      State Management                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Redux Store                         │   │
│  │  ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐     │   │
│  │  │  Auth  │ │ Posts  │ │ Profile │ │  Wallet  │     │   │
│  │  └────────┘ └────────┘ └─────────┘ └──────────┘     │   │
│  │  ┌────────┐ ┌──────────┐ ┌──────────┐              │   │
│  │  │Settings│ │ Polling  │ │Interface │              │   │
│  │  └────────┘ └──────────┘ └──────────┘              │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓ ↑                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Redux Saga Middleware                    │   │
│  │  (Async operations, side effects, API calls)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ API Service│  │   Helper   │  │   Theme    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐                            │
│  │  Ceramic   │  │  Database  │                            │
│  └────────────┘  └────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Hive Blockchain  │  │ Ceramic Network  │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Fleek Storage   │  │  Giphy API       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Hierarchical Component Structure

```
App Component
│
├── Router
│   └── Routes
│       ├── GuardedAppFrame (authenticated routes)
│       │   ├── AppBar
│       │   ├── SideBarLeft
│       │   ├── SideBarRight
│       │   └── Page Component
│       │       └── Section Components
│       │           └── Common Components
│       │               └── Element Components
│       │
│       └── UnguardedAppFrame (public routes)
│           ├── AppBar
│           └── Page Component
│
├── Modal Manager
│   └── Active Modals (from Redux state)
│
└── Theme Provider
    └── JSS Theme Context
```

### Component Categories

#### 1. Page Components
- **Purpose**: Top-level route handlers
- **Location**: `/src/components/pages/`
- **Examples**: Home, Profile, Wallet, Search
- **Responsibilities**:
  - Route matching
  - Page layout composition
  - Data fetching initialization
  - SEO metadata (Helmet)

#### 2. Section Components
- **Purpose**: Major page sections
- **Location**: `/src/components/sections/`
- **Examples**: PostList, AccountFollowers, WalletBalances
- **Responsibilities**:
  - Feature-specific logic
  - Data display and interaction
  - Section-level state management

#### 3. Common Components
- **Purpose**: Reusable cross-feature components
- **Location**: `/src/components/common/`
- **Examples**: BuzzRenderer, PostActions, UserDialog
- **Responsibilities**:
  - Shared functionality
  - Consistent UI patterns
  - Business logic encapsulation

#### 4. Modal Components
- **Purpose**: Overlay dialogs
- **Location**: `/src/components/modals/`
- **Examples**: LoginModal, BuzzFormModal, EditProfileModal
- **Responsibilities**:
  - User input collection
  - Confirmation dialogs
  - Complex forms
  - Managed via Redux interface state

#### 5. Layout Components
- **Purpose**: Application structure
- **Location**: `/src/components/layouts/`
- **Examples**: AppFrame, AppBar, SideBarLeft
- **Responsibilities**:
  - Navigation
  - Page structure
  - Responsive layout

#### 6. Element Components
- **Purpose**: Atomic UI elements
- **Location**: `/src/components/elements/`
- **Examples**: Buttons, Icons, Fields
- **Responsibilities**:
  - Basic UI primitives
  - Styled building blocks
  - No business logic

## Data Flow Architecture

### Unidirectional Data Flow

```
1. User Interaction
   ↓
2. Component dispatches Redux Action
   ↓
3. Redux Saga intercepts action
   ↓
4. Saga calls API Service
   ↓
5. API Service calls Hive Blockchain
   ↓
6. Response flows back through layers
   ↓
7. Saga dispatches success/failure action
   ↓
8. Reducer updates Redux Store
   ↓
9. Components re-render with new state
```

### Detailed Example: Creating a Buzz

```javascript
// 1. User clicks "Buzz" button
<Button onClick={handleBuzzSubmit} />

// 2. Component dispatches action
dispatch(createBuzzAction({ content, tags, ... }))

// 3. Redux Saga watches for action
function* watchCreateBuzz() {
  yield takeEvery(CREATE_BUZZ, createBuzzSaga)
}

// 4. Saga calls API service
function* createBuzzSaga(action) {
  try {
    const result = yield call(api.createPost, action.payload)
    yield put(createBuzzSuccess(result))
  } catch (error) {
    yield put(createBuzzFailure(error))
  }
}

// 5. API service interacts with Hive
export const createPost = async (data) => {
  const client = new Client(rpcNode)
  return await client.broadcast.comment(operation)
}

// 6. Reducer updates state
case CREATE_BUZZ_SUCCESS:
  return {
    ...state,
    posts: [action.payload, ...state.posts],
    loading: false
  }

// 7. Component renders updated data
const posts = useSelector(state => state.posts.posts)
```

## State Management Architecture

### Redux Store Structure

```javascript
{
  auth: {
    user: Object | null,
    isAuthenticated: boolean,
    loginMethod: 'hive' | 'ceramic' | null,
    loading: boolean,
    error: string | null
  },

  posts: {
    feed: Array<Post>,
    trending: Array<Post>,
    latest: Array<Post>,
    userPosts: Object<username, Array<Post>>,
    currentPost: Post | null,
    loading: boolean,
    hasMore: boolean,
    lastKey: string | null
  },

  profile: {
    profiles: Object<username, Profile>,
    followers: Object<username, Array<User>>,
    following: Object<username, Array<User>>,
    loading: boolean
  },

  wallet: {
    balances: Object,
    transactions: Array,
    loading: boolean
  },

  settings: {
    theme: 'light' | 'dark',
    muteList: Array<string>,
    blacklist: Array<string>,
    hiddenPosts: Array<string>,
    preferences: Object
  },

  interface: {
    activeModal: string | null,
    modalProps: Object,
    sidebarOpen: boolean,
    notifications: Array
  },

  polling: {
    intervals: Object,
    enabled: boolean
  }
}
```

### Saga Organization

Each feature module has its own saga file:

```javascript
// /src/store/auth/sagas.js
export function* watchAuthActions() {
  yield takeEvery(LOGIN_USER, loginUserSaga)
  yield takeEvery(LOGOUT_USER, logoutUserSaga)
  yield takeEvery(SIGNUP_USER, signupUserSaga)
}

// /src/store/posts/sagas.js
export function* watchPostActions() {
  yield takeEvery(FETCH_FEED, fetchFeedSaga)
  yield takeEvery(CREATE_BUZZ, createBuzzSaga)
  yield takeEvery(DELETE_BUZZ, deleteBuzzSaga)
  // ... more watchers
}
```

## Routing Architecture

### Route Configuration

```javascript
// /src/routes.js
const routes = [
  {
    component: GuardedAppFrame,
    routes: [
      { path: '/', exact: true, component: Home },
      { path: '/trending', component: Trending },
      { path: '/latest', component: Latest },
      { path: '/search/:tab', component: Search },
      { path: '/@:username', component: Profile,
        routes: [
          { path: '/@:username/wallet', component: Wallet },
          { path: '/@:username/followers', component: Followers },
          { path: '/@:username/following', component: Following },
          // ... nested routes
        ]
      },
      { path: '/@:username/:permlink', component: Content },
    ]
  },
  {
    component: UnguardedAppFrame,
    routes: [
      { path: '/welcome', component: Landing },
      { path: '/faq', component: FAQs },
      { path: '/get-started', component: GetStarted },
      // ... public routes
    ]
  }
]
```

### Route Guards

```javascript
// AuthGuard wrapper
const GuardedAppFrame = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Redirect to="/welcome" />
  }

  return <AppFrame>{children}</AppFrame>
}
```

## Service Layer Architecture

### API Service Pattern

```javascript
// Centralized API functions
export const callBridge = async (endpoint, params) => {
  const node = getActiveRPCNode()
  return await axios.post(`${node}/bridge`, { endpoint, params })
}

export const createPost = async (author, title, body, tags) => {
  // Blockchain operation logic
  const operation = buildCommentOperation(...)
  return await broadcast(operation)
}

export const invokeMuteFilter = (posts, muteList) => {
  // Filter logic
  return posts.filter(post => !muteList.includes(post.author))
}
```

### Helper Service Pattern

```javascript
// Utility functions
export const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '')
}

export const getUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.match(urlRegex) || []
}

export const getProfileMetaData = (account) => {
  try {
    return JSON.parse(account.posting_json_metadata)
  } catch {
    return {}
  }
}
```

## Theme Architecture

### Theme Provider Pattern

```javascript
// Theme context
<ThemeProvider theme={currentTheme}>
  <JSS theme provider>
    <App />
  </JSS>
</ThemeProvider>

// Component using theme
const useStyles = createUseStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))
```

## Authentication Architecture

### Multi-Provider Authentication

```javascript
// Hive Keychain
const loginWithKeychain = async (username) => {
  return new Promise((resolve, reject) => {
    window.hive_keychain.requestSignBuffer(...)
  })
}

// Ceramic + MetaMask
const loginWithCeramic = async () => {
  const addresses = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })
  const ceramic = await connect(addresses[0])
  return ceramic.did
}

// Auth flow
dispatch(loginUser({ method: 'hive', username }))
// or
dispatch(loginUser({ method: 'ceramic' }))
```

## Performance Architecture

### Code Splitting

```javascript
// Lazy loading routes
const Home = lazy(() => import('components/pages/Home'))
const Profile = lazy(() => import('components/pages/Profile'))

// Suspense boundary
<Suspense fallback={<Loading />}>
  <Routes />
</Suspense>
```

### Memoization

```javascript
// Prevent unnecessary re-renders
const MemoizedBuzzRenderer = React.memo(BuzzRenderer)

// Memoized selectors
const selectFilteredPosts = createSelector(
  [selectPosts, selectMuteList],
  (posts, muteList) => invokeMuteFilter(posts, muteList)
)
```

### Infinite Scroll

```javascript
// Pagination pattern
const [page, setPage] = useState(0)
const [hasMore, setHasMore] = useState(true)

const loadMore = () => {
  dispatch(fetchFeed({ page: page + 1 }))
  setPage(page + 1)
}

<InfiniteScroll
  loadMore={loadMore}
  hasMore={hasMore}
  loader={<Skeleton />}
/>
```

## Error Handling Architecture

### Saga Error Handling

```javascript
function* fetchFeedSaga(action) {
  try {
    const data = yield call(api.fetchFeed, action.payload)
    yield put(fetchFeedSuccess(data))
  } catch (error) {
    yield put(fetchFeedFailure(error.message))
    yield call(logError, error)
  }
}
```

### Component Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

## Build Architecture

### Webpack Configuration

```javascript
// config-overrides.js
module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    // ... more polyfills
  }

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  )

  return config
}
```

### Environment-Specific Builds

```bash
# Development build
REACT_APP_ENV=development npm run build:dev

# Production build
REACT_APP_ENV=production npm run build:prod
```

## Deployment Architecture

```
Developer → Git Push → GitHub
                ↓
            CircleCI
                ↓
          ESLint Check
                ↓
           Test Suite
                ↓
        Docker Build
                ↓
     Environment Deploy
     ├── Dev → Testnet
     └── Mainnet → Production
```
