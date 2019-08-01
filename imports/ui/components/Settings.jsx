import React from 'react';
import { connect } from 'react-redux';
import Avatar from 'antd/lib/avatar';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import Radio from 'antd/lib/radio';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import {
  closeSettings,
  settingsChangeColumnColorRequest,
  settingsChangeColumnColorSuccess,
  settingsChangeColumnColorFailure
} from '../actions/Settings';

const { Title } = Typography;

const backgroundOptions = [
  { label: '', value: 'white' },
  { label: '', value: 'blue' },
  { label: '', value: 'purple' },
  { label: '', value: 'pink' },
  { label: '', value: 'red' },
  { label: '', value: 'orange' },
  { label: '', value: 'yellow' },
  { label: '', value: 'green' }
];

const Settings = ({
  visible,
  email,
  columns,
  columnOrder,
  onColumnColorChange,
  closeSettings
}) => (
  <Modal
    centered
    footer={null}
    maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    title={<Title level={3}>Settings</Title>}
    visible={visible}
    width="55%"
    onCancel={() => closeSettings()}
  >
    <div>
      <Title level={4}>Avatar</Title>
      <Avatar icon="user" size="large" />
      <Button>
        <Icon type="upload" />
        Upload Image
      </Button>
    </div>
    <Divider />
    <div>
      <Title level={4}>Toodlist Colors</Title>
      {columnOrder.length === 0 && (
        <span>You don't have any toodlists.</span>
      )}
      {columnOrder.map((cid, index) => {
        const column = columns[cid];
        return (
          <div key={index}>
            <span>{column.title}</span>
            <Radio.Group
              options={backgroundOptions}
              value={column.color || 'white'}
              onChange={e => onColumnColorChange(column.id, e.target.value)}
            />
          </div>
        );
      })}
    </div>
    <Divider />
    <div>
      <Title level={4}>Change Email</Title>
      <Input defaultValue={email} />
      <Button>Update</Button>
    </div>
    <Divider />
    <div>
      <Title level={4}>Change Password</Title>
      <div>Current Password</div>
      <Input.Password value="" />
      <div>New Password</div>
      <Input.Password value="" />
      <div>Confirm New Password</div>
      <Input.Password value="" />
      <div><Button>Update</Button></div>
    </div>
  </Modal>
);

const mapStateToProps = state => {
  return {
    visible: state.settings.visible,
    email: state.home.email,
    columns: state.home.columns,
    columnOrder: state.home.columnOrder
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onColumnColorChange: (cid, color) => {
      dispatch(settingsChangeColumnColorRequest(cid, color));
      Meteor.call(
        'updateColor',
        Meteor.userId(),
        cid,
        color,
        (err, response) => {
          if (err) {
            dispatch(settingsChangeColumnColorFailure());
            notification.error({
              message: 'Your request failed to complete.',
              description: 'Please refresh the page and try again.'
            });
          } else {
            dispatch(settingsChangeColumnColorSuccess());
          }
        }
      );
    },
    closeSettings: () => {
      dispatch(closeSettings());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
