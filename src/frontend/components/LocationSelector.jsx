// ~root\src\components\LocationSelector.jsx
import React from 'react';
import { Row, Col } from 'antd';
import ActionButton from './ActionButton';

const LocationSelector = ({ selectedLocation, onLocationSelect, disabled }) => {
  const locations = [
    {
      key: 'Arts District',
      label: 'Arts District',
      image: '/arts.png',
    },
    {
      key: 'Beach',
      label: 'Beach',
      image: '/beach.png',
    },
    {
      key: 'City Market',
      label: 'City Market',
      image: '/city.png',
    },
    {
      key: 'Downtown',
      label: 'Downtown',
      image: '/downtown.png',
    },
    {
      key: 'Train station',
      label: 'Train Station',
      image: '/station.png',
    },
    {
      key: 'University',
      label: 'University',
      image: '/uni.png',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {locations.map((location) => (
        <Col span={8} key={location.key}>
          <ActionButton
            selected={selectedLocation === location.key}
            onClick={() => onLocationSelect(location.key)}
            disabled={disabled}
            image={location.image}
            label={location.label}
          />
        </Col>
      ))}
    </Row>
  );
};

export default LocationSelector;
