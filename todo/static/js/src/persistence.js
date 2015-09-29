import $ from 'jquery';
import Promise from 'promise';

const Endpoints = new Promise(function(resolve, reject) {
    $.ajax({type: 'GET', url: '/api/', dataType: 'json'})
        .done(resolve)
        .fail(reject);
});


function getApiEndpoints() {
    return Endpoints;
}


function getResourceEndpoint(resourceName) {
    return new Promise(function(resolve, reject) {
        Endpoints.then(function(endpoints) {
            resolve(endpoints[resourceName]);
        }).catch(reject);
    });
}


class RestfulInterface
{
    constructor(modelClass, resourceName) {
        this.modelClass = modelClass;
        this.resourceName = resourceName;
        this.modelClass.persistence = this;
    }

    newRecord(model) {
        console.log('RestfulInterface.newRecord');
        return !model.id();
    }

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

    save(model, callback) {
        console.log('RestfulInterface.save');
        if (this.newRecord(model)) {
            this.create(model, callback);
        }
        else {
            this.update(model, callback);
        }
    }

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

    serialize(model) {
        return JSON.stringify(model.asJSON());
    }
}


function RestfulAdapter(modelClass, resourceName) {
    return new RestfulInterface(modelClass, resourceName);
}

export default RestfulAdapter;
