import React, { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const rowHeight = 20;

const VirtualList = ({ items, rowRenderer, height }) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  const totalHeight = items.length * rowHeight;
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(items.length - 1, Math.floor((scrollTop + height) / rowHeight));
  const visible = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * rowHeight;

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('scroll', onScroll);
    return () => el && el.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <div ref={containerRef} style={{ height, overflowY: 'auto' }} data-testid="virtual-list">
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {visible.map((item, i) => rowRenderer(item, startIndex + i))}
        </div>
      </div>
    </div>
  );
};

VirtualList.propTypes = {
  items: PropTypes.array.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
};

export default VirtualList;
