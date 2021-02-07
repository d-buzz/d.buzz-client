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
          <div style={style}>
            <PostList
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
            />
          </div>
        </CellMeasurer>
      )
    }

    return (
      <React.Fragment>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={onScroll}
          rowCount={10000000}
          ref={ref => (this.infiniteLoaderRef = ref)}
          threshold={2}
        >
          {({ onRowsRendered }) => (
            <WindowScroller onScroll={clearScrollPosition}>
              {({height, isScrolling, onChildScroll, scrollTop}) => (
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
        </InfiniteLoader>
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
