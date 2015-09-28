import TodoDispatcher from './dispatchers.js';

var TodoActions = {
    add: function(label) {
        TodoDispatcher.dispatch({
            actionType: 'add',
            label: label
        });
    },

    remove: function(todo) {
        TodoDispatcher.dispatch({
            actionType: 'delete',
            todo: todo
        });
    },

    complete: function(todo, completed) {
        TodoDispatcher.dispatch({
            actionType: 'complete',
            todo: todo,
            completed: completed
        });
    },

    setLabel: function(todo, label) {
        TodoDispatcher.dispatch({
            actionType: 'set-label',
            todo: todo,
            label: label
        });
    }
};

export default TodoActions;
