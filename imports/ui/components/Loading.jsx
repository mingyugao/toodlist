import React from 'react';
import Typography from 'antd/lib/typography';

const { Title } = Typography;

const Loading = () => (
  <div id="loading">
    <img src="loading.png" alt="loading" />
    <Title>Loading...</Title>
  </div>
);

export default Loading;
