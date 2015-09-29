import $ from 'jquery';
import Model from '../vendor/js-model.js';
import MicroAction from 'microevent/microevent';
import TodoDispatcher from './dispatchers.js';
//import EndPoints from '../endpoints.js';
import RestfulAdapter from '../persistence.js';


var Todo = Model('todo', function() {
    this.persistence(RestfulAdapter, 'todos');
});

TodoDispatcher.register(function(payload) {
    console.log('TodoDispatcher: ', payload);
    if (payload.actionType == 'add') {
        var todo = new Todo({label: payload.label});
        todo.save();
    }
    else if (payload.actionType == 'delete') {
        var todo = payload.todo;
        todo.destroy();
    }
    else if (payload.actionType == 'complete') {
        var todo = payload.todo,
            completed = payload.completed;
        todo.attr('completed', completed);
        todo.save();
    }
    else if (payload.actionType == 'set-label') {
        var todo = payload.todo,
            label = payload.label;
        todo.attr('label', label);
        todo.save();
    }
});

const TodoStore = Todo;
export default TodoStore;
