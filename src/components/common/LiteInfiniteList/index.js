import React, { useEffect, useMemo } from 'react'
import { LitePostList } from 'components'
import { clearScrollIndex } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PostlistSkeleton from 'components/skeleton/PostlistSkeleton'

const PostListWrapper = ({ ...postListProps }) => {
  return <LitePostList {...postListProps} />
}

const LiteInfiniteList = ({
  loading,
  onScroll,
  items,
  unguardedLinks,
  clearScrollIndex,
  title = false,
  disableOpacity = true,
  loadPockets,
  selectedPocket,
}) => {
  
  const posts = useMemo(() => {
    const userData = JSON.parse(localStorage.getItem('customUserData'))
    const showNSFWPosts = userData?.settings?.showNSFWPosts
  
    if (showNSFWPosts !== 'disabled') {
      return items
    } else {
      return (
        items?.filter((item) => !item?.json_metadata?.tags?.includes('nsfw'))?.filter((item) => !item?.json_metadata?.tags?.includes('NSFW')) || []
      )
    }
  }, [items])

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log('Triggering onScroll')
        onScroll()
      }
    }

    window.addEventListener('scroll', handleScroll) 

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loading, items, onScroll])

  return (
    <div className='infinite-list'>
      {posts.map((post, index) => (
        <PostListWrapper
          postType={posts[index].__typename}
          key={index}
          app={post.app}
          disableOpacity={disableOpacity}
          displayTitle={title}
          title={post.title}
          unguardedLinks={unguardedLinks}
          profileRef="home"
          profile={post.author.profile}
          did={post.__typename === 'CeramicPost' ? post.author.username : ''}
          author={post?.author?.username}
          authorName={post?.author?.profile?.name}
          permlink={post.permlink}
          created={post.created_at}
          body={post.body}
          replyCount={post.children.length}
          meta={post.json_metadata}
          total_payout_value={posts[index].stats?.total_hive_reward || 0.00}
          pending_payout_value={posts[index].pending_payout_value}
          max_accepted_payout={posts[index].max_accepted_payout}
          item={post}
          selectedPocket={selectedPocket}
          loadPockets={loadPockets}
        />
      ))}
      <PostlistSkeleton loading={loading} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  scrollToIndex: state.interfaces.get('scrollIndex'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearScrollIndex,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LiteInfiniteList)
