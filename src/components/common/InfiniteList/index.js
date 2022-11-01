import React, { PureComponent } from 'react'
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import { PostList, PostlistSkeleton } from 'components'
import { clearScrollIndex } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ResizeObserver from 'rc-resize-observer'
class InfiniteList extends PureComponent {
  constructor() {
    super()
    this.cellMeasurerCache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  }

  render() {
    const {
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
    } = this.props
    
    const posts = JSON.parse(localStorage.getItem('customUserData'))?.settings?.showNSFWPosts !== 'disabled' ? items : items?.filter((item) => !item?.json_metadata?.tags?.includes('nsfw'))?.filter((item) => !item?.json_metadata?.tags?.includes('NSFW')) || []

    const clearOutlineStyle = { outline: 'none' }

    const isRowLoaded = ({ index }) => {
      return !!posts[index]
    }

    const clearScrollPosition = () => {
      clearScrollIndex()
    }

    const recomputeRowIndex = (index) => {
      this.cellMeasurerCache.clear(index, 0)
      this.listRef.recomputeRowHeights(index)
    }

    const muteTrigger = () => {
      this.cellMeasurerCache.clearAll()
      this.listRef.recomputeRowHeights()
    }

    const rowRenderer = ({ index, parent, key, style }) => {
      return (
        <CellMeasurer
          key={key}
          cache={this.cellMeasurerCache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({measure}) => (
            <ResizeObserver onResize={measure}>
              <div style={style}>
                <PostList
                  type='HIVE'
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
                  upvotes={posts[index].active_votes.length}
                  upvoteList={posts[index].active_votes}
                  replyCount={posts[index].children}
                  meta={posts[index].json_metadata}
                  payout={posts[index].payout}
                  total_payout_value={posts[index].total_payout_value}
                  pending_payout_value={posts[index].pending_payout_value}
                  max_accepted_payout={posts[index].max_accepted_payout}
                  payoutAt={posts[index].payout_at}
                  cashout_time={posts[index].cashout_time}
                  scrollIndex={index}
                  recomputeRowIndex={recomputeRowIndex}
                  muteTrigger={muteTrigger}
                  item={posts[index]}
                  selectedPocket={selectedPocket}
                  loadPockets={loadPockets}
                />
              </div>
            </ResizeObserver>
          )}
        </CellMeasurer>
      )
    }
    const ceramicRowRenderer = ({ index, parent, key, style }) => {
      return (
        <CellMeasurer
          key={key}
          cache={this.cellMeasurerCache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({measure}) => (
            <ResizeObserver onResize={measure}>
              <PostList
                app={posts[index].app}
                type='CERAMIC'
                disableOpacity={disableOpacity}
                displayTitle={title}
                title={posts[index].title}
                unguardedLinks={unguardedLinks}
                profileRef="home"
                author={posts[index].author}
                permlink={posts[index].stream_id}
                created={posts[index].created_at}
                body={posts[index].body}
                replyCount={posts[index].children.length}
                meta={posts[index].json_metadata}
                pending_payout_value={posts[index].pending_payout_value}
                scrollIndex={index}
                recomputeRowIndex={recomputeRowIndex}
                muteTrigger={muteTrigger}
                item={posts[index]}
                selectedPocket={selectedPocket}
                loadPockets={loadPockets}
              />
            </ResizeObserver>
          )}
        </CellMeasurer>
      )
    }

    return (
      <React.Fragment>
        {!posts[0]?.stream_id ?
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={onScroll}
            rowCount={10000000}
            ref={ref => (this.infiniteLoaderRef = ref)}
            threshold={2}
          >
            {({ onRowsRendered }) => (
              <WindowScroller onScroll={clearScrollPosition}>
                {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => {
                      return (
                        <List
                          rowCount={posts.length || 0}
                          autoHeight
                          width={width}
                          height={height}
                          rowHeight={this.cellMeasurerCache.rowHeight}
                          rowRenderer={rowRenderer}
                          deferredMeasurementCache={this.cellMeasurerCache}
                          overscanRowCount={2}
                          onRowsRendered={onRowsRendered}
                          ref={el => {
                            this.listRef = el
                            if (el instanceof Element) { registerChild(el) }
                          }}
                          isScrolling={isScrolling}
                          scrollToAlignment="center"
                          scrollToIndex={scrollToIndex}
                          onScroll={onChildScroll}
                          scrollTop={scrollTop}
                          style={clearOutlineStyle}
                        />
                      )
                    }}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader> :
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={onScroll}
            rowCount={10000000}
            ref={ref => (this.infiniteLoaderRef = ref)}
            threshold={2}
          >
            {({ onRowsRendered }) => (
              <WindowScroller onScroll={clearScrollPosition}>
                {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => {
                      return (
                        <List
                          rowCount={posts.length || 0}
                          autoHeight
                          width={width}
                          height={height}
                          rowHeight={this.cellMeasurerCache.rowHeight}
                          rowRenderer={ceramicRowRenderer}
                          deferredMeasurementCache={this.cellMeasurerCache}
                          overscanRowCount={2}
                          onRowsRendered={onRowsRendered}
                          ref={el => {
                            this.listRef = el
                            if (el instanceof Element) { registerChild(el) }
                          }}
                          isScrolling={isScrolling}
                          scrollToAlignment="center"
                          scrollToIndex={scrollToIndex}
                          onScroll={onChildScroll}
                          scrollTop={scrollTop}
                          style={clearOutlineStyle}
                        />
                      )
                    }}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>}
        <PostlistSkeleton loading={loading} />
      </React.Fragment>
    )
  }
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
