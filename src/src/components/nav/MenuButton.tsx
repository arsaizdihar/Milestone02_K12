import { motion } from 'framer-motion';
import React from 'react';

interface MenuButtonProps {
  isOpen?: boolean;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick }) => {
  const variant = isOpen ? 'opened' : 'closed';
  const width = 24;
  const height = 16;
  const top = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: 45,
      translateY: 1.9,
    },
  };
  const center = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  };
  const bottom = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: -45,
      translateY: -1.9,
    },
  };
  const lineProps = {
    stroke: 'black',
    strokeWidth: 2,
    vectorEffect: 'non-scaling-stroke',
    initial: 'closed',
    animate: variant,
  };
  const unitHeight = 4;
  const unitWidth = (unitHeight * (width as number)) / (height as number);

  return (
    <button onClick={onClick}>
      <motion.svg
        viewBox={`0 0 ${unitWidth} ${unitHeight}`}
        overflow="visible"
        preserveAspectRatio="none"
        width={width}
        height={height}
      >
        <motion.line
          x1="0"
          x2={unitWidth}
          y1="0"
          y2="0"
          variants={top}
          {...lineProps}
        />
        <motion.line
          x1="0"
          x2={unitWidth}
          y1="2"
          y2="2"
          variants={center}
          {...lineProps}
        />
        <motion.line
          x1="0"
          x2={unitWidth}
          y1="4"
          y2="4"
          variants={bottom}
          {...lineProps}
        />
      </motion.svg>
    </button>
  );
};

export default MenuButton;
