import React from 'react/react';

import BaseComponent from '../components.js';

import TodoDispatcher from './dispatchers.js'
import TodoStore from './stores.js';
import TodoActions from './actions.js';


class TodoBox extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {todos: []};
    }

    componentDidMount() {
        TodoStore.on('add remove', this.onChange);
        TodoStore.fetch();
    }

    componentWillUnmount() {
        TodoStore.off('update', this.onChange);
    }

    onChange() {
        console.log('onChange', name);
        this.setState({todos: TodoStore.models});
    }

    render() {
        return (
            <div className="todo-box">
                <h2 className="page-header">Todos</h2>
                <TodoForm />
                <TodoList todos={this.state.todos} />
                <em className="small text-muted">
                    Double click an item to edit it. Press enter to save, or escape to cancel.
                </em>
            </div>
        );
    }
}


class TodoList extends BaseComponent {
    render() {
        var todoItems = [];
        for (let todo of this.props.todos) {
            todoItems.push(<TodoItem key={todo.cid} todo={todo} />);
        }
        return (
            <ul className="todo-list">
                {todoItems}
            </ul>
        );
    }
}


class TodoItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {todo: this.props.todo};
    }

    componentDidMount() {
        this.state.todo.on('sync', this.onUpdate);
    }

    componentWillUnmount() {
        this.state.todo.off('sync', this.onUpdate);
    }

    onUpdate() {
        console.log('TodoItem.onUpdate');
        this.setState({todo: this.state.todo});
    }

    render() {
        var todo = this.props.todo;
        return (
            <li className={todo.get('completed') ? 'bg-success complete' : ''}>
                <div className="todo-item">
                    <TodoItemCheck todo={todo} />
                    <TodoItemLabel todo={todo} />
                    <TodoItemRemove todo={todo} />
                </div>
            </li>
        );
    }
}


class TodoItemCheck extends BaseComponent {
    onChange(event) {
        TodoActions.complete(this.props.todo, event.target.checked);
    }

    onClick() {
        var completed = !this.props.todo.get('completed');
        TodoActions.complete(this.props.todo, completed);
    }

    render() {
        var checked = this.props.todo.get('completed');
        return (
            <span onClick={this.onClick} className="todo-check" data-checked={checked}>
                <input className="todo-check" type='checkbox' onChange={this.onChange} checked={checked} />
            </span>
        );
    }
}


class TodoItemLabel extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {editing: false};
    }

    onSubmit(event) {
        event.preventDefault();
        var label = React.findDOMNode(this.refs.label).value.trim();
        if (label && label != this.props.todo.get('label')) {
            TodoActions.setLabel(this.props.todo, label);
        }
        this.stopEditing();
    }

    onDoubleClick(event) {
        console.log('TodoItemLabel.onClick');
        this.setState({editing: true});
        setTimeout(function() {
            var e = React.findDOMNode(this.refs.label);
            e.select();
            e.focus();
        }.bind(this), 0);
    }

    startEditing() {
        this.setState({editing: true});
        setTimeout(function() {
            var e = React.findDOMNode(this.refs.label);
            e.select();
            e.focus();
        }.bind(this), 0);
    }

    stopEditing() {
        this.setState({editing: false});
    }

    cancelEditing() {
        /* throw away any input and reset */
        React.findDOMNode(this.refs.label).value = this.props.todo.get('label');
        this.stopEditing();
    }

    onBlur(event) {
        this.cancelEditing();
    }

    onKeyDown(event) {
        /* press escape to abandon editing */
        if (event.which == 27) {
            this.cancelEditing();
        }
    }

    render() {
        return (
            <span>
                <form style={{display: this.state.editing ? 'inline' : 'none'}}
                         autofocus onSubmit={this.onSubmit} className='todo-label'>
                    <input onBlur={this.onBlur} onKeyDown={this.onKeyDown} ref='label'
                         defaultValue={this.props.todo.get('label')} />
                </form>
                <p style={{display: this.state.editing ? 'none' : 'inline'}}
                         className="todo-label" onDoubleClick={this.onDoubleClick}>
                    {this.props.todo.get('label')}
                </p>
            </span>
        );
    }
}


class TodoItemRemove extends BaseComponent {
    onClick(event) {
        event.preventDefault();
        TodoActions.remove(this.props.todo);
    }

    render() {
        return (
            <a onClick={this.onClick} className="pull-right text-danger todo-remove" href="#">
                <span className="glyphicon glyphicon-remove"></span>
            </a>
        );
    }
}

class TodoForm extends BaseComponent {
    handleSubmit(event) {
        event.preventDefault();

        var labelNode = React.findDOMNode(this.refs.label),
            labelValue = labelNode.value.trim();

        if (!labelValue) {
            return;
        }

        labelNode.value = '';

        TodoActions.add(labelValue);
    }

    componentDidMount() {
        setTimeout(function() {
            var e = React.findDOMNode(this.refs.label);
            e.select();
            e.focus();
        }.bind(this), 0);
    }

    render() {
        return (
            <form className="todo-form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label for="todo-form-input" className="sr-only">Label</label>
                    <input className="form-control" type="text" ref="label" placeholder="I need to..." />
                </div>
            </form>
        );
    }
}

export default TodoBox;
