import $ from 'jquery';
import Cookies from 'js-cookie/src/js.cookie.js';
import React from 'react/react';

import TodoBox from './todo/components.jsx'


$.ajaxSetup({
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken')
    }
});

React.render(<TodoBox />, document.getElementById('content'));
