import { gql } from "@apollo/client"

export const PROFILE_POSTS_QUERY = gql`
  query ProfilePosts($did: String!) {
    socialFeed(feedOptions: { byCreator: { _eq: $did } }) {
      items {
        author {
          username
        }
        parent_author
        permlink
        parent_permlink
        body
        title
        created_at
        updated_at
        children {
          parent_author
          parent_permlink
          permlink
          title
          body
          created_at
          updated_at
        }
        stats {
          num_comments
          num_votes
          total_hive_reward
        }
      }
    }
  }
`
export const TRENDING_POSTS_QUERY = gql`
  query TrendingPageRequest {
    trendingFeed(feedOptions: {byApp: {_eq: "dBuzz"} includeCeramic: true}) {
      items {
  ... on CeramicPost {
          __typename
          author {
            id
            username
          }
          parent_author
          permlink
          parent_permlink
          body
          title
          created_at
          updated_at
          app_metadata
          json_metadata {
            app
          }
          children {
            parent_author
            parent_permlink
            permlink
            title
            body
            created_at
            updated_at
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
        }
        
        ... on HivePost {
          __typename
          author {
            username
          }
          parent_author
          permlink
          parent_permlink
          body
          title
          created_at
          updated_at
          app_metadata
          json_metadata {
            app
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
          hive_rewards
          children {
            parent_author
            parent_permlink
            permlink
            title
            body
            created_at
            updated_at
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
        }
      }
    }
  }
`

export const TODAY_POSTS_QUERY = gql`
  query TodayPageRequest {
    socialFeed(feedOptions: {byApp: {_eq: "dBuzz"} includeCeramic: true}) {
      items {
        ... on CeramicPost {
                __typename
                author {
                  id
                  username
                }
                parent_author
                permlink
                parent_permlink
                body
                title
                created_at
                updated_at
                app_metadata
                json_metadata {
                  app
                }
                children {
                  parent_author
                  parent_permlink
                  permlink
                  title
                  body
                  created_at
                  updated_at
                }
                stats {
                  num_comments
                  num_votes
                  total_hive_reward
                }
              }
              
        ... on HivePost {
          __typename
          author {
            username
          }
          parent_author
          permlink
          parent_permlink
          body
          title
          created_at
          updated_at
          app_metadata
          json_metadata {
            app
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
          hive_rewards
          children {
            parent_author
            parent_permlink
            permlink
            title
            body
            created_at
            updated_at
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
        }
      }
    }
  }
`

export const ACCOUNT_POSTS_QUERY = gql`
  query AccountPostsRequest($user: String!) {
    socialFeed(feedOptions: {byCreator: {_eq: $user} includeCeramic: true}) {
      items {
        ... on CeramicPost {
                __typename
                author {
                  id
                  username
                }
                parent_author
                permlink
                parent_permlink
                body
                title
                created_at
                updated_at
                app_metadata
                json_metadata {
                  app
                }
                children {
                  parent_author
                  parent_permlink
                  permlink
                  title
                  body
                  created_at
                  updated_at
                }
                stats {
                  num_comments
                  num_votes
                  total_hive_reward
                }
              }
              
        ... on HivePost {
          __typename
          author {
            username
          }
          parent_author
          permlink
          parent_permlink
          body
          title
          created_at
          updated_at
          app_metadata
          json_metadata {
            app
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
          hive_rewards
          children {
            parent_author
            parent_permlink
            permlink
            title
            body
            created_at
            updated_at
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
        }
      }
    }
  }
`

export const HOME_POSTS_QUERY = gql`
  query HomePageRequest($user: String!) {
    socialFeed(feedOptions: {byFollower: $user includeCeramic: true}) {
      items {
        ... on CeramicPost {
                __typename
                author {
                  id
                  username
                }
                parent_author
                permlink
                parent_permlink
                body
                title
                created_at
                updated_at
                children {
                  parent_author
                  parent_permlink
                  permlink
                  title
                  body
                  created_at
                  updated_at
                }
                stats {
                  num_comments
                  num_votes
                  total_hive_reward
                }
              }
              
        ... on HivePost {
          __typename
          author {
            username
          }
          parent_author
          permlink
          parent_permlink
          body
          title
          created_at
          updated_at
          children {
            parent_author
            parent_permlink
            permlink
            title
            body
            created_at
            updated_at
          }
          app_metadata
          json_metadata {
            app
          }
          stats {
            num_comments
            num_votes
            total_hive_reward
          }
          hive_rewards
        }
      }
    }
  }
`

export const TRENDING_TAGS_QUERY = () => {
  return gql`
  query TrendingTags {
    trendingTags(limit: 10) {
      tags {
        score
        tag
      }
    }
  }
  `
}

export const PROFILE_QUERY = gql`
  query ProfileRequest($id: String!) {
    profile(id: $id) {
      ... on HiveProfile {
        id
        username
        name
        src
        location
        json_metadata
        images {
          avatar
          cover
        }
        about
        website
      }
      ... on CeramicProfile {
        id
        did
        name
        about
        location
        src
        website
        images {
          avatar
          cover
        }
      }
    }
  }
`