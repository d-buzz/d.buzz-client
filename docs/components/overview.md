# Component Overview

## Component Architecture

D.Buzz uses a hierarchical component architecture with clear separation of concerns. Components are organized by their role and scope in the application.

## Component Hierarchy

```
┌─────────────────────────────────────────┐
│         Page Components (18)            │
│  Top-level route handlers               │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│       Section Components (22)           │
│  Reusable page sections                 │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│       Common Components (28)            │
│  Shared across features                 │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│       Element Components (10+)          │
│  Atomic UI primitives                   │
└─────────────────────────────────────────┘

        Orthogonal Layers:
┌─────────────────────────────────────────┐
│        Modal Components (35)            │
│  Overlay dialogs                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        Layout Components (13)           │
│  Application structure                  │
└─────────────────────────────────────────┘
```

## Component Categories

### 1. Page Components
**Location**: `/src/components/pages/`
**Count**: 18 components

Route-level components that represent entire pages.

#### Features:
- Handle routing and URL parameters
- Compose sections into full pages
- Manage SEO metadata with React Helmet
- Initialize data fetching for the page

#### Examples:
- `Home` - Authenticated user feed
- `Profile` - User profile with nested routes
- `Content` - Individual post view
- `Wallet` - Blockchain wallet management
- `Search` - Search functionality
- `Trending` - Trending posts feed

### 2. Section Components
**Location**: `/src/components/sections/`
**Count**: 22 components

Reusable page sections that encapsulate specific features.

#### Features:
- Feature-specific business logic
- Reusable across multiple pages
- Data fetching and state management
- User interaction handling

#### Categories:
- **Account sections**: Posts, Replies, Comments, Media, Followers, Following
- **List sections**: PostList, ReplyList
- **Search sections**: SearchPosts, SearchPeople
- **Wallet sections**: WalletBalances, WalletHistory
- **Form sections**: CreateBuzzForm

### 3. Common Components
**Location**: `/src/components/common/`
**Count**: 28 components

Shared components used across multiple features.

#### Features:
- Encapsulate reusable UI patterns
- Implement business logic
- Maintain consistency across app
- Highly composable

#### Examples:
- `BuzzRenderer` - Content display
- `PostActions` - Like, reply, share buttons
- `InfiniteList` - Infinite scroll container
- `FollowButton` - Follow/unfollow interaction
- `LinkPreview` - URL preview cards

### 4. Modal Components
**Location**: `/src/components/modals/`
**Count**: 35 components

Overlay dialogs for user interactions.

#### Features:
- Form input collection
- Confirmation dialogs
- Complex user workflows
- Managed via Redux interface state

#### Categories:
- **Auth modals**: Login, Signup, Logout, SwitchUser
- **Content modals**: BuzzForm, ReplyForm, UpdateForm, DeleteBuzz
- **Profile modals**: EditProfile, Mute, Blacklist
- **Collection modals**: CreatePocket, AddToPocket
- **Info modals**: WhatsNew, Events, PayoutDisclaimer

### 5. Layout Components
**Location**: `/src/components/layouts/`
**Count**: 13 components

Structural components for app layout.

#### Features:
- App frame and structure
- Navigation bars and sidebars
- Responsive layout management
- Auth-based frame switching

#### Examples:
- `AppFrame` - Main application frame
- `GuardedAppFrame` - Authenticated layout
- `UnguardedAppFrame` - Public layout
- `AppBar` - Top navigation
- `SideBarLeft` / `SideBarRight` - Side navigation

### 6. Element Components
**Location**: `/src/components/elements/`
**Count**: 10+ categories

Atomic UI components and building blocks.

#### Features:
- No business logic
- Pure presentation
- Highly reusable
- Styled primitives

#### Categories:
- **Buttons**: Various button styles
- **Icons**: Icon components
- **Images**: Image handling
- **Fields**: Form inputs
- **Lists**: List renderers
- **Dialogs**: Dialog components
- **Menus**: Menu components
- **Animations**: Lottie animations
- **Switch**: Toggle switches
- **Progress**: Progress indicators

### 7. Wrapper Components
**Location**: `/src/components/wrappers/`
**Count**: 4 components

Higher-order components and providers.

#### Examples:
- `Init` - App initialization
- `AuthGuard` - Route protection
- `ThemeLoader` - Theme loading
- `ThemeProvider` - Theme context

### 8. Skeleton Components
**Location**: Various
**Count**: 8 components

Loading state placeholders.

#### Features:
- Improve perceived performance
- Placeholder UI during data fetch
- Maintain layout stability

#### Examples:
- `ContentSkeleton`
- `PostlistSkeleton`
- `ProfileSkeleton`
- `LinkPreviewSkeleton`

## Component Design Patterns

### 1. Container/Presenter Pattern

```javascript
// Container component (smart)
const PostListContainer = () => {
  const posts = useSelector(state => state.posts.feed)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFeed())
  }, [])

  return <PostList posts={posts} />
}

// Presenter component (dumb)
const PostList = ({ posts }) => {
  return posts.map(post => <PostCard key={post.id} post={post} />)
}
```

### 2. Compound Component Pattern

```javascript
// Parent component manages state
const BuzzForm = ({ onSubmit }) => {
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])

  return (
    <form>
      <BuzzForm.TextArea value={content} onChange={setContent} />
      <BuzzForm.TagInput value={tags} onChange={setTags} />
      <BuzzForm.Actions onSubmit={() => onSubmit({ content, tags })} />
    </form>
  )
}

BuzzForm.TextArea = TextArea
BuzzForm.TagInput = TagInput
BuzzForm.Actions = FormActions
```

