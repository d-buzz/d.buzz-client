# D.Buzz Frontend

## Introduction to D.Buzz

### D.Buzz: A New Era of Social Media on the Hive Blockchain

D.Buzz is an innovative social media platform that reimagines online social interaction. Built on the Hive blockchain, it stands out for its decentralized nature and focus on user empowerment. Unlike conventional social media, D.Buzz prioritizes freedom of speech and privacy, utilizing blockchain technology to enhance user experience.

#### Key Features:

- **Decentralization:** DBuzz operates without a central authority, promoting free expression and minimizing censorship, thanks to its Hive blockchain foundation.
- **Content Monetization:** Users can earn Hive tokens through their content, providing a unique way to gain rewards for their creative efforts.
- **Community Governance:** With a stake-based governance system, users holding more Hive tokens have a greater say in content moderation and platform direction.
- **Transparency and Security:** Leveraging blockchain technology, D.Buzz ensures secure and transparent record-keeping of all interactions.
- **User-Friendly Interface:** Despite its advanced backend, D.Buzz offers an interface similar to mainstream social media, complete with familiar features.
- **Hive Integration:** Being part of the Hive ecosystem, the platform smoothly integrates with Hive, enhancing the experience for blockchain enthusiasts.

#### Conclusion:

D.Buzz represents a significant development in the intersection of social media and blockchain technology, offering a platform where user rights, creativity, and secure, transparent governance are key. It's an exciting step forward for those seeking a more decentralized and rewarding social media experience.

# D.Buzz Frontend

This is the frontend codebase that powers the D.Buzz social platform. It is built using React and Redux.

## Overview and Main Pages

The project's frontend is structured around several key pages, each serving a distinct purpose within the D.Buzz platform:

- **Home (`Home`)**: This page component shows the latest posts across the platform.
- **Landing (`Landing`)**: This page is similar to the Home page but is specifically tailored for unauthenticated users, showcasing trending posts to give a glimpse of the platform's activity.
- **Profile (`Profile`)**: The user profile page provides detailed information about users, including their posts, replies, wallet transactions, and settings. It also includes sub-routes for additional profile-related views.
- **Wallet (`Wallet`)**: Users can view their wallet balances and transaction history on this page, managing their Hive blockchain financial activities.
- **Search (`Search`)**: This page allows users to search for posts and other users on the platform, providing a search results page to display the findings.
- **Content (`Content`)**: A detailed view for individual posts or comments, including the ability to view and post replies.

The frontend utilizes Redux for global state management, with Sagas handling data fetching asynchronously. React Router is employed for navigation and routing across the platform, ensuring users can smoothly transition between pages. Additionally, the `components/` directory contains reusable UI components that are utilized throughout the application to maintain a consistent look and feel.

## Data Fetching

Data is fetched from the D.Buzz endpoint server using Redux Sagas. The main requests are handled in `services/api.js`, which contains the API calls to the D.Buzz server. These calls are made to the D.Buzz endpoint server which provides the necessary API calls that are not available through the standard Hive blockchain API.

The API calls include fetching posts, comments, user profiles, and other related data. The `SEARCH_API` uses the D.Buzz endpoint server to provide the necessary API calls that are not available through the standard Hive blockchain API. The data is retrieved using JSON-RPC calls over HTTP to `rpc.d.buzz`. The responses from these calls are then processed and managed within the Redux store, with related actions and reducers located in `store/*.js`.

The `services/api.js` file abstracts the complexity of direct blockchain interactions and provides simple methods that are used throughout the application to request and receive data from the Hive blockchain.

## Components

Reusable components are located in `components/`. This includes common UI elements in `elements/` as well as core containers like:

### Pages
- `Home` - The main landing page component for authenticated users.
- `Landing` - The landing page for unauthenticated users, showcasing trending posts.
- `Content` - A detailed view for individual posts or comments.
- `Profile` - The user profile page with detailed information and sub-routes.
- `Wallet` - Users can view their wallet balances and transaction history.
- `Search` - Allows users to search for posts and other users on the platform.
- `Latest` - Displays the latest posts across the platform.
- `Tags` - Shows posts associated with specific tags.
- `Trending` - Lists trending posts based on user interactions.
- `GetStarted` - Provides information for new users on how to get started.
- `TermsConditions` - Outlines the terms and conditions of using the platform.
- `PrivacyPolicy` - Details the privacy policy of the platform.
- `Developers` - Information and tools for developers.

### Common
- `HelmetGenerator` - Manages changes to the document head.
- `InfiniteList` - Infinite scroll post list.
- `ReplyList` - Display list of replies.
- `PostList` - Display list of posts.
- `Avatar` - Displays user avatars.

### Form
- `CreateBuzzForm` - Form for creating new buzzes.

### Modal
- `WhatsNewModal` - Modal for displaying new features or announcements.
- `EventsModal` - Modal for displaying upcoming events.
- `AddToPocketModal` - Modal for adding posts to a user's bookmarks.
- `ViewImageModal` - Modal for viewing images in posts.
- `LinkConfirmationModal` - Modal for confirming external links.
- `DeleteBuzzModal` - Modal for confirming deletion of a buzz.

