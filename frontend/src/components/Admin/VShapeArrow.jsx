import PropTypes from 'prop-types'; // Import PropTypes

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

// Define PropTypes for the component
VShapeArrow.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default VShapeArrow;
