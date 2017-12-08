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
 * Authentication and Authorization Functions
 * 
 *************************************************************************/

var hash = require('./hash');
var moment = require('moment');
var config = require('./config');
var Role = require('./roles');
var log = require('./log');

var authenticate = function(request, response, next) {
    var authHeader = request.get('Authorization');
    var dateHeader = request.get('Date');
    if (dateHeader == null) {
        dateHeader = request.get('X-Date');
    }
    if ((authHeader == null) && (dateHeader == null)) {
        json = {
            error: "Authentication Failed.  Authorization Headers Are Invalid."
        };
        log.info({Function: "Auth"}, "Date or Authorization Headers are missing.");
        return response.status(401).json(json);
    }
    var dateValue = moment(dateHeader);
    if (!dateValue.isValid()) {
        json = {
            error: "Authentication Failed.  Authorization Headers Are Invalid."
        };
        log.info({Function: "Auth"}, "Date Headers is not valid.");
        return response.status(401).json(json);
    }
    var timeOffset = Math.abs(moment().diff(dateValue, 'minutes'));
    if (timeOffset > 500) {
        json = {
            error: "Authentication Failed.  Request is too old."
        };
        log.info({Function: "Auth"}, "Request is too old, skew is greater than allowed offset of 15 minutes." + timeOffset + "--" + dateValue);
        return response.status(401).json(json);
    }
    var authValues = authHeader.split(":");
    if (authValues.length !== 2) {
        json = {
            error: "Authentication Failed.  Authorization Headers Are Invalid."
        };
        log.info({Function: "Auth"}, "There should be 2 parts to your Authorization Header there are " + authValues.length);
        return response.status(401).json(json);
    }
    var apiKey = authValues[0];
    var origSignature = authValues[1];

    request.getConnection(function(connectionError, connection) {
        if (connectionError != null) {
            log.error(connectionError, "Database Connection Error (Function = Auth)");
            json = {
                error: "Authentication Failed. Database could not be reached."
            };
            return response.status(500).json(json);
        }

        connection.query('SELECT secret FROM '+ config.mysql.db.name +'.user WHERE publickey = ?', apiKey, function(queryError, user) {
            if (queryError != null) {
                log.error(queryError, "Query Error. Authentication Failed. (Function = Auth)");
                json = {
                    error: "Authentication Failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            console.log(user);
            if ((user == null) || (user[0].secret == null)) {
                json = {
                    error: "Authentication failed. Invalid signature."
                };
                log.info({Function: "Auth"}, "Missing user or user secret for key: " + apiKey);
                return response.status(500).json(json);
            }

            var secret = user[0].secret;
            var hashData = JSON.stringify(request.body).length <= 2 ? '' + dateHeader : JSON.stringify(request.body) + dateHeader;
            var newSignature = hash.generateHmac(hashData, secret);
            if (newSignature !== origSignature) {
                var escapeSignature = hash.generateHmac(hashData.replace("\/", "\\/"), secret);
                if (escapeSignature !== origSignature) {
                    json = {
                        error: "Authentication Failed.  Invalid Signature"
                    };
                    log.info({Function: "Auth"}, "Generate Signature on: " + hashData + " of: " + newSignature + " does not match supplied of: " + origSignature);
                    return response.status(401).json(json);
                }
            }

            var roleName = "";
            var aUrl = "";
            var allowService = false;
            var rules = null;
            var aSplitRequestUrl = null;
            if (request.body.role != null) {
                roleName = request.body.role;
            } else if (user[0].role != null) {
                roleName = user[0].role;
            } else {
                roleName = "User";
            }
            if (request.originalUrl != null) {
                aUrl = request.originalUrl.toString();
                aSplitRequestUrl = aUrl.split("/");
            }
            if (roleName != null) {
                if (Role[roleName] != null) {
                    if (roleName === Role[roleName].name) {
                        rules = Role[roleName].rules;
                    }
                } else {
                    json = {
                        error: "Authentication failed. Invalid Access Method."
                    };
                    log.info({Function: "Auth"}, "Authentication failed for Invalid role : " + roleName + " Method :" + request.method);
                    return response.status(500).json(json);
                }
                if (rules != null) {
                    var i = 0;
                    while (i < rules.length) {
                        var theRules = rules[i];
                        if (theRules.access === "allow") {
                            var theUrl = theRules.access_url;
                            var theAccessVerbs = theRules.access_verbs;
                            var theMethod = request.method;
                            var theSplit = theUrl.split("/");
                            if (theSplit.length >= 2) {
                                if (theSplit[1].toString() === "*") {
                                    allowService = true;
                                } else if (aSplitRequestUrl[1].toString() === theSplit[1].toString()) {
                                    if (aSplitRequestUrl[3].toString() === theSplit[3].toString()) {
                                        var j = 0;
                                        while (j < theAccessVerbs.length) {
                                            if (theAccessVerbs[j].toString() === theMethod) {
                                                allowService = true;
                                                break;
                                            }
                                            j++;
                                        }
                                    } else {
                                        allowService = false;
                                    }
                                } else {
                                    allowService = false;
                                }
                            }
                        } else {
                            allowService = false;
                        }
                        if (allowService) {
                            break;
                        }
                        i++;
                    }
                } else {
                    allowService = false;
                }
            }
            if (allowService) {
                return next();
            } else {
                json = {
                    error: "Authentication failed. Invalid Access Method."
                };
                log.info({Function: "Auth"}, "Authentication failed for Invalid role : " + roleName + " Method :" + request.method);
                return response.status(500).json(json);
            }
        });

    });
};

exports.bypass = function(request, response, next) {
    log.warn({Function: "Auth"}, "Authenication is bypassed");
    return next();
};

exports.required = function(request, response, next) {
    return authenticate(request, response, next);
};