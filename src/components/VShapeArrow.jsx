import React from 'react';

const VShapeArrow = ({ size = 16, color = 'black' }) => {
  const borderSize = size / 2;

  return (
    <div
      className="relative"
      style={{
        width: 0,
        height: 0,
        borderLeft: `${borderSize}px solid transparent`,
        borderRight: `${borderSize}px solid transparent`,
        borderTop: `${size}px solid ${color}`,
      }}
    ></div>
  );
};

export default VShapeArrow;
