import React, { useEffect, useMemo, useCallback } from 'react'
import { PostList, PostlistSkeleton } from 'components'
import { clearScrollIndex } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const PostListWrapper = ({ ...postListProps }) => {
  return <PostList {...postListProps} />
}

const InfiniteList = ({
  onScroll,
  items,
  loading,
  unguardedLinks,
  clearScrollIndex,
  scrollToIndex,
  title = false,
  disableOpacity = true,
  loadPockets,
  selectedPocket,
}) => {
  // Memoize localStorage parsing and NSFW filtering to prevent repeated parsing on every render
  const posts = useMemo(() => {
    // Parse localStorage once
    const showNSFW = JSON.parse(localStorage.getItem('customUserData'))?.settings?.showNSFWPosts !== 'disabled'

    if (showNSFW) {
      return items || []
    }

    // Single filter pass instead of two separate filter calls
    return items?.filter((item) => {
      const tags = item?.json_metadata?.tags ?? []
      return !tags.includes('nsfw') && !tags.includes('NSFW')
    }) ?? []
  }, [items])

  // Memoize scroll handler to prevent recreating on every render
  const handleScroll = useCallback(() => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 250)) {
      onScroll()
    }
  }, [onScroll])

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className='infinite-list'>
      {posts.map((post, index) => (
        <PostListWrapper
          key={post.id || index}
          disableOpacity={disableOpacity}
          displayTitle={title}
          title={posts[index].title}
          unguardedLinks={unguardedLinks}
          profileRef="home"
          active_votes={posts[index].active_votes}
          author={posts[index].author}
          permlink={posts[index].permlink}
          created={posts[index].created}
          body={posts[index].body}
          upvotes={posts[index].active_votes.filter(v => v.rshares >= 0).length}
          upvoteList={posts[index].active_votes.filter(v => v.rshares >= 0)}
          replyCount={posts[index].children}
          meta={posts[index].json_metadata}
          payout={posts[index].payout}
          total_payout_value={posts[index].total_payout_value}
          pending_payout_value={posts[index].pending_payout_value}
          max_accepted_payout={posts[index].max_accepted_payout}
          payoutAt={posts[index].payout_at}
          cashout_time={posts[index].cashout_time}
          scrollIndex={index}
          type="HIVE"
          // muteTrigger={muteTrigger}
          item={posts[index]}
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

// Wrap with React.memo to prevent unnecessary re-renders
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(InfiniteList))
