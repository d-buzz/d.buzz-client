# Quick Start Guide

Get up and running with D.Buzz Client development in minutes.

## Prerequisites

- Node.js 18+ installed
- Yarn or npm package manager
- Git installed

## 5-Minute Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/d-buzz/d.buzz-client.git
cd d.buzz-client

# Install dependencies
yarn install
```

### 2. Configure Environment

```bash
# Create .env.development file
cat > .env.development << 'EOF'
REACT_APP_VERSION=0.1.0
REACT_APP_SEARCH_API=http://localhost:3030/api/v1
REACT_APP_IMAGE_API=http://localhost:3040/api/v1
REACT_APP_VIDEO_API=http://localhost:5454/api/v1
REACT_APP_PRICE_CHART_API=https://api.coingecko.com/api/v3
REACT_APP_FLEEK_BUCKET=your-bucket-name
REACT_APP_DEFAULT_RPC_NODE=https://rpc.d.buzz
REACT_APP_ENV=development
EOF
```

### 3. Start Development Server

```bash
yarn start
```

The app will open at **http://localhost:2020**

## Understanding the Codebase

### Key Directories

```
src/
├── components/    # React components
│   ├── pages/    # Full page components
│   ├── sections/ # Page sections
│   ├── common/   # Reusable components
│   └── modals/   # Dialog modals
├── store/        # Redux state management
├── services/     # API and utilities
└── routes.js     # App routing
```

### Main Files

- **`src/index.js`**: Application entry point
- **`src/App.js`**: Main app component
- **`src/routes.js`**: Route configuration
- **`src/config.js`**: App configuration
- **`src/store/index.js`**: Redux store setup
- **`src/services/api.js`**: Hive blockchain API

## Common Commands

```bash
# Start development server
yarn start

# Run linter
yarn lint

# Run tests
yarn test

# Build for production
yarn build:prod

# Build for development
yarn build:dev

# Analyze bundle size
yarn build && yarn analyze
```

## Your First Feature

### Create a Simple Component

1. **Create component file**:
   ```bash
   mkdir -p src/components/common/WelcomeMessage
   touch src/components/common/WelcomeMessage/index.js
   ```

2. **Implement component**:
   ```javascript
   // src/components/common/WelcomeMessage/index.js
   import React from 'react'
   import { createUseStyles } from 'react-jss'

   const useStyles = createUseStyles(theme => ({
     message: {
       padding: theme.spacing.unit * 2,
       backgroundColor: theme.palette.primary.main,
       color: theme.palette.primary.contrastText,
       borderRadius: 8
     }
   }))

   const WelcomeMessage = ({ name }) => {
     const classes = useStyles()

     return (
       <div className={classes.message}>
         <h2>Welcome to D.Buzz, {name}!</h2>
       </div>
     )
   }

   export default WelcomeMessage
   ```

3. **Use in a page**:
   ```javascript
   // src/components/pages/Home/index.js
   import WelcomeMessage from 'components/common/WelcomeMessage'

   const Home = () => {
     const user = useSelector(state => state.auth.user)

     return (
       <div>
         <WelcomeMessage name={user.name} />
         {/* ... rest of home page */}
       </div>
     )
   }
   ```

### Fetch Data from Hive Blockchain

1. **Create Redux action**:
   ```javascript
   // src/store/posts/actions.js
   export const FETCH_USER_POSTS = 'FETCH_USER_POSTS'
   export const FETCH_USER_POSTS_SUCCESS = 'FETCH_USER_POSTS_SUCCESS'

   export const fetchUserPosts = (username) => ({
     type: FETCH_USER_POSTS,
     payload: { username }
   })
   ```

2. **Implement saga**:
   ```javascript
   // src/store/posts/sagas.js
   import { call, put } from 'redux-saga/effects'
   import * as api from 'services/api'

   function* fetchUserPostsSaga(action) {
     try {
       const { username } = action.payload

       const posts = yield call(api.callBridge, 'get_account_posts', {
         account: username,
         sort: 'posts',
         limit: 20
       })

       yield put({
         type: 'FETCH_USER_POSTS_SUCCESS',
         payload: posts
       })
     } catch (error) {
       yield put({
         type: 'FETCH_USER_POSTS_FAILURE',
         payload: error.message
       })
     }
   }
   ```

3. **Use in component**:
   ```javascript
   import { useEffect } from 'react'
   import { useDispatch, useSelector } from 'react-redux'
   import { fetchUserPosts } from 'store/posts/actions'

   const UserPosts = ({ username }) => {
     const dispatch = useDispatch()
     const posts = useSelector(state => state.posts.userPosts[username])

     useEffect(() => {
       dispatch(fetchUserPosts(username))
     }, [username, dispatch])

     return (
       <div>
         {posts?.map(post => (
           <div key={post.permlink}>
             <h3>{post.title}</h3>
             <p>{post.body}</p>
           </div>
         ))}
       </div>
     )
   }
   ```

## Architecture Overview

### Component Hierarchy

```
App
├── Router
│   └── Routes
│       ├── GuardedAppFrame (requires auth)
│       │   ├── AppBar
│       │   ├── SideBarLeft
│       │   ├── SideBarRight
│       │   └── Page Component
│       └── UnguardedAppFrame (public)
│           └── Page Component
└── Modals (managed by Redux)
```

### Data Flow

```
User Action
  ↓
