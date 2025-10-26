# Development Setup Guide

## Prerequisites

### Required Software

1. **Node.js 18+**
   ```bash
   # Check your Node version
   node --version

   # Using nvm (recommended)
   nvm install 18
   nvm use 18
   ```

2. **Package Manager**
   - **Yarn** (recommended)
     ```bash
     npm install -g yarn
     ```
   - **npm** (alternative)
     - Comes with Node.js

3. **Git**
   ```bash
   git --version
   ```

### Optional Software

- **Hive Keychain**: Browser extension for Hive authentication
- **MetaMask**: Browser extension for Ceramic authentication
- **Docker**: For containerized development
- **Visual Studio Code**: Recommended editor with extensions:
  - ESLint
  - Prettier
  - React Developer Tools

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/d-buzz/d.buzz-client.git
cd d.buzz-client
```

### 2. Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# Using npm
npm install
```

This will install all required dependencies from `package.json` (~90 packages).

### 3. Configure Environment Variables

Create environment files for development:

```bash
# Copy example files if they exist, or create new ones
cp .env.example .env.development
```

**Development Environment** (`.env.development`):
```bash
# App Version
REACT_APP_VERSION=0.1.0

# API Endpoints (use localhost for local development)
REACT_APP_SEARCH_API=http://localhost:3030/api/v1
REACT_APP_IMAGE_API=http://localhost:3040/api/v1
REACT_APP_VIDEO_API=http://localhost:5454/api/v1

# External APIs
REACT_APP_PRICE_CHART_API=https://api.coingecko.com/api/v3

# Storage
REACT_APP_FLEEK_BUCKET=your-fleek-bucket-name

# Hive Configuration
REACT_APP_DEFAULT_RPC_NODE=https://rpc.d.buzz

# Environment
REACT_APP_ENV=development
```

**Production Environment** (`.env.production`):
```bash
# Same variables but with production URLs
REACT_APP_ENV=production
REACT_APP_SEARCH_API=https://search-api.d.buzz/api/v1
REACT_APP_IMAGE_API=https://image-api.d.buzz/api/v1
REACT_APP_VIDEO_API=https://video-api.d.buzz/api/v1
# ... other production URLs
```

### 4. Start Development Server

```bash
# Using Yarn
yarn start

# Using npm
npm start
```

The application will start on **http://localhost:2020** (configured in package.json).

### 5. Verify Setup

Open your browser to http://localhost:2020. You should see the D.Buzz landing page.

## Development Workflow

### Running the Application

```bash
# Development server (port 2020)
yarn start

# Production build
yarn build:prod

# Development build
yarn build:dev

# Test the production build locally
yarn global add serve
serve -s build
```

### Code Quality

```bash
# Run ESLint
yarn lint

# Auto-fix ESLint issues
yarn lint --fix

# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Bundle Analysis

```bash
# Analyze bundle size
yarn build
yarn analyze
```

## Project Structure Navigation

```
d.buzz-client/
├── src/
│   ├── components/       # React components
│   │   ├── pages/       # Route-level pages
│   │   ├── sections/    # Page sections
│   │   ├── common/      # Shared components
│   │   ├── modals/      # Dialog modals
│   │   ├── layouts/     # App layouts
│   │   └── elements/    # UI primitives
│   ├── store/           # Redux state
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── profile/
│   │   └── ...
│   ├── services/        # Business logic
│   │   ├── api.js       # Hive API
│   │   ├── helper.js    # Utilities
│   │   ├── theme.js     # Theming
│   │   └── ceramic.js   # Ceramic Network
│   ├── App.js          # Main app component
│   ├── index.js        # Entry point
│   ├── routes.js       # Route config
│   └── config.js       # App config
├── public/             # Static files
├── docs/               # Documentation
└── package.json        # Dependencies
```

## Common Development Tasks

### Creating a New Component

```bash
# Create component directory
mkdir -p src/components/common/MyComponent

# Create component files
touch src/components/common/MyComponent/index.js
touch src/components/common/MyComponent/styles.js
```

**Component Template** (`index.js`):
```javascript
import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paper
  }
}))

