# File Structure

## Project Root

```
d.buzz-client/
├── docs/                          # Documentation (this folder)
├── src/                           # Application source code
├── public/                        # Static public assets
├── nginx/                         # Nginx configuration
├── .circleci/                     # CI/CD configuration
├── package.json                   # Dependencies and scripts
├── config-overrides.js            # Webpack customization
├── jsconfig.json                  # JavaScript configuration
├── .nvmrc                         # Node version
├── .env.development               # Development environment
├── .env.production                # Production environment
├── .eslintrc                      # ESLint configuration
├── .editorconfig                  # Editor configuration
├── .prettierrc                    # Prettier configuration
├── Dockerfile.dev                 # Docker development build
├── docker-compose.dev.yml         # Docker compose config
├── README.md                      # Project README
└── license.txt                    # Unlicense text
```

## Source Directory (`/src`)

### Main Application Files

```
src/
├── index.js                       # React DOM entry point
├── App.js                         # Main App component
├── routes.js                      # Route configuration
├── config.js                      # Application config
├── override.css                   # Global CSS overrides
└── service-worker.js              # PWA service worker
```

### Components (`/src/components`)

```
components/
├── pages/                         # Route-level page components
│   ├── Home/
│   │   ├── index.js              # Home page component
│   │   └── styles.js             # JSS styles
│   ├── Landing/                  # Landing page
│   ├── Profile/                  # User profile page
│   ├── Content/                  # Single post view
│   ├── Wallet/                   # Wallet management
│   ├── Search/                   # Search functionality
│   ├── Trending/                 # Trending posts
│   ├── Latest/                   # Latest posts
│   ├── Tags/                     # Tag browsing
│   ├── Notification/             # Notifications
│   ├── FAQs/                     # FAQ page
│   ├── GetStarted/               # Onboarding
│   ├── Leaderboard/              # Top users
│   ├── Developers/               # Developer docs
│   ├── PrivacyPolicy/            # Privacy policy
│   ├── TermsConditions/          # Terms of service
│   └── Disclaimer/               # Legal disclaimer
│
├── sections/                      # Reusable page sections
│   ├── AccountPosts/             # User's posts section
│   ├── AccountReplies/           # User's replies section
│   ├── AccountComments/          # User's comments
│   ├── AccountMedia/             # Media posts
│   ├── AccountFollowers/         # Followers list
│   ├── AccountFollowing/         # Following list
│   ├── AccountPockets/           # Saved collections
│   ├── AccountMuted/             # Muted users
│   ├── AccountMutedFollowed/     # Followed mute lists
│   ├── AccountBlacklisted/       # Blacklisted users
│   ├── AccountBlacklistedFollowed/ # Followed blacklists
│   ├── PostList/                 # Post feed renderer
│   ├── ReplyList/                # Reply feed renderer
│   ├── SearchPosts/              # Post search results
│   ├── SearchPeople/             # User search results
│   ├── CreateBuzzForm/           # Buzz creation form
│   ├── WalletBalances/           # Wallet balances
│   └── WalletHistory/            # Transaction history
│
├── common/                        # Shared components
│   ├── BuzzRenderer/             # Buzz content renderer
│   ├── PostActions/              # Like, reply, share buttons
│   ├── PostTags/                 # Tag display
│   ├── UserDialog/               # User info modal
│   ├── InfiniteList/             # Infinite scroll
│   ├── FollowButton/             # Follow/unfollow button
│   ├── MuteButton/               # Mute user button
│   ├── BlacklistButton/          # Blacklist button
│   ├── NotificationBox/          # Notification item
│   ├── NotificationFilter/       # Filter notifications
│   ├── SearchField/              # Search input
│   ├── SearchListsField/         # List search
│   ├── UrlVideoEmbed/            # Video embedding
│   ├── TwitterEmbed/             # Twitter embedding
│   ├── VideoPreview/             # Video preview
│   ├── LinkPreview/              # Link preview card
│   ├── PreviewLastLink/          # Last link preview
│   ├── EmojiPicker/              # Emoji selector
│   ├── ImageCropper/             # Image cropping
│   ├── HiveButton/               # Hive login button
│   └── MetaMaskButton/           # MetaMask login button
│
├── modals/                        # Modal dialog components
│   ├── LoginModal/               # Login dialog
│   ├── SignupModal/              # Signup dialog
│   ├── LoginSignupModal/         # Combined login/signup
│   ├── SwitchUserModal/          # Switch account
│   ├── LogoutModal/              # Logout confirmation
│   ├── BuzzFormModal/            # Create buzz modal
│   ├── ReplyFormModal/           # Reply form modal
│   ├── UpdateFormModal/          # Edit buzz modal
│   ├── DeleteBuzzModal/          # Delete confirmation
│   ├── HideBuzzModal/            # Hide buzz modal
│   ├── DraftsModal/              # Saved drafts
│   ├── SaveDraftModal/           # Save draft dialog
│   ├── EditProfileModal/         # Edit profile
│   ├── MuteModal/                # Mute user dialog
│   ├── BlacklistModal/           # Blacklist dialog
│   ├── FollowMutedListModal/     # Follow mute list
│   ├── FollowBlacklistsModal/    # Follow blacklist
│   ├── CreatePocketModal/        # Create collection
│   ├── AddToPocketModal/         # Add to collection
│   ├── RemoveFromPocketConfirmModal/ # Remove confirm
│   ├── DeletePocketConfirmModal/ # Delete collection
│   ├── HiddenBuzzListModal/      # Hidden posts list
│   ├── CensorshipModal/          # Content warning
│   ├── ViewImageModal/           # Image viewer
│   ├── LinkConfirmationModal/    # External link warning
│   ├── GiphySearchModal/         # GIF search
│   ├── SettingsModal/            # User settings
│   ├── ThemeModal/               # Theme selector
│   ├── BuzzConfirmModal/         # Buzz confirmation
│   ├── BuzzTitleModal/           # Buzz title input
│   ├── WhatsNewModal/            # What's new dialog
│   ├── EventsModal/              # Events dialog
│   ├── PayoutDisclaimerModal/    # Payout info
│   └── VoteListDialog/           # Vote list viewer
│
├── layouts/                       # Layout wrapper components
│   ├── AppFrame/                 # Main app frame
│   ├── GuardedAppFrame/          # Authenticated frame
│   ├── UnguardedAppFrame/        # Public frame
│   ├── MobileAppFrame/           # Mobile layout
│   ├── DevelopersFrame/          # Developer docs layout
│   ├── OrganizationAppFrame/     # Org frame
│   ├── AppBar/                   # Top navigation
│   ├── SideBarLeft/              # Left sidebar
│   ├── SideBarRight/             # Right sidebar
│   ├── InstallAppBanner/         # PWA install banner
│   └── CeramicBanner/            # Ceramic promo banner
│
├── wrappers/                      # HOC and providers
│   ├── Init/                     # App initialization
│   ├── AuthGuard/                # Route protection
│   ├── ThemeLoader/              # Theme loading
│   └── ThemeProvider/            # Theme context
│
└── elements/                      # Atomic UI elements
    ├── Buttons/                  # Button components
    ├── Icons/                    # Icon components
    ├── Images/                   # Image components
    ├── Fields/                   # Form field components
    ├── Lists/                    # List components
    ├── Dialogs/                  # Dialog components
    ├── Menus/                    # Menu components
    ├── Animations/               # Animation components
    ├── Switch/                   # Switch/toggle components
    └── Progress/                 # Progress indicators
```

