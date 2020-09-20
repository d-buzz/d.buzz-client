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

  componentDidMount() {
    // this.cellMeasurerCache.clearAll()
    // if (this.props.scrollToIndex < 0) {
    //   return
    // }

    // const initial_top = this.listRef.getOffsetForRow({
    //   alignment: 'start',
    //   index: this.props.scrollToIndex,
    // })

    // console.log({ initial_top })

    // window.scrollTo(0, initial_top-100)
    // this.listRef.scrollToRow(this.props.scrollToIndex)
  }


  render() {
    const {
      onScroll,
      items,
      loading,
      unguardedLinks,
      scrollToIndex,
      clearIndex,
    } = this.props

    console.log({ scrollToIndex })

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
              profile={items[index].profile}
              payoutAt={items[index].payout_at}
              scrollIndex={index}
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
            <WindowScroller onScroll={clearIndex}>
              {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
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
                          registerChild(el)
                        }}
                        isScrolling={isScrolling}
                        scrollToAlignment="start"
                        scrollToIndex={scrollToIndex}
                        onScroll={onChildScroll}
                        scrollTop={scrollTop}
                        style={{ outline: 'none' }}
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

export default InfiniteList
