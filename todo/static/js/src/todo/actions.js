import TodoDispatcher from './dispatchers.js';

var TodoActions = {
    ADD: 1,
    REMOVE: 2,
    COMPLETE: 3,
    SET_LABEL: 4,

    add: function(label) {
        TodoDispatcher.dispatch({
            actionType: TodoActions.ADD,
            label: label
        });
    },

    remove: function(todo) {
        TodoDispatcher.dispatch({
            actionType: TodoActions.REMOVE,
            todo: todo
        });
    },

    complete: function(todo, completed) {
        TodoDispatcher.dispatch({
            actionType: TodoActions.COMPLETE,
            todo: todo,
            completed: completed
        });
    },

    setLabel: function(todo, label) {
        TodoDispatcher.dispatch({
            actionType: TodoActions.SET_LABEL,
            todo: todo,
            label: label
        });
    }
};

export default TodoActions;
