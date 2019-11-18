import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Avatar from 'antd/lib/avatar';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import Radio from 'antd/lib/radio';
import Typography from 'antd/lib/typography';
import message from 'antd/lib/message';
import {
  closeSettings,
  settingsOnChangeEmail,
  settingsUpdateEmailRequest,
  settingsUpdateEmailSuccess,
  settingsUpdateEmailFailure,
  settingsOnChangeAvatarSrc,
  settingsUpdateAvatarSrcRequest,
  settingsUpdateAvatarSrcSuccess,
  settingsUpdateAvatarSrcFailure,
  settingsUpdateColumnColorRequest,
  settingsUpdateColumnColorSuccess,
  settingsUpdateColumnColorFailure
} from '../actions/Settings';

const styles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      height: '85%',
      margin: '0'
    },
    [theme.breakpoints.up('md')]: {
      width: '55% !important',
      height: '100%',
      paddingTop: '24px',
    },
    '& div.ant-modal-body': {
      flexGrow: '1',
      overflow: 'scroll',
      [theme.breakpoints.down('sm')]: {
        padding: '1rem 8% 3rem',
      },
      [theme.breakpoints.up('md')]: {
        padding: '1rem 16% 3rem',
      }
    }
  }
});

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
  classes,
  visible,
  emailInput,
  avatarSrcInput,
  email,
  avatarSrc,
  columns,
  columnOrder,
  closeSettings,
  onChangeEmail,
  updateEmail,
  onChangeAvatarSrc,
  updateAvatarSrc,
  updateColumnColor,
}) => (
  <Modal
    className={classes.root}
    centered
    destroyOnClose
    footer={null}
    maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    title={<Typography.Title level={3}>Settings</Typography.Title>}
    visible={visible}
    onCancel={() => closeSettings()}
  >
    <div>
      <Typography.Title level={4}>Avatar</Typography.Title>
      <div>
        <Avatar
          icon="user"
          size="large"
          src={avatarSrc || ''}
        />
        <div>
          <Input
            defaultValue={avatarSrc}
            placeholder="Enter image URL"
            onChange={e => onChangeAvatarSrc(e.target.value)}
          />
          <Button
            onClick={() => updateAvatarSrc(avatarSrcInput)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
    <Divider />
    <div>
      <Typography.Title level={4}>Toodlist Colors</Typography.Title>
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
              onChange={e => updateColumnColor(column.id, e.target.value)}
            />
          </div>
        );
      })}
    </div>
    <Divider />
    <div>
      <Typography.Title level={4}>Change Email</Typography.Title>
      <Input
        disabled
        defaultValue={email}
        onChange={e => onChangeEmail(e.target.value)}
      />
      <Button disabled onClick={() => updateEmail(emailInput)}>Update</Button>
    </div>
    <Divider />
    <div>
      <Typography.Title level={4}>Change Password</Typography.Title>
      <div>Current Password</div>
      <Input.Password disabled value="" />
      <div>New Password</div>
      <Input.Password disabled value="" />
      <div>Confirm New Password</div>
      <Input.Password disabled value="" />
      <div><Button disabled>Update</Button></div>
    </div>
  </Modal>
);

const mapStateToProps = state => {
  return {
    visible: state.settings.visible,
    emailInput: state.settings.email,
    avatarSrcInput: state.settings.avatarSrc,
    email: state.home.email,
    avatarSrc: state.home.avatarSrc,
    columns: state.home.columns,
    columnOrder: state.home.columnOrder
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeSettings: () => {
      dispatch(closeSettings());
    },
    onChangeEmail: email => {
      dispatch(settingsOnChangeEmail(email));
    },
    updateEmail: email => {
      // TODO
    },
    onChangeAvatarSrc: avatarSrc => {
      dispatch(settingsOnChangeAvatarSrc(avatarSrc));
    },
    updateAvatarSrc: avatarSrc => {
      dispatch(settingsUpdateAvatarSrcRequest(avatarSrc));
      Meteor.call(
        'updateAvatarSrc',
        Meteor.userId(),
        avatarSrc,
        (err, response) => {
          if (err) {
            dispatch(settingsUpdateAvatarSrcFailure());
            message.error(
              'Your request failed to complete, please try again.'
            );
          } else {
            dispatch(settingsUpdateAvatarSrcSuccess());
          }
        }
      );
    },
    updateColumnColor: (cid, color) => {
      dispatch(settingsUpdateColumnColorRequest(cid, color));
      Meteor.call(
        'updateColor',
        Meteor.userId(),
        cid,
        color,
        (err, response) => {
          if (err) {
            dispatch(settingsUpdateColumnColorFailure());
            message.error(
              'Your request failed to complete, please try again.'
            );
          } else {
            dispatch(settingsUpdateColumnColorSuccess());
          }
        }
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Settings));
