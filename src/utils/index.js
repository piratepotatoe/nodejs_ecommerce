'use strict';
const _ = require('lodash');

const getInfodata = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

module.exports = {
    getInfodata
}