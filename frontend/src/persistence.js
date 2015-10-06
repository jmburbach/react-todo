import Backbone from 'backbone/backbone';
import Promise from 'promise';

import {getResourceEndpoint} from './api.js';


function sync(method, model, options) {
    var args = arguments;
    var self = this;
    model.getEndpoint().then(function(endpoint) {
        options.url = endpoint;
        Backbone.sync.apply(self, args);
    });
}


export var Model = Backbone.Model.extend({
    sync: sync,
    getEndpoint: function() {
        if (this.isNew()) {
            return getResourceEndpoint(this.resource);
        }

        var url = this.get('url');
        return new Promise(function(resolve, reject) {
            resolve(url);
        });
    }
});


export var Collection = Backbone.Collection.extend({
    sync: sync,
    getEndpoint: function() {
        return getResourceEndpoint(this.resource);
    }
});
