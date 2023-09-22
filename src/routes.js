import React from 'react'
const AppFrame = React.lazy(() => import('./components/layout/AppFrame'))
const TermsConditions = React.lazy(() => import('./components/pages/TermsConditions'))
const GetStarted = React.lazy(() => import('./components/pages/GetStarted'))
const Home = React.lazy(() => import('./components/pages/Home'))
const Trending = React.lazy(() => import('./components/pages/Trending'))
const FAQs = React.lazy(() => import('./components/pages/FAQs'))
const Profile = React.lazy(() => import('./components/pages/Profile'))
const Content = React.lazy(() => import('./components/pages/Content'))
const Latest = React.lazy(() => import('./components/pages/Latest'))
const AccountPosts = React.lazy(() => import('./components/sections/AccountPosts'))
const AccountReplies = React.lazy(() => import('./components/sections/AccountReplies'))
const AccountFollowers = React.lazy(() => import('./components/sections/AccountFollowers'))
const AccountFollowing = React.lazy(() => import('./components/sections/AccountFollowing'))
const AccountComments = React.lazy(() => import('./components/sections/AccountComments'))
const AccountPockets = React.lazy(() => import('./components/sections/AccountPockets'))
const AccountFollow = React.lazy(() => import('./components/sections/AccountFollow'))
const AccountMuted = React.lazy(() => import('./components/sections/AccountMuted'))
const AccountMutedUsers = React.lazy(() => import('./components/sections/AccountMutedFollowed'))
const AccountMutedFollowed = React.lazy(() => import('./components/sections/AccountMutedFollowed'))
const AccountBlacklisted = React.lazy(() => import('./components/sections/AccountBlacklisted'))
const AccountBlacklistedUsers = React.lazy(() => import('./components/sections/AccountBlacklistedUsers'))
const AccountBlacklistedFollowed = React.lazy(() => import('./components/sections/AccountBlacklistedFollowed'))
const Notification = React.lazy(() => import('./components/pages/Notification'))
const Tags = React.lazy(() => import('./components/pages/Tags'))
const Search = React.lazy(() => import('./components/pages/Search'))
const SearchPosts = React.lazy(() => import('./components/sections/SearchPosts'))
const SearchPeople = React.lazy(() => import('./components/sections/SearchPeople'))
const PrivacyPolicy = React.lazy(() => import('./components/pages/PrivacyPolicy'))
const Disclaimer = React.lazy(() => import('./components/pages/Disclaimer'))
const Developers = React.lazy(() => import('./components/pages/Developers'))
const Wallet = React.lazy(() => import('./components/pages/Wallet'))
const WalletBalances = React.lazy(() => import('./components/sections/WalletBalances'))
const WalletHistory = React.lazy(() => import('./components/sections/WalletHistory'))

const routes =  [
  {
    component: AppFrame,
    routes: [
      {
        path: '/',
        exact: true,
        component: Trending,
      },
      {
        path: '/home',
        exact: true,
        component: Home,
      },
      {
        path: '/intent/buzz',
        exact: true,
        component: Home,
      },
      {
        path: '/developers',
        exact: true,
        component: Developers,
      },
      {
        path: '/tos',
        exact: true,
        component: TermsConditions,
      },
      {
        path: '/privacy',
        exact: true,
        component: PrivacyPolicy,
      },
      {
        path: '/disclaimer',
        exact: true,
        component: Disclaimer,
      },
      {
        path: '/getstarted',
        exact: true,
        component: GetStarted,
      },
      {
        path: '/trending',
        exact: true,
        component: Trending,
      },
      {
        path: '/latest',
        exact: true,
        component: Latest,
      },
      {
        path: '/notifications',
        exact: true,
        component: Notification,
      },
      {
        path: '/FAQs',
        exact: true,
        component: FAQs,
      },
      {
        path: '/ug/search',
        component: Search,
        routes: [
          {
            path: '/ug/search/posts',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/ug/search/trending',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/ug/search/latest',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/ug/search/people',
            exact: true,
            component: SearchPeople,
          },
        ],
      },
      {
        path: '/search',
        component: Search,
        routes: [
          {
            path: '/search/posts',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/search/trending',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/search/latest',
            exact: true,
            component: SearchPosts,
          },
          {
            path: '/search/people',
            exact: true,
            component: SearchPeople,
          },
        ],
      },
      {
        path: '/@:username/wallet',
        component: Wallet,
        routes: [
          {
            path: '/@:username/wallet',
            exact: true,
            component: WalletBalances,
          },
          {
            path: '/@:username/wallet/balances',
            exact: true,
            component: WalletBalances,
          },
          {
            path: '/@:username/wallet/history',
            exact: true,
            component: WalletHistory,
          },
        ],
      },
      {
        path: '/tags',
        component: Tags,
      },
      {
        path: '/ug/tags',
        component: Tags,
      },
      {
        path: '/@:username/:permlink',
        exact: true,
        component: Content,
      },
      {
        path: '/@:username/follow',
        component: AccountFollow,
        routes: [
          {
            path: '/@:username/follow',
            exact: true,
            component: AccountFollowers,
          },
          {
            path: '/@:username/follow/followers',
            exact: true,
            component: AccountFollowers,
          },
          {
            path: '/@:username/follow/following',
            exact: true,
            component: AccountFollowing,
          },
        ],
      },
      {
        path: '/@:username/lists/muted',
        component: AccountMuted,
        routes: [
          {
            path: '/@:username/lists/muted',
            exact: true,
            component: AccountMutedUsers,
          },
          {
            path: '/@:username/lists/muted/users',
            exact: true,
            component: AccountMutedUsers,
          },
          {
            path: '/@:username/lists/muted/followed',
            exact: true,
            component: AccountMutedFollowed,
          },
        ],
      },
      {
        path: '/@:username/lists/blacklisted',
        component: AccountBlacklisted,
        routes: [
          {
            path: '/@:username/lists/blacklisted',
            exact: true,
            component: AccountBlacklistedUsers,
          },
          {
            path: '/@:username/lists/blacklisted/users',
            exact: true,
            component: AccountBlacklistedUsers,
          },
          {
            path: '/@:username/lists/blacklisted/followed',
            exact: true,
            component: AccountBlacklistedFollowed,
          },
        ],
      },
      {
        path: '/@:username',
        component: Profile,
        routes: [
          {
            path: '/@:username/',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/@:username/t/buzz',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/@:username/t/replies',
            exact: true,
            component: AccountReplies,
          },
          {
            path: '/@:username/t/comments',
            exact: true,
            component: AccountComments,
          },
          {
            path: '/@:username/t/pockets',
            exact: true,
            component: AccountPockets,
          },
          {
            path: '/@:username/t/pockets/:pocketId',
            exact: true,
            component: AccountPockets,
          },
        ],
      },
    ],
  },
]

export default routes
