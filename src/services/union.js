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
        title
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
            username
            id
            profile {
              ... on CeramicProfile {
                id
                did
                name
                images {
                  cover
                  avatar
                }
                location
                src
                website
                about
              }
            }
          }
          parent_author
          permlink
          parent_permlink
          title
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
            id
            profile {
              ... on HiveProfile {
                id
                name
                images {
                  cover
                  avatar
                }
                location
                src
                website
                about
              }
            }
          }
          parent_author
          permlink
          parent_permlink
          title
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
                  username
                  id
                  profile {
                    ... on CeramicProfile {
                      id
                      did
                      name
                      images {
                        cover
                        avatar
                      }
                      location
                      src
                      website
                      about
                    }
                  }
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
            id
            profile {
              ... on HiveProfile {
                id
                did
                name
                images {
                  cover
                  avatar
                }
                location
                src
                website
                about
              }
            }
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
                  username
                  id
                  profile {
                    ... on CeramicProfile {
                      id
                      did
                      name
                      images {
                        cover
                        avatar
                      }
                      location
                      src
                      website
                      about
                    }
                  }
                }
                parent_author
                permlink
                parent_permlink
                body
                title
                created_at
                updated_at
                app_metadata
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
            id
            profile {
              ... on HiveProfile {
                id
                did
                name
                images {
                  cover
                  avatar
                }
                location
                src
                website
                about
              }
            }
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
                  username
                  id
                  profile {
                    ... on CeramicProfile {
                      id
                      did
                      name
                      images {
                        cover
                        avatar
                      }
                      location
                      src
                      website
                      about
                    }
                  }
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
            id
            profile {
              ... on HiveProfile {
                id
                did
                name
                images {
                  cover
                  avatar
                }
                location
                src
                website
                about
              }
            }
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

export const SINGLE_POST_QUERY = gql`
query SinglePostRequest($permalink: String!, $author: String!) {
  socialPost(permlink: $permalink, author: $author) {
    __typename
    ... on HivePost {
        author {
          profile {
          ... on HiveProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            json_metadata
            location
            src
            username
            website
          }
        }
      }
      title
      body
      permlink
      tags
      updated_at
      created_at
      stats {
        num_comments
        num_votes
        total_hive_reward
      }
      hive_rewards
      parent_author
      parent_permlink
      children {
        author {
          profile {
          ... on HiveProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            json_metadata
            location
            src
            username
            website
          }
          
          ... on CeramicProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            location
            src
            website
          }
        }
        }
        body
        created_at
        parent_author
        parent_permlink
        permlink
        stats {
          num_comments
          num_votes
          total_hive_reward
        }
        title
        updated_at
        
              children {
        author {
          profile {
          ... on HiveProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            json_metadata
            location
            src
            username
            website
          }
          
          ... on CeramicProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            location
            src
            website
          }
        }
        }
        body
        created_at
        parent_author
        parent_permlink
        permlink
        stats {
          num_comments
          num_votes
          total_hive_reward
        }
        title
        updated_at
      }
      }
      author {
        profile {
          ... on HiveProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            json_metadata
            location
            src
            username
            website
          }
          
          ... on CeramicProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            location
            src
            website
          }
        }
        id
        username
      }
      app_metadata
    }
    ... on CeramicPost {
      parent_author
      parent_permlink
      author {
          profile {
          ... on CeramicProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            location
            src
            website
          }
        }
      }
      children {
        body
        author {
          id
          profile {
            ... on HiveProfile {
              id
              name
              about
              did
              images {
                avatar
                cover
              }
              json_metadata
              location
              src
              username
              website
            }
            ... on CeramicProfile {
              id
              name
              about
              did
              images {
                avatar
                cover
              }
              location
              src
              website
            }
          }
        }
        
              children {
        author {
          profile {
          ... on HiveProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            json_metadata
            location
            src
            username
            website
          }
          
          ... on CeramicProfile {
            id
            name
            about
            did
            images {
              avatar
              cover
            }
            location
            src
            website
          }
        }
        }
        body
        created_at
        parent_author
        parent_permlink
        permlink
        stats {
          num_comments
          num_votes
          total_hive_reward
        }
        title
        updated_at
      }
      }
      author {
        profile {
          ... on HiveProfile {
            id
            name
            images {
              avatar
              cover
            }
            json_metadata
            location
            src
            username
            website
            about
            did
          }
          ... on CeramicProfile {
            id
            name
            did
            about
            images {
              avatar
              cover
            }
            location
            src
            website
          }
        }
        username
        id
      }
      app_metadata
    }
  }
}
`

export const FOLLOWER_FOLLOWING_QUERY = gql`
  query FollowerFollowingQuery($id: String!) {
    follows(id: $id) {
      followers {
        followed_at
        follower
      }
      followers_count
      followings_count
      followings {
        followed_at
        follower
      }
    }
  }
`