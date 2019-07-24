import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from 'antd/lib/typography';
import Input from 'antd/lib/input';
import { Droppable } from 'react-beautiful-dnd';
import Icon from 'antd/lib/icon';
import Todo from './Todo';
import {
  columnUpdateTitleRequest,
  columnUpdateTitleSuccess,
  columnUpdateTitleFailure,
  columnCreateTodoRequest,
  columnCreateTodoSuccess,
  columnCreateTodoFailure
} from '../actions/Column';

const { Title } = Typography;

class Column extends Component {
  state = {
    isTitleInputVisible: false,
    isTodoInputVisible: false
  };

  componentDidUpdate = (_, prevState) => {
    if (
      prevState.isTitleInputVisible === false &&
      this.state.isTitleInputVisible
    ) {
      this.titleInput.focus();
    } else if (
      prevState.isTodoInputVisible === false &&
      this.state.isTodoInputVisible
    ) {
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

  createTodo = e => {
    this.props.createTodo(
      this.props.column.id,
      e.target.value
    );
    this.setState({ isTodoInputVisible: false });
  };

  render() {
    const {
      column,
      todos
    } = this.props;

    return (
      <div className="column">
        <div>
          {!this.state.isTitleInputVisible && (
            <Title
              level={4}
              onClick={this.toggleEditTitle}
            >
              {column.title}
            </Title>
          )}
          {this.state.isTitleInputVisible && (
            <Input
              ref={this.saveTitleRef}
              defaultValue={column.title}
              onBlur={this.updateTitle}
              onPressEnter={this.updateTitle}
            />
          )}
        </div>
        <Droppable droppableId={column.id}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {todos.map((todo, index) => (
                <Todo
                  key={todo.id}
                  index={index}
                  todo={todo}
                />
              ))}
              {provided.placeholder}
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
                  onPressEnter={this.createTodo}
                />
              )}
            </div>
          )}
        </Droppable>
      </div>
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
      }
    },
    createTodo: (cid, todoContent) => {
      if (todoContent) {
        dispatch(columnCreateTodoRequest(cid, todoContent));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Column);
