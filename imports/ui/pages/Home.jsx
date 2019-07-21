import React from 'react';
import { connect } from 'react-redux';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';

const { Title } = Typography;

const Home = ({
  history,
  signOut
}) => (
  <div id="home">
    <Title>Home</Title>
    {Meteor.userId()}
    <Button
      onClick={() => signOut(history)}
    >
      Sign Out
    </Button>
  </div>
);

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: history => {
      Meteor.logout(err => {
        dispatch({ type: 'SIGN_OUT' });
        history.push('/');
      })
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