### Redux Store (`/src/store`)

```
store/
├── index.js                       # Store configuration
├── auth/                          # Authentication state
│   ├── actions.js                # Auth actions
│   ├── reducers.js               # Auth reducers
│   └── sagas.js                  # Auth side effects
├── posts/                         # Posts state
│   ├── actions.js                # Post actions (15 KB)
│   ├── reducers.js               # Post reducers (4.5 KB)
│   └── sagas.js                  # Post sagas (31 KB)
├── profile/                       # Profile state
│   ├── actions.js
│   ├── reducers.js
│   └── sagas.js
├── settings/                      # Settings state
│   ├── actions.js
│   ├── reducers.js
│   └── sagas.js
├── wallet/                        # Wallet state
│   ├── actions.js
│   ├── reducers.js
│   └── sagas.js
├── polling/                       # Polling state
│   ├── actions.js
│   ├── reducers.js
│   └── sagas.js
└── interface/                     # UI state
    ├── actions.js
    ├── reducers.js
    └── sagas.js
```

### Services (`/src/services`)

```
services/
├── api.js                         # Main API service (1,600 lines)
│   └── Hive blockchain operations
│       ├── callBridge()
│       ├── getActiveRPCNode()
│       ├── setRPCNode()
│       ├── invokeMuteFilter()
│       ├── removeFootNote()
│       ├── invokeFilter()
│       ├── Post operations (create, update, delete)
│       ├── User operations (profile, follow)
│       ├── Wallet operations
│       └── Search operations
│
├── helper.js                      # Helper utilities (15,786 lines)
│   ├── stripHtml()
│   ├── getUrls()
│   ├── createPatch()
│   ├── getProfileMetaData()
│   ├── getTheme()
│   ├── useWindowDimensions()
│   ├── sendToBerries()
│   ├── censorLinks()
│   └── calculateOverhead()
│
├── theme.js                       # Theme configuration (10.7 KB)
│   ├── Light theme
│   ├── Dark theme
│   ├── Material-UI config
│   └── Color schemes
│
├── ceramic.js                     # Ceramic Network integration (14.5 KB)
│   ├── Ceramic client setup
│   ├── DID authentication
│   └── MetaMask integration
│
└── database/                      # Local database
    └── Custom data storage
```

