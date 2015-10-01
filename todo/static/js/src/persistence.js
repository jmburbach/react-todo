import $ from 'jquery';
import {getResourceEndpoint} from './api.js';


/** A more restful interface/adapter for the js-model lib. */
class RestfulInterface
{
    constructor(modelClass, resourceName) {
        this.modelClass = modelClass;
        this.resourceName = resourceName;
        this.modelClass.persistence = this;
    }

    /** Return true if given model instance is a new record, otherwise false. */
    newRecord(model) {
        console.log('RestfulInterface.newRecord');
        return !model.id();
    }

    /** Retrieve records from server, create models, pass them to callback. */
    read(callback) {
        console.log('RestfulInterface.read');
        var modelClass = this.modelClass;
        getResourceEndpoint(this.resourceName).then(function(endpoint) {
            $.ajax({url: endpoint, type: 'GET', dataType: 'json'})
                .done(function(response) {
                    var models = [];
                    for (let data of response) {
                        models.push(new modelClass(data));
                    }
                    callback(models);
                });
        });
    }

    /** Persist a new record. */
    create(model, callback) {
        console.log('RestfulInterface.create');
        var data = this.serialize(model);
        getResourceEndpoint(this.resourceName).then(function(endpoint) {
            $.ajax({
                url: endpoint,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: data
            }).done(function(data, textStatus, xhr) {
                model.attr(xhr.responseJSON);
                callback(true);
            }).fail(function() {
                callback(false);
            });
        });
    }

    /** Persist an existing record. */
    update(model, callback) {
        console.log('RestfulInterface.update');
        $.ajax({
            url: model.attr('url'),
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: this.serialize(model)
        }).done(function(data, textStatus, xhr) {
            model.attr(xhr.responseJSON);
            callback(true);
        }).fail(function() {
            callback(false);
        });
    }

    /** Delete a record. */
    destroy(model, callback) {
        console.log('RestfulInterface.destroy');
        if (this.newRecord(model)) {
            callback(true);
        }
        else {
            $.ajax({
                url: model.attr('url'),
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: this.serialize(model)
            }).done(function() {
                callback(true);
            }).fail(function() {
                callback(false);
            });
        }
    }

    /** Serialize model json to string. */
    serialize(model) {
        return JSON.stringify(model.asJSON());
    }
}


/** Adapter factory function.
 *
 * example:
 *     var Item = Model('item', function() {
 *         this.persistence(RestfulAdapter('items'));
 *     });
 */
function RestfulAdapter(resourceName) {
    return function(modelClass) {
        return new RestfulInterface(modelClass, resourceName);
    }
}

export default RestfulAdapter;
