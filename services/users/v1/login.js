/*************************************************************************
 *
 * COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Thaker Systems Inc.
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Thaker Systems Inc. Unauthorised copying of this  file, via any medium is
 * strictly prohibited. Redistribution and use in source and binary forms,
 * with or without modification, are not permitted.
 * Proprietary and confidential.
 *
 * Author:
 * Name: Jaffar Meeran
 * Email: jaffar@thakersystems.com
 * Website: http://thakersystems.com
 *
 *
 * FILE SUMMARY
 * __________________
 *
 * This file contains the logic for the login service.
 *
 *************************************************************************/

var crypto = require('crypto');
var config = require('./../../../config');
var log = require('./../../../log');
var guid = require('./../../../guid');

exports.create = function(request, response) {

    try
    {
        var json = "";
	var guidInstance = guid.guid();
        if (request.body.id == null || request.body.id == "")
        {
            log.info({Function: "Login.Create" + "GUID: " + guidInstance}, "Login Request. Details: 'User Id' is empty");
            json = {
                    error: "Login Request failed. User Id is not found in the request. Use this ID: " + guidInstance + "for further communication."
                };
            return response.sendStatus(401).json(json);
        }

        if (request.body.password == null || request.body.password == "")
        {
            log.info({Function: "Login.Create"  + "GUID: " + guidInstance}, "Login Request Failed. Details: 'Password' is empty");
            json = {
                    error: "Login Request failed. Password is not found in the request. Use this ID: " + guidInstance + "for further communication."
                };
            return response.sendStatus(401).json(json);
        }

        if (request.body.authTypeId == null || request.body.authTypeId == "")
        {
            log.info({Function: "Login.Create" + "GUID: " + guidInstance}, "Login Request. Details: 'Access Type' is empty");
            json = {
                    error: "Login Request failed. Access Type is not found in the request. Use this ID: " + guidInstance + "for further communication."
                };
            return response.sendStatus(401).json(json);
        }

        request.getConnection(function(connectionError, connection)
        {
            if (connectionError != null) {
                log.error(connectionError  + "GUID: " + guidInstance, "Database Connection Error (Function = Login Request.Create)");
                json = {
                    error: "Login Request failed. Database could not be reached. Use this ID: " + guidInstance + "for further communication"
                };
                return response.status(500).json(json);
            }
            var outPassword = "";
	    var outSessionToken = "";
	    var outExpiresAt = "";
            connection.query('SET @outPassword = ""; SET @outSessionToken = ""; SET @outExpiresAt = ""; CALL thakerLogin(?,?,@outPassword, @outSessionToken, @outExpiresAt); SELECT @outPassword as outPassword; SELECT @outSessionToken as outSessionToken; SELECT @outExpiresAt as outExpiresAt', [request.body.id, request.body.authTypeId], function (queryError, loginResponse)
                {
                    if (queryError != null)
                    {
                        log.error(queryError  + "GUID: " + guidInstance, "Query Error. Login Request failed. Username: " + request.body.username + " (Function = Login.Create)");
                        json =
                            {
                                error: "Login Request failed. Database could not be reached. Use this ID: " + guidInstance + "for further communication."
                            };
                        return response.status(500).json(json);
                    }
                    else
                    {
                        log.info("Login Resposne: " + JSON.stringify(loginResponse));
                        if ((loginResponse == null) || (loginResponse[5][0].outSessionToken == null))
                        {
                            var json =
                            {
                                error: "Login Request failed. Details: The User Id is not found in our records."
                            };
                            log.info({Function: "Login.Create"}, "Login Request failed. Details: The User Id is not found in our records.");
                            return response.status(401).json(json);
                        }

                        var passwordArray = loginResponse[4][0].outPassword.split(":");
                        var iterations = passwordArray[0];
                        var salt = passwordArray[1];
                        var originalPassword = passwordArray[2];
                        crypto.pbkdf2(request.body.password, salt, parseInt(iterations), 24, function(cryptoPdkError, encodedPassword)
                        {
                        if (cryptoPdkError)
                        {
                            json = {
                                error: "Login Request Failed"
                            };
                            log.error(cryptoPdkError, "Login Request Failed. User Id: " + request.body.userId + " (Function = Login.Create)");
                            return response.status(500).json(json);
                        }
                        log.info("Password: "+encodedPassword.toString("base64"));
                        if (encodedPassword.toString("base64") === originalPassword )
                        {
                            var currentTimestamp = new Date();
                            var utcTimeStamp = currentTimestamp.toUTCString();

                            json = {
                                        user_id: request.body.id,
                                        sessionToken: loginResponse[5][0].outSessionToken,
					expiresAt: loginResponse[6][0].outExpiresAt
                                    };
                                    return response.status(200).json(json);
                        }
                        else
                        {
                            json = {
                                error: "The user id or password supplied were not correct."
                            };
                            log.info({Function: "Login.Create"}, "Login Request Failed. Details: The email address or password supplied were not correct.");
                            return response.status(401).json(json);
                        }
                        });
                    }

                });
        });
    }
catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Login.Create)");
        return response.status(500).json(json);
    }
};

exports.index = function(request, response) {
    var json;
    json = {
        message: 'Login index called'
    };
    return response.status(200).json(json);
};
