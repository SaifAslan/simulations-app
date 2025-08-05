// ~root\src\components\ProductSelector.jsx
import React from 'react';
import { Row, Col } from 'antd';
import ActionButton from './ActionButton';

const ProductSelector = ({ selectedProduct, onProductSelect, disabled }) => {
  const products = [
    {
      key: 'Ice cream',
      label: 'Ice Cream',
      image: '/icecream.png',
    },
    {
      key: 'Frozen yogurt',
      label: 'Frozen Yogurt',
      image: '/Frozen.png',
    },
    {
      key: 'Smoothies',
      label: 'Smoothies',
      image: '/smothie.png',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col span={8} key={product.key}>
          <ActionButton
            selected={selectedProduct === product.key}
            // Fix: Pass only the product key instead of the entire object
            onClick={() => onProductSelect(product.key)}
            disabled={disabled}
            image={product.image}
            label={product.label}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductSelector;