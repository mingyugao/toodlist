import React from 'react';
import Typography from 'antd/lib/typography';

const { Title } = Typography;

const Loading = () => (
  <div id="loading" className="loading-screen" role="status">
    <img src="/loading.png" alt="" />
    <Title>Loading...</Title>
  </div>
);

export default Loading;