### Profile
- `ProfileSkeleton` - Skeleton screen for profile loading state.
- `EditProfileModal` - Modal for editing user profile.
- `HiddenBuzzListModal` - Modal for managing hidden buzzes.

### Element
- `Spinner` - Loading spinner animation.
- `ContainedButton` - A styled button element.
- `MoreCircleIconRed` - A styled icon for more options.
- `CustomizedMenu` - A custom menu component.

### Skeleton
- `ContentSkeleton` - Skeleton screen for content loading state.
- `ReplylistSkeleton` - Skeleton screen for reply list loading state.

### Other
- `VoteListDialog` - Dialog for displaying list of votes.
- `UpdateFormModal` - Modal for updating posts.
- `UserDialog` - Dialog for displaying user information.
- `TwitterEmbedAPI` - Component for embedding Twitter posts.
- `Notification` - Component for displaying notifications.

## Styling

The site uses JSS for styling components. The main theme file with base styles is `services/theme.js` and components define styles using `react-jss`.

## Development

To run locally:

```
yarn install
yarn start
```

This will start the dev server at http://localhost:3000.

To run tests:

```
yarn test
```

This will execute the test suite and output the results.

## Embedding the Buzz Button

The Buzz Button allows users to easily share content on DBuzz from any website. To embed the Buzz Button, include the following anchor element with the `dbuzz-share-button` class in your HTML:

```html
<a class="dbuzz-share-button" href="WEB_INTENT_URL">Buzz</a>
```

Replace `WEB_INTENT_URL` with the URL to the DBuzz Web Intent Composer. You can customize the button using `data-*` attributes for text, size, hashtags, and minimum character count.

Include the `buzzWidget.js` script in your page template to enable the Buzz Button:

```html
<script type="text/javascript" src="BUZZ_WIDGET_JS_URL"></script>
```

Replace `BUZZ_WIDGET_JS_URL` with the URL to the `buzzWidget.js` script.

## Build & Deploy

To create a production build:

```
yarn build 
```

The app is configured to build from the `master` branch.

## Contributing

We warmly welcome community contributions to D.Buzz. Whether it's reporting bugs, suggesting enhancements, or submitting pull requests for bug fixes and new features, your involvement is invaluable to the project.

### How to Contribute:

1. **Clone and Branch:** Start by cloning the `dev` branch: `git clone -b dev https://github.com/d-buzz/d.buzz-client.git`. Create a local branch for your contributions.
2. **Develop and Test:** Make your changes and test them thoroughly. Please adhere to the coding conventions and guidelines as outlined in our documentation.
3. **Open a Pull Request (PR):** Once you're ready, open a PR against the `dev` branch. Ensure your PR description clearly explains your changes or the issue it resolves.
4. **Review Process:** Your PR will be reviewed by the maintainers. This process ensures that the codebase remains consistent and that the quality of the project is maintained.
5. **Deployment:**
- **Testnet:** Changes merged into the `dev` branch will be deployed to the `testnet` branch for beta testing.
- **Mainnet:** Once we confirm the stability of the changes on `testnet`, they will be merged into the `stable` branch and subsequently deployed to the `mainnet` for production.

### Guidelines:

- **Issues and Pull Requests:** Before creating new issues or pull requests, please check existing ones to avoid duplicates.
- **Commit Messages:** Follow our commit message conventions for clarity. [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716).
- **Code Style:** Ensure your code follows the established style of the project to maintain consistency.

### Community Engagement:

- Join the conversation: For any questions, support, or bug reporting, visit our [community chat](https://chat.d.buzz).
- Stay Informed: Keep up with the latest developments and participate in discussions.

Your contributions, big or small, play a significant part in the evolution of D.Buzz. We thank you for your support and enthusiasm!

## Lite Accounts with MetaMask and Ceramic Network

D.Buzz now supports lite accounts, allowing users to log in using their MetaMask wallets and interact with the Ceramic Network. This integration provides a seamless experience for users who prefer to use their Ethereum credentials and decentralized identity profiles.

### MetaMask Login

Users can easily log in to D.Buzz using their MetaMask wallet. This feature leverages the widely-used Ethereum wallet to authenticate users without the need for traditional sign-up processes.

### Ceramic Network Integration

Ceramic Network is a decentralized data network that enables the creation, hosting, and sharing of data without centralized control. By integrating with Ceramic, D.Buzz allows users to manage their decentralized identities and store data in a secure, user-controlled environment.

## Accessing Lite Accounts

To work with lite accounts, you need to switch to the `lite` branch in the project repository. You can do this by running the following commands in your terminal:

```sh
git checkout lite
```

This will switch your local workspace to the `lite` branch where you can make changes and test lite account features.

## License

This project is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

For more information, please refer to <http://unlicense.org/>

## Contact, Support, and Reporting Issues

For any questions, support issues, or to report bugs with the platform, please visit our chat at <https://chat.d.buzz>. We appreciate your contributions to improving D.Buzz.

### Testing
Perform a lint test:
`npm run lint`

### Commit Messages
We use Semantic Commit Messages:
https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

### Versioning
We use Semantic Versioning for our releases:
https://semver.org/



