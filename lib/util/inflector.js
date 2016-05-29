var _ = require('underscore');

var inflector = {

    toCamelCase: function(string) {
        string = string.toLowerCase();
        string = string.replace(/_(.)/g, function($0, $1) {
            return $1.toUpperCase();
        });
        return string;
    },

    toPascalCase: function(string) {
        string = this.toCamelCase(string);
        string = string.replace(/^./, function($0) {
            return $0.toUpperCase();
        });
        return string;
    },

    toSnakeCase: function(string) {
        string = string.replace(/[A-Z]/g, function($0) {
            return '_' + $0.toLowerCase();
        });
        string = string.replace(/^_/, '');
        return string;
    },

    toCamelCaseValues: function(object) {
        _.each(object, function(value, key) {
            object[key] = inflector.toCamelCase(value);
        });
        return object;
    },

    toPascalCaseValues: function(object) {
        _.each(object, function(value, key) {
            object[key] = inflector.toPascalCase(value);
        });
        return object;
    },

    toSnakeCaseValues: function(object) {
        _.each(object, function(value, key) {
            object[key] = inflector.toSnakeCase(value);
        });
        return object;
    },

    toCamelCaseKeys: function(object) {
        var result = {};
        _.each(object, function(value, key) {
            result[inflector.toCamelCase(key)] = value;
        });
        return result;
    },

    toPascalCaseKeys: function(object) {
        var result = {};
        _.each(object, function(value, key) {
            result[inflector.toPascalCase(key)] = value;
        });
        return result;
    },

    toSnakeCaseKeys: function(object) {
        var result = {};
        _.each(object, function(value, key) {
            result[inflector.toSnakeCase(key)] = value;
        });
        return result;
    },

    toCapitalizeFirstLetter: function(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }    
};

module.exports = inflector;
