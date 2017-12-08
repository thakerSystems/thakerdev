/*************************************************************************
 * 
 * COPYRIGHT NOTICE
 * __________________
 * 
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Jaffar Meeran
 * All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains the property 
 * of Jaffar Meeran. Unauthorised copying of this  file, via any medium is
 * strictly prohibited. Redistribution and use in source and binary forms,
 * with or without modification, are not permitted.
 * Proprietary and confidential.
 *
 * Author:
 * Name: Jaffar Meeran
 * Email: jaffar.meeran@gmail.com
 * Website: http://nooshow.com
 *
 *
 * FILE SUMMARY
 * __________________
 * 
 * The main service file.
 * 
 *************************************************************************/

var module, resource, service, services, version, versions, _ref;

var fs = require('fs');
var express = require('express');
var http = require('http');
var https = require('https');
var config = require('./config');
var log = require('./log');
var auth = require('./auth');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var requestLog = function(request, response, next) {
    var details;
    details = {
        client: request.ip,
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body
    };
    var tag = "request";
    log.info({Function: tag}, details);
    next();
};
var enableCORS = function(request, response, next) {
    response.header('Access-Control-Allow-Origin', request.headers.origin);
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Date, X-Date');
    return next();
};
var mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
        host: config.mysql.server.host,
        user: config.mysql.db.username,
        password: config.mysql.db.password,
        port: config.mysql.server.port,
        database: config.mysql.db.name,
        multipleStatements: true
    };

var app = express();
app.disable('x-powered-by');
app.use(enableCORS);
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(myConnection(mysql, dbOptions, 'pool'));
app.use(requestLog);
app.use(fileUpload());
log.info({Function: "init"}, config.name + " version " + config.version + " Scanning " + __dirname + "/services for service modules");

services = fs.readdirSync(__dirname + "/services");

for (var _i = 0, _len = services.length; _i < _len; _i++) {
    service = services[_i];
    versions = fs.readdirSync(__dirname + "/services/" + service);
    log.info({Function: "init"}, "Registering Service: " + service + " with " + versions.length + " versions");
    for (var _j = 0, _len1 = versions.length; _j < _len1; _j++) {
        version = versions[_j];
        log.info({Function: "init"}, "Registering resources for: " + service + "/" + version);
        module = require(__dirname + "/services/" + service + "/" + version + "/service.js");
        _ref = module.resources;
        for (var _k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            resource = _ref[_k];
            resource.url = "/" + service + "/" + version + "/" + resource.name;
            switch (resource.auth) {
                case 'bypass':
                    resource.auth = auth.bypass;
                    break;
                case 'required':
                    resource.auth = auth.required;
                    break;
                default:
                    resource.auth = auth.required;
            }
            if (resource.methods.create != null) {
                app.post(resource.url, resource.auth, resource.methods.create);
            }
            if (resource.methods["delete"] != null) {
                app["delete"](resource.url + "/:id", resource.auth, resource.methods["delete"]);
            }
            if (resource.methods.index != null) {
                app.get(resource.url, resource.auth, resource.methods.index);
            }
            if (resource.methods.show != null) {
                app.get(resource.url + "/:id", resource.auth, resource.methods.show);
            }
            if (resource.methods.update != null) {
                app.put(resource.url + "/:id", resource.auth, resource.methods.update);
            }
            if (resource.methods.options != null) {
                app.options(resource.url, resource.methods.options);
            }
            if (resource.methods.head != null) {
                app.head(resource.url, resource.methods.head);
            }
            app.get('/', function(request, response) {
                return response.sendStatus(200);
            });
            app.all(resource.url, function(request, response) {
                return response.sendStatus(501);
            });
        }
    }
}

 if (config.http.enabled) {
     http.createServer(app).listen(config.http.port);
     log.info({Function: "init"}, "nooshow-API listening for http on port " + config.http.port);
 }

if (config.https.enabled) {
    https.createServer(config.https.options, app).listen(config.https.port);
    log.info({Function: "init"}, "nooshow-API listening for https on port " + config.https.port);
}

if (process.send != null) {
    process.send('online');
}

process.on('message', function(message) {
    if (message === 'shutdown') {
        log.info({Function: "shutdown"}, "shutdown message received");
        return process.exit(0);
    }
});
