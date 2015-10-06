import {Model, Collection} from '../persistence.js';

import TodoDispatcher from './dispatchers.js';
import TodoActions from './actions.js';


var Todo = Model.extend({resource: 'todos'});
var TodoCollection = Collection.extend({model: Todo, resource: 'todos'});

var TodoStore =  new TodoCollection();

TodoDispatcher.register(function(payload) {
    console.log('TodoDispatcher: ', payload);
    if (payload.actionType == TodoActions.ADD) {
        TodoStore.create({label: payload.label}, {wait: true});
    }
    else if (payload.actionType == TodoActions.REMOVE) {
        var todo = payload.todo;
        todo.destroy({wait: true});
    }
    else if (payload.actionType == TodoActions.COMPLETE) {
        var todo = payload.todo,
            completed = payload.completed;
        todo.set({completed: completed});
        todo.save({wait: true});
    }
    else if (payload.actionType == TodoActions.SET_LABEL) {
        var todo = payload.todo,
            label = payload.label;
        todo.set({label: label});
        todo.save();
    }
});

export default TodoStore;
