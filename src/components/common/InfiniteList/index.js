import React from 'react'
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import { PostList } from 'components'


class InfiniteList extends React.Component {
  constructor(props) {
    super()
    this.cellMeasurerCache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  }

  render() {
    const { onScroll, items } = this.props

    const isRowLoaded = ({ index }) => {
      return !!items[index]
    }

    const rowRenderer = ({ index, parent, key, style }) => {
      console.log({ index })
      return (
        <CellMeasurer
          key={key}
          cache={this.cellMeasurerCache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={style}>
            {/* <h4 style={{ color: 'white' }}>{index}</h4> */}
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
      <div className="InfinteList">
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
      </div>
    )
  }
}

export default InfiniteList
