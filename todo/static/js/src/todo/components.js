import $ from 'jquery';
import React from 'react/react';
import TodoDispatcher from './dispatchers.js'
import TodoStore from './stores.js';
import TodoActions from './actions.js';


class TodoBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {todos: []};
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        TodoStore.bind('add', this.onChange);
        TodoStore.bind('remove', this.onChange);
        TodoStore.load();
    }

    componentWillUnmount() {
        TodoStore.unbind('add', this.onChange);
        TodoStore.unbind('remove', this.onChange);
    }

    onChange() {
        console.log('onChange');
        this.setState({todos: TodoStore.all()});
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


class TodoList extends React.Component {
    render() {
        var todoItems = [];
        for (let todo of this.props.todos) {
            todoItems.push(<TodoItem key={todo.id()} todo={todo} />);
        }
        return (
            <ul className="todo-list">
                {todoItems}
            </ul>
        );
    }
}


class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {todo: this.props.todo};
        this.onRemove = this.onRemove.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentDidMount() {
        this.state.todo.bind('update', this.onUpdate);
    }

    componentWillUnmount() {
        this.state.todo.unbind('update', this.onUpdate);
    }

    onUpdate() {
        this.setState({todo: this.state.todo});
    }

    onRemove(event) {
        console.log('handleRemove');
        event.preventDefault();
        TodoActions.remove(this.props.todo);
    }

    render() {
        var todo = this.props.todo;
        return (
            <li className={todo.attr('completed') ? 'bg-success complete' : ''}>
                <div className="todo-item">
                    <TodoItemCheck todo={todo} /> 
                    <TodoItemLabel todo={todo} />
                    <TodoItemRemove todo={todo} />
                </div>
            </li>
        );
    }
}


class TodoItemCheck extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        TodoActions.complete(this.props.todo, event.target.checked);
    }

    render() {
        var checked = this.props.todo.attr('completed');
        return <input className="todo-check" type='checkbox' onChange={this.onChange} checked={checked} />;
    }
}


class TodoItemLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editing: false};
        this.onSubmit = this.onSubmit.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        var label = React.findDOMNode(this.refs.label).value.trim();
        if (label && label != this.props.todo.attr('label')) {
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
        React.findDOMNode(this.refs.label).value = this.props.todo.attr('label');
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
                         defaultValue={this.props.todo.attr('label')} />
                </form>
                <p style={{display: this.state.editing ? 'none' : 'inline'}}
                         className="todo-label" onDoubleClick={this.onDoubleClick}>
                    {this.props.todo.attr('label')}
                </p>
            </span>
        );
    }
}


class TodoItemRemove extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        TodoActions.remove(this.props.todo);
    }

    render() {
        return (
            <a onClick={this.onClick} className="pull-right text-danger" href="#">
                <span className="glyphicon glyphicon-remove"></span>
            </a>
        );
    }
}

class TodoForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

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

    render() {
        return (
            <form className="todo-form" onSubmit={this.handleSubmit}>
                <div className="input-group">
                    <input className="form-control" type="text" ref="label" placeholder="I need to..." />
                    <span className="input-group-btn">
                        <button className="btn btn-primary" type="submit">Add</button>
                    </span>
                </div>
            </form>
        );
    }
}

export default TodoBox;