const MyComponent = ({ title, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default MyComponent
```

### Adding a New Page

1. **Create page component**:
   ```bash
   mkdir src/components/pages/NewPage
   touch src/components/pages/NewPage/index.js
   ```

2. **Implement page**:
   ```javascript
   import React from 'react'
   import { Helmet } from 'react-helmet-async'

   const NewPage = () => {
     return (
       <>
         <Helmet>
           <title>New Page - D.Buzz</title>
         </Helmet>
         <div>
           <h1>New Page</h1>
         </div>
       </>
     )
   }

   export default NewPage
   ```

3. **Add route** in `/src/routes.js`:
   ```javascript
   {
     path: '/new-page',
     component: lazy(() => import('components/pages/NewPage'))
   }
   ```

### Adding Redux State

1. **Create store module**:
   ```bash
   mkdir src/store/newFeature
   touch src/store/newFeature/actions.js
   touch src/store/newFeature/reducers.js
   touch src/store/newFeature/sagas.js
   ```

2. **Define actions** (`actions.js`):
   ```javascript
   export const FETCH_DATA = 'FETCH_DATA'
   export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
   export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE'

   export const fetchData = () => ({
     type: FETCH_DATA
   })

   export const fetchDataSuccess = (data) => ({
     type: FETCH_DATA_SUCCESS,
     payload: data
   })

   export const fetchDataFailure = (error) => ({
     type: FETCH_DATA_FAILURE,
     payload: error
   })
   ```

3. **Create reducer** (`reducers.js`):
   ```javascript
   import { FETCH_DATA, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from './actions'

   const initialState = {
     data: [],
     loading: false,
     error: null
   }

   export default (state = initialState, action) => {
     switch (action.type) {
       case FETCH_DATA:
         return { ...state, loading: true, error: null }
       case FETCH_DATA_SUCCESS:
         return { ...state, data: action.payload, loading: false }
       case FETCH_DATA_FAILURE:
         return { ...state, error: action.payload, loading: false }
       default:
         return state
     }
   }
   ```

4. **Implement saga** (`sagas.js`):
   ```javascript
   import { call, put, takeEvery } from 'redux-saga/effects'
   import { FETCH_DATA, fetchDataSuccess, fetchDataFailure } from './actions'
   import * as api from 'services/api'

   function* fetchDataSaga() {
     try {
       const data = yield call(api.getData)
       yield put(fetchDataSuccess(data))
     } catch (error) {
       yield put(fetchDataFailure(error.message))
     }
   }

   export function* watchNewFeature() {
     yield takeEvery(FETCH_DATA, fetchDataSaga)
   }
   ```

5. **Register in root store** (`/src/store/index.js`):
   ```javascript
   import newFeatureReducer from './newFeature/reducers'
   import { watchNewFeature } from './newFeature/sagas'

   // Add to reducers
   const rootReducer = combineReducers({
     // ... other reducers
     newFeature: newFeatureReducer
   })

   // Add to sagas
   function* rootSaga() {
     yield all([
       // ... other sagas
       fork(watchNewFeature)
     ])
   }
   ```

## Debugging

### React Developer Tools

Install the React DevTools browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Redux DevTools

Install Redux DevTools extension:
- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

Access Redux state in browser console:
```javascript
// In browser console
window.__REDUX_DEVTOOLS_EXTENSION__
```

### Common Issues

#### Port Already in Use
```bash
# Find process using port 2020
lsof -i :2020

# Kill the process
kill -9 <PID>
```

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
yarn install
```

#### Build Errors
```bash
# Clear cache
rm -rf node_modules/.cache

# Rebuild
yarn build
```

## Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test MyComponent.test.js

# Run tests in watch mode
yarn test --watch

# Generate coverage report
yarn test --coverage
```

### Writing Tests

**Component Test Example**:
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import MyComponent from './index'
import store from 'store'

test('renders component correctly', () => {
  render(
    <Provider store={store}>
      <MyComponent title="Test" />
    </Provider>
  )

  expect(screen.getByText('Test')).toBeInTheDocument()
})

test('handles button click', () => {
  const handleClick = jest.fn()

  render(<MyComponent onClick={handleClick} />)

  const button = screen.getByRole('button')
  fireEvent.click(button)

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## Docker Development

### Build Docker Image

```bash
docker build -f Dockerfile.dev -t d-buzz-client:dev .
```

### Run with Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up
```

## Environment-Specific Builds

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod
```

## Next Steps

- Read [Component Overview](../components/overview.md)
- Explore [API Service Documentation](../api/api-service.md)
- Review [Application Architecture](../architecture/application-architecture.md)
- Check [Contributing Guidelines](./contributing.md)

## Getting Help

- **GitHub Issues**: Report bugs and request features
- **Community**: Join D.Buzz on Hive
- **Documentation**: Explore this docs folder
