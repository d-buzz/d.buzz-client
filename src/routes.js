import {
  AppFrame,
  TermsConditions,
  GetStarted,
  Home,
  Trending,
  Profile,
  Content,
  Latest,
  AccountPosts,
  AccountReplies,
  AccountFollowers,
  AccountFollowing,
  AccountComments,
  AccountFollow,
  AccountMuted,
  AccountMutedUsers,
  AccountMutedFollowed,
  AccountBlacklisted,
  AccountBlacklistedUsers,
  AccountBlacklistedFollowed,
  Notification,
  Tags,
  Search,
  SearchPosts,
  SearchPeople,
  PrivacyPolicy,
  Disclaimer,
  Developers,
  Wallet,
  WalletBalances,
  WalletHistory,
} from 'components'

const routes =  [
  {
    component: AppFrame,
    routes: [
      {
        path: '/',
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
        path: '/org/en/tos',
        exact: true,
        component: TermsConditions,
      },
      {
        path: '/org/en/privacy',
        exact: true,
        component: PrivacyPolicy,
      },
      {
        path: '/org/en/disclaimer',
        exact: true,
        component: Disclaimer,
      },
      {
        path: '/org/en/getstarted',
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
        path: '/ug/search',
        component: Search,
        routes: [
          {
            path: '/ug/search/posts',
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
            path: '/search/people',
            exact: true,
            component: SearchPeople,
          },
        ],
      },
      {
        path: '/tags',
        component: Tags,
      },
      {
        path: '/@:username/c/:permlink',
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
        ],
      },
    ],
  },
]

export default routes