### Static Assets (`/src/files` and `/src/fonts`)

```
files/                             # Static assets
└── images/
    ├── logos/
    ├── icons/
    └── backgrounds/

fonts/                             # Custom fonts
└── font files
```

## Public Directory (`/public`)

```
public/
├── index.html                     # HTML entry point
├── manifest.json                  # PWA manifest
├── robots.txt                     # SEO robots file
├── favicon.ico                    # Favicon
├── images/                        # Public images
│   ├── logos/
│   ├── icons/
│   └── social/                   # Social media images
├── fonts/                         # Web fonts
│   └── custom fonts
└── widgets/                       # Embeddable widgets
    └── buzzWidget.js             # Buzz button widget
```

## Configuration Files

```
Root Configuration:
├── config-overrides.js            # Webpack config override
│   ├── Fallback configs
│   ├── ProvidePlugin setup
│   └── Source map config
│
├── package.json                   # NPM package config
│   ├── Scripts (start, build, test, lint)
│   ├── Dependencies (90+)
│   └── DevDependencies
│
├── jsconfig.json                  # JavaScript config
│   └── Compiler options
│
├── .nvmrc                         # Node version (18)
├── .eslintrc                      # ESLint rules
├── .editorconfig                  # Editor settings
└── .prettierrc                    # Code formatting
```

## Environment Files

```
.env.development                   # Dev environment
├── REACT_APP_VERSION
├── REACT_APP_SEARCH_API
├── REACT_APP_IMAGE_API
├── REACT_APP_VIDEO_API
├── REACT_APP_PRICE_CHART_API
├── REACT_APP_FLEEK_BUCKET
├── REACT_APP_DEFAULT_RPC_NODE
└── REACT_APP_ENV=development

.env.production                    # Prod environment
└── Same variables with prod values
```

## Docker Configuration

```
Docker Files:
├── Dockerfile.dev                 # Development build
│   ├── node:13.12.0-alpine
│   ├── yarn install
│   ├── npm run build:dev
│   └── nginx serve
│
└── docker-compose.dev.yml         # Docker compose
    └── Service orchestration
```

## CI/CD Configuration

```
.circleci/
└── config.yml                     # CircleCI config
    ├── node:16.15.1 executor
    ├── prod_build_test job
    ├── dev_build_test job
    └── Workflows
```

## Nginx Configuration

```
nginx/
└── nginx.conf                     # Nginx config
    ├── Server blocks
    ├── Gzip compression
    ├── Cache headers
    └── Static file serving
```

## File Size Breakdown

### Largest Files
- `/src/services/helper.js` - 15,786 lines
- `/src/services/api.js` - 1,600 lines
- `/src/services/ceramic.js` - 14,500 lines
- `/src/components/pages/Profile/index.js` - 1,011 lines
- `/src/services/theme.js` - 10,700 lines

### Component Statistics
- **Total JS Files**: 231
- **Total Lines**: ~43,646
- **Average File Size**: ~189 lines
- **Largest Component**: Profile page (1,011 lines)

## Import Conventions

### Absolute Imports
```javascript
// Components
import { Home } from 'components/pages'
import { BuzzRenderer } from 'components/common'

// Services
import { callBridge, getActiveRPCNode } from 'services/api'
import { stripHtml, getUrls } from 'services/helper'

// Store
import { loginUser } from 'store/auth/actions'
```

### Relative Imports
```javascript
// Local files
import styles from './styles'
import config from './config'
```

## Naming Conventions

### Files
- **Components**: PascalCase (`UserDialog.js`)
- **Utilities**: camelCase (`helper.js`)
- **Styles**: camelCase (`styles.js`)
- **Tests**: `*.test.js` or `*.spec.js`

### Directories
- **Components**: PascalCase (`UserDialog/`)
- **Feature Modules**: camelCase (`auth/`)
- **Static Assets**: lowercase (`images/`)

## Code Organization Principles

1. **Feature-based**: Group by feature (auth, posts, profile)
2. **Component hierarchy**: Pages → Sections → Common → Elements
3. **Separation of concerns**: Components, logic, styles separate
4. **Reusability**: Common components shared across features
5. **Modularity**: Each component in its own directory
6. **Colocated styles**: Styles next to components
