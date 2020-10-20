import {
  AppFrame,
  TermsConditions,
  Home,
  Trending,
  Profile,
  Content,
  Latest,
  Landing,
  AccountPosts,
  AccountReplies,
  AccountFollowers,
  AccountFollowing,
  Notification,
  Tags,
  Search,
  SearchPosts,
  SearchPeople,
  PrivacyPolicy,
  Disclaimer,
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
        path: '/ug',
        exact: true,
        component: Landing,
      },
      {
        path: '/ug/tags',
        component: Tags,
      },
      {
        path: '/ug/@:username/c/:permlink',
        exact: true,
        component: Content,
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
        path: '/ug/@:username',
        component: Profile,
        routes: [
          {
            path: '/ug/@:username/',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/ug/@:username/t/buzz',
            exact: true,
            component: AccountPosts,
          },
          {
            path: '/ug/@:username/t/replies',
            exact: true,
            component: AccountReplies,
          },
          {
            path: '/ug/@:username/t/followers',
            exact: true,
            component: AccountFollowers,
          },
          {
            path: '/ug/@:username/t/following',
            exact: true,
            component: AccountFollowing,
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
            path: '/@:username/t/followers',
            exact: true,
            component: AccountFollowers,
          },
          {
            path: '/@:username/t/following',
            exact: true,
            component: AccountFollowing,
          },
        ],
      },
    ],
  },
]

export default routes
