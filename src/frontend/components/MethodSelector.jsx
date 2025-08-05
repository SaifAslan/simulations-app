// ~root\src\components\MethodSelector.jsx
import React from 'react';
import { Row, Col } from 'antd';
import ActionButton from './ActionButton';

const MethodSelector = ({ selectedMethod, onMethodSelect, daysLeft }) => {
  const methods = [
    {
      key: 'pushcart',
      label: 'Pushcart (1 day)',
      image: '/push.png',
      daysRequired: 1,
    },
    {
      key: 'truck',
      label: 'Truck (7 days)',
      image: '/truck.png',
      daysRequired: 7,
    },
    {
      key: 'research',
      label: 'Research (7 days)',
      image: '/research.png',
      daysRequired: 7,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {methods.map((method) => (
        <Col span={8} key={method.key}>
          <ActionButton
            selected={selectedMethod === method.key}
            // Fix: Pass only the method key instead of the entire object
            onClick={() => onMethodSelect(method.key)}
            disabled={daysLeft < method.daysRequired}
            image={method.image}
            label={method.label}
          />
        </Col>
      ))}
    </Row>
  );
};

export default MethodSelector;