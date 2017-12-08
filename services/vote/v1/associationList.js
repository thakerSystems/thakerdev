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
 * This file contains the logic for the poll answer service.
 *
 *************************************************************************/


var config = require('./../../../config');
var log = require('./../../../log');

//listing associations for participant user
exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId !== null) && (request.body.limit != null)) {
            request.getConnection(function (connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = associationList.Create)");
                    json = {
                        error: "associationList.Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                connection.query('(SELECT association.id AS associationID, association.name AS associationName, (SELECT concat(first_name," ",last_name)) AS associationAdminName  FROM association INNER JOIN user ON association.admin_id = user.id INNER JOIN association_user_map ON association.id = association_id WHERE association.is_active = ? AND user_id = ? LIMIT ?', [ "1", request.body.userId, request.body.limit], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch association list. Details " + JSON.stringify(request.body.userId) + "(Function = associationList.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(result) {
                        log.info({Function: "associationList.Create"}, "Fetched Association List.");
                        return response.status(200).json(result);
                    }
                    else {
                        log.info({Function: "associationList.Create"}, "Requested UserId not found.");
                        return response.sendStatus(404);
                    }
                });
            });
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = PollList.Create)");
        return response.status(500).json(json);
    }
};


//listing associations for the admin user.
exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = associationList.Show)");
                json = {
                    error: "PollList.Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT name FROM association WHERE admin_id = ? AND is_active = ?', [request.params.id, "1"], function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.params.id) + "(Function = associationList.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result) {
                    log.info({Function: "associationList.Show"}, "Fetched Association List.");
                    return response.status(200).json(result);
                }
                else {
                    log.info({Function: "associationList.Show"}, "Requested UserId not found.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = associationList.Show)");
        return response.status(500).json(json);
    }
};