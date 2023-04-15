import React from 'react'
import { AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List } from 'react-virtualized';
import Post from '../Post';

const InfinitePostList = ({ items, loadMorePosts }) => {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const isRowLoaded = ({ index }) => !!items[index];

  const rowRenderer = ({ index, key, parent, style }) => {
    const post = items[index];
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <div ref={registerChild} key={key} style={style}>
            {post && <Post post={post} />}
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMorePosts}
      rowCount={items.length + 1}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={registerChild}
              deferredMeasurementCache={cache}
              height={height}
              onRowsRendered={onRowsRendered}
              rowCount={items.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
}

export default InfinitePostList