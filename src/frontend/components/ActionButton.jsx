// ~root\src\components\ActionButton.jsx
import React from 'react';
import { Button } from 'antd';
import Image from 'next/image';

const ActionButton = ({ selected, onClick, disabled, image, label }) => {
  const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'auto',
    width: '100%',
    padding: '.5rem',
    marginBottom: 8,
    color: selected ? 'limegreen' : 'inherit',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <Button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      <Image
        src={image}
        width={70}
        height={70}
        alt={label}
      />
      {label}
    </Button>
  );
};

export default ActionButton;