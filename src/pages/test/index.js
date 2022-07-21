import { InfiniteLoader, List } from 'react-virtualized'

const InfinityA = ({
    hasNextPage,
    isNextPageLoading,
    list,
    loadNextPage,
}) => {
    const rowCount = hasNextPage ? list.size + 1 : list.size;
    const loadMoreRows = isNextPageLoading ? () => { } : loadNextPage;
    const isRowLoaded = ({ index }) => !hasNextPage || index < list.size;
    const rowRenderer = ({ index, key, style }) => {
        let content;
        if (!isRowLoaded({ index })) {
            content = 'Loading...';
        } else {
            content = list.getIn([index, 'name']);
        }

        return (
            <div key={key} style={style}>
                {content}
            </div>
        );
    };

    return (
        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={rowCount}>
            {({ onRowsRendered, registerChild }) => (
                <List
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={rowRenderer}
                />
            )}
        </InfiniteLoader>
    );
}

export default InfinityA