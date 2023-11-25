import React, { useEffect } from 'react'
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

  const posts = JSON.parse(localStorage.getItem('customUserData'))?.settings?.showNSFWPosts !== 'disabled'
    ?
    items
    :
    items?.filter((item) => !item?.json_metadata?.tags?.includes('nsfw'))?.filter((item) => !item?.json_metadata?.tags?.includes('NSFW'))
    ||
    []

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 250)) {
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

export default connect(mapStateToProps, mapDispatchToProps)(InfiniteList)
