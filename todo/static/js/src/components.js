import React from 'react/react';


/**
 * Component class which automatically binds `this' to its methods.
 */
export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this._bindMethods();
    }

    _bindMethods() {
        var props = Object.getOwnPropertyNames(this.constructor.prototype);
        props = props.filter(p => typeof this[p] === 'function');
        for (let p of props) { this[p] = this[p].bind(this); }
    }
}