### 3. Render Props Pattern

```javascript
<InfiniteList
  loadMore={fetchMore}
  hasMore={hasMore}
  render={(items) => items.map(item => <PostCard {...item} />)}
/>
```

### 4. Custom Hooks Pattern

```javascript
// Reusable logic extraction
const useAuth = () => {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const login = useCallback((credentials) => {
    dispatch(loginUser(credentials))
  }, [dispatch])

  const logout = useCallback(() => {
    dispatch(logoutUser())
  }, [dispatch])

  return { user, login, logout }
}

// Usage in component
const Profile = () => {
  const { user, logout } = useAuth()
  // ...
}
```

## Component Communication

### Parent to Child: Props

```javascript
<BuzzRenderer
  content={buzz.body}
  author={buzz.author}
  created={buzz.created}
  metadata={buzz.json_metadata}
/>
```

### Child to Parent: Callbacks

```javascript
const Parent = () => {
  const handleSubmit = (data) => {
    // Handle submission
  }

  return <ChildForm onSubmit={handleSubmit} />
}
```

### Sibling to Sibling: Redux

```javascript
// Component A dispatches action
dispatch(updateUserProfile(newData))

// Component B listens to state
const profile = useSelector(state => state.profile.current)
```

### Global State: Context

```javascript
// Theme context
const { theme, toggleTheme } = useContext(ThemeContext)

// Auth context
const { isAuthenticated } = useContext(AuthContext)
```

## Styling Strategy

### JSS (CSS-in-JS)

```javascript
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

const Component = () => {
  const classes = useStyles()
  return <div className={classes.container}>...</div>
}
```

### Material-UI Styling

```javascript
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2)
  }
}))
```

## Component Lifecycle

### Functional Components with Hooks

```javascript
const PostList = () => {
  // Mount
  useEffect(() => {
    console.log('Component mounted')
    return () => {
      console.log('Component will unmount')
    }
  }, [])

  // Update on dependency change
  useEffect(() => {
    fetchPosts()
  }, [page, filter])

  // Cleanup
  useEffect(() => {
    const subscription = subscribe()
    return () => subscription.unsubscribe()
  }, [])
}
```

## Component Best Practices

### 1. Single Responsibility
Each component should have one clear purpose.

```javascript
// Good: Single purpose
const UserAvatar = ({ user }) => <img src={user.avatar} alt={user.name} />

// Bad: Multiple responsibilities
const UserComponent = ({ user }) => {
  // Renders avatar, bio, posts, followers...
}
```

### 2. Props Validation
Use PropTypes or TypeScript for type safety.

```javascript
import PropTypes from 'prop-types'

BuzzRenderer.propTypes = {
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  created: PropTypes.string,
  metadata: PropTypes.object
}
```

### 3. Memoization for Performance

```javascript
// Prevent unnecessary re-renders
const MemoizedPostCard = React.memo(PostCard, (prevProps, nextProps) => {
  return prevProps.post.id === nextProps.post.id
})
```

### 4. Error Boundaries

```javascript
<ErrorBoundary fallback={<ErrorMessage />}>
  <PostList />
</ErrorBoundary>
```

### 5. Lazy Loading

```javascript
const Profile = lazy(() => import('./components/pages/Profile'))

<Suspense fallback={<Loading />}>
  <Profile />
</Suspense>
```

## Component Testing

### Unit Testing

```javascript
import { render, screen } from '@testing-library/react'
import BuzzRenderer from './BuzzRenderer'

test('renders buzz content', () => {
  render(<BuzzRenderer content="Hello world" />)
  expect(screen.getByText('Hello world')).toBeInTheDocument()
})
```

### Integration Testing

```javascript
test('posting a buzz updates the feed', async () => {
  const { getByRole, findByText } = render(<App />)

  const textarea = getByRole('textbox')
  fireEvent.change(textarea, { target: { value: 'New buzz' } })

  const submitButton = getByRole('button', { name: /buzz/i })
  fireEvent.click(submitButton)

  await findByText('New buzz')
})
```

## Component Documentation

Each component should include:

1. **Purpose**: What the component does
2. **Props**: Expected props and types
3. **Usage**: Example usage code
4. **State**: Internal state description
5. **Side Effects**: API calls, subscriptions, etc.

Example:
```javascript
/**
 * BuzzRenderer
 *
 * Renders buzz content with markdown support, link previews,
 * and embedded media.
 *
 * @param {string} content - The buzz text content
 * @param {string} author - Author username
 * @param {object} metadata - JSON metadata with tags, images, etc.
 * @param {boolean} preview - Show preview mode
 *
 * @example
 * <BuzzRenderer
 *   content="Check out this link!"
 *   author="alice"
 *   metadata={{ tags: ['test'], links: [...] }}
 * />
 */
```

## Component Metrics

| Category | Count | Avg Lines | Purpose |
|----------|-------|-----------|---------|
| Pages | 18 | ~400 | Route handlers |
| Sections | 22 | ~300 | Feature sections |
| Common | 28 | ~200 | Shared components |
| Modals | 35 | ~250 | Dialogs |
| Layouts | 13 | ~150 | Structure |
| Elements | 10+ | ~50 | Primitives |
| Wrappers | 4 | ~100 | HOCs |
| Skeletons | 8 | ~50 | Loading states |
