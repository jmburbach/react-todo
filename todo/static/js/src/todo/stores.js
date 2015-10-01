import $ from 'jquery';
import Model from '../vendor/js-model.js';
import RestfulAdapter from '../persistence.js';
import MicroEvent from 'microevent/microevent';
import TodoDispatcher from './dispatchers.js';
import TodoActions from './actions.js';


var Todo = Model('todo', function() {
    this.persistence(RestfulAdapter('todos'));
});


TodoDispatcher.register(function(payload) {
    console.log('TodoDispatcher: ', payload);
    if (payload.actionType == TodoActions.ADD) {
        var todo = new Todo({label: payload.label});
        todo.save();
    }
    else if (payload.actionType == TodoActions.REMOVE) {
        var todo = payload.todo;
        todo.destroy();
    }
    else if (payload.actionType == TodoActions.COMPLETE) {
        var todo = payload.todo,
            completed = payload.completed;
        todo.attr('completed', completed);
        todo.save();
    }
    else if (payload.actionType == TodoActions.SET_LABEL) {
        var todo = payload.todo,
            label = payload.label;
        todo.attr('label', label);
        todo.save();
    }
});


/* cheat a bit.. */
const TodoStore = Todo;

export default TodoStore;
