import React, {Component} from 'react';
import {render} from 'react-dom';
import IONMapExtension from './index';

var div = document.createElement('div');
render(<IONMapExtension />, document.body.appendChild(div));