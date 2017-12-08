/*************************************************************************
 *
 * COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Orgware Technologies
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Orgware Technologies. Unauthorised copying of this  file, via any medium is
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
 * This file contains the logic for verifying the user based on the authCode.
 * 
 *************************************************************************/
    
var config = require('./../../../config');
var log = require('./../../../log');

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

/**
 * @apiDefine DatabaseError
 *
 * @apiError DatabaseError Database could not be reached.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Requested Action Failed. Database could not be reached."
 *     }
 */
/**
 * @api {put} users/v1/verification/:id Verify User
 * @apiVersion 0.1.0
 * @apiName UserVerification
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 * @apiParam {String} authCode Authentication code sent to mobile.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *        "authCode": "6425"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */
exports.update = function(request, response) {

    try {
        if (request.params.id == null) {
            log.info({Function: "Verification.Create"}, "Verification Failed. Details: User ID is empty");
            return response.sendStatus(401);
        }

        if (request.body.authCode == null) {
            log.info({Function: "Verification.Create"}, "Verification Failed. Details: Auth Code is empty");
            return response.sendStatus(401);
        }

        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Verification.Create)");
                json = {
                    error: "User Verification Failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT auth_code FROM '+ config.mysql.db.name +'.user WHERE id = ?', request.params.id, function (queryError, user) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. User Verification Failed. UserId: " + request.params.id + " (Function = Verification.Create)");
                    json = {
                        error: "User Verification failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if ((user == null) || (user[0].auth_code == null)) {
                        var json = {
                            error: "Requested User Not Found."
                        };
                        log.info({Function: "Verification.Create"}, "User Verification Failed. Requested User Not Found. User ID: " + request.params.id);
                        return response.status(401).json(json);
                    } else {
                        if(user[0].auth_code === request.body.authCode) {
                            connection.query('UPDATE '+ config.mysql.db.name +'.user SET is_verified=1 WHERE id = ?', request.params.id, function(queryError, result) {
                                if (queryError != null) {
                                    log.error(queryError, "Query Error. User Verification failed. UserID: " + request.params.id + " (Function = Verification.Create)");
                                    json = {
                                        error: "User Verification failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                } else {
                                    return response.sendStatus(200);
                                }
                            });
                        } else {
                            log.error(queryError, "User Verification Failed. UserID: " + request.params.id + " (Function = Verification.Create)");
                            json = {
                                error: "User Verification failed. Please check the auth code."
                            };
                            return response.status(500).json(json);
                        }
                    }
                }
            });
        });
    } catch (error) {
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