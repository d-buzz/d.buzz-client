# Technology Stack

## Frontend Framework

### React 16.13.1
- **Component-based UI**: Modular and reusable components
- **Hooks**: Modern functional components with state and effects
- **Context API**: Theme and global state management
- **Suspense**: Lazy loading and code splitting
- **Virtual DOM**: Efficient rendering and updates

### React Router 5.2.0
- Client-side routing
- Nested routes support
- Route configuration with `react-router-config`
- URL parameter handling
- Route guards for authentication

## State Management

### Redux
- Centralized application state
- Predictable state updates via reducers
- DevTools integration for debugging
- Time-travel debugging

### Redux Saga 1.1.3
- Side effect management
- Complex async workflows
- Generator-based control flow
- Testable business logic
- API call orchestration

### Redux Observable 2.0.0
- RxJS integration for reactive programming
- Observable-based side effects
- Advanced async patterns

### Redux Saga Thunk 0.7.3
- Simplified async action creators
- Promise-based middleware

## UI Framework & Styling

### Material-UI 4.12.4
- Comprehensive component library
- Material Design implementation
- Responsive grid system
- Built-in accessibility
- Customizable theming

### React Bootstrap 1.1.1
- Bootstrap components for React
- Responsive utilities
- Grid system

### React JSS 10.3.0
- CSS-in-JS solution
- Component-scoped styles
- Dynamic styling based on props and theme
- No CSS conflicts
- Automatic vendor prefixing

### Lottie React 2.1.0
- Animation rendering
- JSON-based animations
- Lightweight and performant

## Blockchain Integration

### Hive.js 2.0.4
- Hive blockchain API client
- Transaction signing and broadcasting
- Account management
- Content operations (post, vote, comment)
- Wallet operations
- Real-time data fetching

### Web3 4.3.0
- Ethereum blockchain integration
- Smart contract interaction
- MetaMask communication

### WalletConnect 2.10.0
- Multi-wallet support
- QR code wallet connection
- Mobile wallet integration

## Decentralized Identity & Storage

### Ceramic Network
- **@ceramicstudio/idx 0.12.2**: Decentralized identity
- **@ceramicnetwork/http-client**: Ceramic API client
- **@ceramicnetwork/stream-tile**: Data streams
- **@glazed/did-datastore**: DID data management

### 3ID Blockchain Utils
- Blockchain-based authentication
- Decentralized identifier (DID) support
- Self-sovereign identity

### Fleek Storage
- Distributed file storage
- IPFS-based storage
- CDN for decentralized content

## Data Fetching & HTTP

### Apollo Client 3.7.10
- GraphQL client
- Caching and state management
- Query batching and deduplication
- Optimistic UI updates

### Axios 1.6.0
- HTTP client for REST APIs
- Request/response interceptors
- Promise-based
- Automatic JSON transformation

## Content Processing

### Markdown & Text Processing
- **markdown-link-extractor**: Extract links from markdown
- **remove-markdown**: Strip markdown formatting
- **sanitize-html 2.3.2**: XSS protection and HTML sanitization
- **diff-match-patch**: Text diffing and patching

### Media Processing
- **browser-image-compression**: Client-side image compression
- **react-cropper**: Image cropping functionality
- **giphy-js-fetch-api**: Giphy API integration
- **react-giphy-searchbox**: GIF search interface

### Code Highlighting
- **react-syntax-highlighter 15.4.3**: Syntax highlighting for code blocks
- Multiple language support
- Theme customization

## UI Components & Utilities

### User Interaction
- **emoji-mart 3.0.1**: Emoji picker
- **react-copy-to-clipboard**: Clipboard functionality
- **react-helmet-async 1.0.4**: Document head management
- **react-infinite-scroll-component 6.1.0**: Infinite scrolling

### Embeds & Previews
- **react-linkify**: Automatic link detection and rendering
- **react-player 2.9.0**: Video player component
- **react-twitter-embed**: Twitter content embedding

### Forms & Inputs
- **react-hook-form 7.10.1**: Form state management
- **react-textarea-autosize**: Auto-expanding textareas

### Animations & Transitions
- **framer-motion**: Animation library
- **react-spring**: Spring physics animations

## Development Tools

