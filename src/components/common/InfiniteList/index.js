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


class InfiniteList extends PureComponent {
  constructor() {
    super()
    this.cellMeasurerCache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  }

  componentDidMount() { //Really important !!
    this.cellMeasurerCache.clearAll() //Clear the cache if row heights are recompute to be sure there are no "blank spaces" (some row are erased)
    this.listRef && this.listRef.recomputeRowHeights()
  }

  render() {
    const { onScroll, items, loading } = this.props

    const isRowLoaded = ({ index }) => {
      return !!items[index]
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
              profile={items[index].profile}
              payoutAt={items[index].payout_at}
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
            <WindowScroller>
              {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
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
                        registerChild(el)
                      }}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                    />
                  )}
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

export default InfiniteList
