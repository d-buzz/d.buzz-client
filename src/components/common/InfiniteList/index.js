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
    } = this.props

    const clearOutlineStyle = { outline: 'none' }

    const isRowLoaded = ({ index }) => {
      return !!items[index]
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
                  title={items[index].title}
                  unguardedLinks={unguardedLinks}
                  profileRef="home"
                  active_votes={items[index].active_votes}
                  author={items[index].author}
                  permlink={items[index].permlink}
                  created={items[index].created}
                  body={items[index].body}
                  upvotes={items[index].active_votes.length}
                  upvoteList={items[index].active_votes}
                  replyCount={items[index].children}
                  meta={items[index].json_metadata}
                  payout={items[index].payout}
                  total_payout_value={items[index].total_payout_value}
                  pending_payout_value={items[index].pending_payout_value}
                  max_accepted_payout={items[index].max_accepted_payout}
                  payoutAt={items[index].payout_at}
                  cashout_time={items[index].cashout_time}
                  scrollIndex={index}
                  recomputeRowIndex={recomputeRowIndex}
                  muteTrigger={muteTrigger}
                  item={items[index]}
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
                app={items[index].app}
                type='CERAMIC'
                disableOpacity={disableOpacity}
                displayTitle={title}
                title={items[index].title}
                unguardedLinks={unguardedLinks}
                profileRef="home"
                author={items[index].author}
                permlink={items[index].stream_id}
                created={items[index].created_at}
                body={items[index].body}
                replyCount={items[index].children.length}
                meta={items[index].json_metadata}
                pending_payout_value={items[index].pending_payout_value}
                scrollIndex={index}
                recomputeRowIndex={recomputeRowIndex}
                muteTrigger={muteTrigger}
                item={items[index]}
                loadPockets={loadPockets}
              />
            </ResizeObserver>
          )}
        </CellMeasurer>
      )
    }

    return (
      <React.Fragment>
        {!items[0]?.stream_id ?
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
                          rowCount={items.length || 0}
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
                          rowCount={items.length || 0}
                          autoHeight
                          width={width}
                          height={height}
                          rowHeight={this.cellMeasurerCache.rowHeight}
                          rowRenderer={ceramicRowRenderer}
                          deferredMeasurementCache={this.cellMeasurerCache}
                          overscanRowCount={2}
                          // onRowsRendered={onRowsRendered}
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
