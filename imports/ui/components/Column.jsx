import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Popconfirm from 'antd/lib/popconfirm';
import Typography from 'antd/lib/typography';
import message from 'antd/lib/message';
import {
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import Todo from './Todo';
import {
  columnUpdateTitleRequest,
  columnUpdateTitleSuccess,
  columnUpdateTitleFailure,
  columnDeleteTodolistRequest,
  columnDeleteTodolistSuccess,
  columnDeleteTodolistFailure,
  columnCreateTodoRequest,
  columnCreateTodoSuccess,
  columnCreateTodoFailure
} from '../actions/Column';

const styles = theme => ({
  column: {
    border: '1px solid #dddddd',
    borderRadius: '5px',
    padding: '0.5rem',
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '1rem',
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      minWidth: '22rem',
      maxWidth: '22rem',
      marginRight: '1rem'
    }
  },
  todoContainer: {
    [theme.breakpoints.down('sm')]: {
      minHeight: '10rem'
    },
    [theme.breakpoints.up('md')]: {
      minHeight: '12rem'
    }
  }
});

class Column extends Component {
  state = {
    isTitleInputVisible: false,
    isTodoInputVisible: false
  };

  componentDidMount = () => {
    const column = document.getElementById(this.props.column.id);
    if (column.animate) {
      column.animate({
        opacity: [0, 1],
        transform: ['scale(0.8)', 'scale(1)']
      }, 200);
    }
  };

  componentDidUpdate = (_, prev) => {
    const {
      isTitleInputVisible,
      isTodoInputVisible
    } = this.state;

    if (!prev.isTitleInputVisible && isTitleInputVisible) {
      this.titleInput.focus();
    } else if (!prev.isTodoInputVisible && isTodoInputVisible) {
      this.todoInput.focus();
    }
  };

  saveTitleRef = ref => (this.titleInput = ref);

  saveTodoRef = ref => (this.todoInput = ref);

  toggleEditTitle = () => {
    this.setState({ isTitleInputVisible: true });
  };

  toggleNewTodo = () => {
    this.setState({ isTodoInputVisible: true });
  };

  updateTitle = e => {
    this.props.updateTitle(
      this.props.column.id,
      e.target.value
    );
    this.setState({ isTitleInputVisible: false });
  };

  deleteTodolist = () => {
    const cid = this.props.column.id;
    const column = document.getElementById(cid);
    if (column.animate) {
      const anim = column.animate({
        opacity: [1, 0],
        transform: ['scale(1)', 'scale(0)']
      }, 200);
      anim.onfinish = () => {
        this.props.deleteTodolist(cid);
      };
    } else {
      this.props.deleteTodolist(cid);
    }
  };

  createTodo = e => {
    this.props.createTodo(
      this.props.column.id,
      e.target.value
    );
    this.setState({ isTodoInputVisible: false });
  };

  createTodoAndFocusInput = e => {
    this.props.createTodo(
      this.props.column.id,
      e.target.value
    );
    this.todoInput.state.value = "";
    this.todoInput.focus();
  };

  render() {
    const {
      classes,
      index,
      column,
      todos
    } = this.props;

    return (
      <Draggable
        draggableId={column.id}
        index={index}
      >
        {columnProvided => (
          <div
            className={`${column.color || 'white'} ${classes.column}`}
            id={column.id}
            ref={columnProvided.innerRef}
            {...columnProvided.draggableProps}
            {...columnProvided.dragHandleProps}
          >
            <div>
              {!this.state.isTitleInputVisible && (
                <Typography.Title
                  level={4}
                  onClick={this.toggleEditTitle}
                >
                  {column.title}
                </Typography.Title>
              )}
              {this.state.isTitleInputVisible && (
                <Input
                  ref={this.saveTitleRef}
                  defaultValue={column.title}
                  onBlur={this.updateTitle}
                  onPressEnter={this.updateTitle}
                />
              )}
              {todos.length === 0 && (
                <Button
                  icon="close"
                  shape="circle"
                  size="small"
                  type="danger"
                  onClick={this.deleteTodolist}
                />
              )}
              {todos.length !== 0 && (
                <Popconfirm
                  placement="bottomRight"
                  okType="danger"
                  title="Delete toodlist?"
                  icon={<Icon type="warning" />}
                  onConfirm={this.deleteTodolist}
                >
                  <Button
                    icon="close"
                    shape="circle"
                    size="small"
                    type="danger"
                  />
                </Popconfirm>
              )}
            </div>
            <Droppable droppableId={column.id} type="todo">
              {innerProvided => (
                <div
                  className={classes.todoContainer}
                  ref={innerProvided.innerRef}
                  {...innerProvided.droppableProps}
                >
                  {todos.map((todo, index) => (
                    <Todo
                      key={todo.id}
                      index={index}
                      todo={todo}
                    />
                  ))}
                  {innerProvided.placeholder}
                  {!this.state.isTodoInputVisible && (
                    <div
                      className="todo todo-add-placeholder"
                      onClick={this.toggleNewTodo}
                    >
                      <Icon type="plus" />&nbsp;new item
                    </div>
                  )}
                  {this.state.isTodoInputVisible && (
                    <Input
                      className="todo todo-add-input"
                      ref={this.saveTodoRef}
                      defaultValue=""
                      onBlur={this.createTodo}
                      onPressEnter={this.createTodoAndFocusInput}
                    />
                  )}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    updateTitle: (cid, title) => {
      if (title) {
        dispatch(columnUpdateTitleRequest(cid, title));
        Meteor.call(
          'updateTitle',
          Meteor.userId(),
          cid,
          title,
          (err, response) => {
            if (err) {
              dispatch(columnUpdateTitleFailure());
              message.error(
                'Your request failed to complete, please try again.'
              );
            } else {
              dispatch(columnUpdateTitleSuccess());
            }
          }
        );
      }
    },
    deleteTodolist: cid => {
      dispatch(columnDeleteTodolistRequest(cid));
      Meteor.call(
        'deleteTodolist',
        Meteor.userId(),
        cid,
        (err, response) => {
          if (err) {
            dispatch(columnDeleteTodolistFailure());
            message.error(
              'Your request failed to complete, please try again.'
            );
          } else {
            dispatch(columnDeleteTodolistSuccess());
          }
        }
      );
    },
    createTodo: (cid, todoContent) => {
      if (todoContent) {
        const newTodo = {
          id: Date.now(),
          content: todoContent
        };
        dispatch(columnCreateTodoRequest(cid, newTodo));
        Meteor.call(
          'createTodo',
          Meteor.userId(),
          cid,
          newTodo,
          (err, response) => {
            if (err) {
              dispatch(columnCreateTodoFailure());
              message.error(
                'Your request failed to complete, please try again.'
              );
            } else {
              dispatch(columnCreateTodoSuccess());
            }
          }
        );
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Column));
