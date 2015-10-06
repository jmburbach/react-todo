import $ from 'jquery';
import Promise from 'promise';

/** Root api endpoint url. */
const API_ENDPOINT = '/api/';

/** Promise that resolves to list of API endpoint urls.
 *
 * This will basically fire off request to get list of endpoints
 * a soon as the app bundle loads. This promise is then used
 * transparently so endpoints can be queried without further
 * requests to api.
 */
const Endpoints = new Promise(function(resolve, reject) {
    $.ajax({type: 'GET', url: API_ENDPOINT, dataType: 'json'})
        .done(resolve)
        .fail(reject);
});

/** Simply a proxy function returning the above EndPoints promise. */
export function getApiEndpoints() {
    return Endpoints;
}

/** Get endpoint url for a resource. */
export function getResourceEndpoint(resourceName) {
    return new Promise(function(resolve, reject) {
        getApiEndpoints().then(function(endpoints) {
            resolve(endpoints[resourceName]);
        }).catch(reject);
    });
}
