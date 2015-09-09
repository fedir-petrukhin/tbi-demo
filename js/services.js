angular.module('starter.services', ['ngResource'])

.factory('Complaints', function ($resource) {
    return $resource('http://localhost:7590/cip/complaints');
});