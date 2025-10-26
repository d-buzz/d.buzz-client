# Project Overview

## What is D.Buzz?

D.Buzz is a decentralized social media platform that provides a Twitter-like microblogging experience built on the Hive blockchain. The platform enables users to create short-form content (buzzes), engage with other users, and earn cryptocurrency rewards through the Hive blockchain's proof-of-brain consensus mechanism.

## Key Features

### 1. Decentralized Social Networking
- Create and share short-form content (max 280 characters)
- Reply to and comment on posts with nested threading
- Follow users and build your social network
- Discover content through trending and latest feeds

### 2. Blockchain Integration
- Built on Hive blockchain for censorship resistance
- Content permanently stored on distributed ledger
- Cryptocurrency rewards (HIVE, HBD) for quality content
- Wallet management for blockchain assets
- Support for MetaMask and Ceramic Network (Lite Accounts)

### 3. Content Discovery
- Trending feed based on engagement metrics
- Latest posts in chronological order
- Tag-based content browsing
- Full-text search for posts and users
- Leaderboard for top contributors

### 4. User Management
- Profile pages with post history
- Follow/follower relationships
- Personal mute and blacklist functionality
- Global moderation system
- Content collections (Pockets)

### 5. Rich Media Support
- Image uploads with compression and cropping
- Video embedding (YouTube, etc.)
- GIF integration via Giphy
- Link previews with metadata extraction
- Emoji picker
- Markdown formatting support

### 6. Moderation & Safety
- Personal mute lists
- Personal blacklists
- Global moderator-based mute system
- Content filtering options
- External link confirmation dialogs

## Technical Highlights

### Modern React Application
- React 16.13.1 with hooks and functional components
- Redux for predictable state management
- Redux Saga for handling complex async workflows
- React Router for client-side routing

### Blockchain-First Design
- Hive.js integration for blockchain operations
- Real-time data synchronization with Hive nodes
- Transaction signing with Hive Keychain
- Web3 support for MetaMask integration

### Progressive Web App (PWA)
- Service worker for offline capabilities
- App-like experience on mobile devices
- Installable on desktop and mobile
- Push notification support

### Responsive & Accessible
- Mobile-first design approach
- Material-UI component library
- Dark and light theme support
- Infinite scroll for optimal performance

## Architecture Philosophy

### Component-Based Architecture
The application follows a hierarchical component structure:
- **Page Components**: Top-level route handlers
- **Section Components**: Reusable page sections
- **Common Components**: Shared UI elements
- **Element Components**: Atomic design elements
- **Modal Components**: Overlay dialogs
- **Layout Components**: Application structure

### Unidirectional Data Flow
```
User Action → Redux Action → Redux Saga → API Service → Hive Blockchain
                                              ↓
User Interface ← Component Re-render ← Redux Store Update
```

### Service-Oriented Backend Integration
- Centralized API service for all blockchain operations
- Helper utilities for data transformation
- Dedicated services for theming, identity, and storage

## Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Infinite Scroll**: Load content on-demand
- **Memoization**: Prevent unnecessary re-renders
- **Image Compression**: Reduce bandwidth usage
- **Skeleton Loading**: Improve perceived performance
- **Service Worker Caching**: Offline-first approach

## Security Features

- **Content Sanitization**: XSS protection
- **Link Verification**: External link warnings
- **Private Key Security**: Never stored in application
- **HTTPS Enforcement**: Secure communication
- **Input Validation**: Prevent malicious content

## Deployment Architecture

```
CircleCI → Docker Build → Nginx → Static Files
    ↓
  ESLint
    ↓
  Test Suite
    ↓
Environment-Specific Builds (Dev/Prod)
```

## Development Workflow

1. **Feature Development**: Work in feature branches
2. **Pull Request**: Submit PR to dev branch
3. **Code Review**: Team review and approval
4. **Testnet Deployment**: Merge to dev triggers testnet deploy
5. **Production Deployment**: Promote stable code to mainnet

## Technology Decisions

### Why React?
- Component reusability
- Large ecosystem and community
- Virtual DOM for performance
- Strong developer tooling

### Why Redux?
- Predictable state management
- Time-travel debugging
- Middleware support for async operations
- DevTools integration

### Why Hive Blockchain?
- Fast block times (3 seconds)
- Free transactions
- Built-in reward mechanism
- Decentralized and censorship-resistant
- Active developer community

### Why Material-UI?
- Comprehensive component library
- Consistent design system
- Accessibility built-in
- Customizable theming

## Project Goals

1. **Decentralization**: Reduce reliance on centralized platforms
2. **User Ownership**: Users control their content and data
3. **Monetization**: Fair reward distribution for content creators
4. **Censorship Resistance**: Immutable content storage
5. **Community Governance**: Stakeholder-driven platform development
6. **Open Source**: Transparent and auditable codebase

## Future Roadmap

- Enhanced media support (native video upload)
- Direct messaging between users
- Advanced analytics dashboard
- Mobile native applications (iOS/Android)
- Integration with additional blockchains
- Improved moderation tools
- Community-driven feature development

## Statistics

- **Project Size**: ~43,646 lines of code
- **Component Count**: 100+ reusable components
- **Dependencies**: 90+ npm packages
- **Supported Chains**: Hive, Ethereum (via MetaMask)
- **User Accounts**: Hive accounts + Ceramic Lite accounts