Component dispatches Redux Action
  ↓
Redux Saga intercepts
  ↓
API Service calls Hive blockchain
  ↓
Saga dispatches Success/Failure
  ↓
Reducer updates Store
  ↓
Component re-renders
```

## Styling

### Using JSS (CSS-in-JS)

```javascript
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  container: {
    padding: 16,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.palette.text.primary
  }
}))

const MyComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Title</h1>
    </div>
  )
}
```

### Accessing Theme

```javascript
const useStyles = createUseStyles(theme => ({
  // Theme palette
  primary: theme.palette.primary.main,
  secondary: theme.palette.secondary.main,

  // Spacing
  padding: theme.spacing.unit * 2, // 16px

  // Typography
  fontSize: theme.typography.h1.fontSize,

  // Breakpoints
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  }
}))
```

## Routing

### Adding a New Route

```javascript
// src/routes.js
import { lazy } from 'react'

const routes = [
  {
    component: GuardedAppFrame,
    routes: [
      {
        path: '/my-new-page',
        component: lazy(() => import('components/pages/MyNewPage'))
      }
    ]
  }
]
```

### Navigating Programmatically

```javascript
import { useHistory } from 'react-router-dom'

const MyComponent = () => {
  const history = useHistory()

  const goToProfile = (username) => {
    history.push(`/@${username}`)
  }

  return <button onClick={() => goToProfile('alice')}>View Profile</button>
}
```

## Authentication

### Using Auth State

```javascript
import { useSelector } from 'react-redux'

const MyComponent = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return <div>Hello, {user.name}!</div>
}
```

### Dispatching Login

```javascript
import { useDispatch } from 'react-redux'
import { loginUser } from 'store/auth/actions'

const LoginButton = () => {
  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(loginUser({
      username: 'alice',
      method: 'keychain'
    }))
  }

  return <button onClick={handleLogin}>Login</button>
}
```

## Working with Modals

### Opening a Modal

```javascript
import { useDispatch } from 'react-redux'
import { openModal } from 'store/interface/actions'

const CreateBuzzButton = () => {
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

## Debugging

### Redux DevTools

1. Install Redux DevTools browser extension
2. Open DevTools in browser
3. View Redux state and actions in real-time

### React DevTools

1. Install React DevTools extension
2. Inspect component hierarchy
3. View props and state

### Console Logging

```javascript
// In component
useEffect(() => {
  console.log('Component mounted')
  console.log('Props:', props)
  console.log('State:', state)
}, [])

// In saga
function* mySaga(action) {
  console.log('Action:', action)
  const result = yield call(api.getData)
  console.log('Result:', result)
}
```

## Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run in watch mode
yarn test --watch

# Run with coverage
yarn test --coverage
```

### Writing a Simple Test

```javascript
import { render, screen } from '@testing-library/react'
import WelcomeMessage from './WelcomeMessage'

test('renders welcome message', () => {
  render(<WelcomeMessage name="Alice" />)

  expect(screen.getByText(/Welcome to D.Buzz, Alice!/i)).toBeInTheDocument()
})
```

## Next Steps

- **Read Full Documentation**: Explore `/docs` folder
- **Component Overview**: [components/overview.md](../components/overview.md)
- **API Service**: [api/api-service.md](../api/api-service.md)
- **Architecture**: [architecture/application-architecture.md](../architecture/application-architecture.md)
- **Contributing**: [guides/contributing.md](./contributing.md)

## Common Issues

### Port Already in Use

```bash
# Kill process on port 2020
lsof -i :2020
kill -9 <PID>
```

### Module Not Found

```bash
# Clear and reinstall
rm -rf node_modules
yarn install
```

### Build Fails

```bash
# Clear cache
rm -rf node_modules/.cache
yarn build
```

## Getting Help

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: Report bugs
- **Community**: Join D.Buzz on Hive

---

Happy coding! 🚀