### Build Tools
- **react-scripts 5.0.1**: Create React App build configuration
- **react-app-rewired 2.2.1**: Customize CRA config without ejecting
- **webpack 5.x**: Module bundler (via react-scripts)

### Code Quality
- **ESLint**: JavaScript linting
- **eslint-config-airbnb**: Airbnb style guide
- **eslint-plugin-react**: React-specific linting rules
- **eslint-plugin-jsx-a11y**: Accessibility linting

### Testing
- **Jest**: JavaScript testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers

### Utilities
- **source-map-explorer**: Bundle analysis
- **react-dev-utils**: Development utilities

## Cryptography & Security

- **bip39**: Mnemonic code generation
- **crypto-js**: Cryptographic algorithms
- **eccrypto**: Elliptic curve cryptography
- **ethereumjs-util**: Ethereum utilities
- **bs58**: Base58 encoding/decoding

## Data Visualization

- **chart.js 3.7.1**: Chart rendering
- **react-chartjs-2**: React wrapper for Chart.js

## Monitoring & Analytics

- **@sentry/browser**: Error tracking and monitoring
- Custom analytics integration (Berries)

## Browser APIs & Polyfills

- **buffer**: Node.js Buffer API for browser
- **process**: Node.js process polyfill
- **stream-browserify**: Node.js stream API for browser
- **crypto-browserify**: Node.js crypto for browser
- **https-browserify**: HTTPS polyfill
- **os-browserify**: OS module polyfill
- **url**: URL parsing

## Internationalization

- **date-fns**: Date formatting and manipulation
- **moment 2.30.1**: Date/time library (legacy support)

## Additional Libraries

- **classnames**: Conditional CSS class management
- **clipboard-copy**: Clipboard API wrapper
- **hive-uri**: Hive URI parsing
- **html-react-parser**: HTML to React component conversion
- **lodash**: Utility functions
- **query-string**: URL query string parsing
- **remark**: Markdown processor
- **remarkable**: Markdown parser

## Runtime Environment

### Node.js
- **Version**: 18.x (specified in .nvmrc)
- **Package Manager**: Yarn or npm

### Browsers Supported
```json
{
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```

## Server & Deployment

### Docker
- **Base Image**: node:13.12.0-alpine
- **Web Server**: Nginx
- Multi-stage builds for optimization

### CI/CD
- **CircleCI**: Automated testing and deployment
- **Node 16.15.1**: CI environment

### Web Server
- **Nginx**: Static file serving and reverse proxy
- Gzip compression
- Cache headers configuration

## API Endpoints

### D.Buzz Services
- **Search API**: `http://localhost:3030/api/v1` (dev)
- **Image API**: `http://localhost:3040/api/v1` (dev)
- **Video API**: `http://localhost:5454/api/v1` (dev)
- **Price API**: External price chart service

### Hive Blockchain
- **RPC Nodes**: Multiple Hive API endpoints with automatic failover
- **Primary Node**: api.hive.blog (default)
- **Backup Nodes**: api.openhive.network, api.deathwing.me
- **Failover System**: Automatic switching on API failure
- **Cooldown Period**: 5 minutes for failed nodes

### External APIs
- **Giphy API**: GIF search and embedding
- **Twitter Embed API**: Tweet embedding

## Version Control

- **Git**: Version control system
- **GitHub**: Repository hosting
- **Branch Strategy**: dev → testnet → mainnet

## Environment Configuration

### Development
- Hot module replacement
- Source maps enabled
- Development server on port 2020
- API proxying to localhost services

### Production
- Minified bundles
- Source maps disabled
- Environment variable injection
- Optimized builds

## Package Management

```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": "90+ packages",
  "devDependencies": "15+ packages"
}
```

## Performance Considerations

- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Remove unused code
- **Minification**: Terser for JavaScript
- **Image Optimization**: WebP support, compression
- **Bundle Size**: Monitored via source-map-explorer
- **Caching**: Service worker and HTTP caching

## Security Features

- **Dependency Auditing**: npm audit / yarn audit
- **Content Security Policy**: HTML sanitization
- **HTTPS Enforcement**: Production requirement
- **XSS Protection**: Input sanitization
- **CORS Configuration**: API request restrictions
