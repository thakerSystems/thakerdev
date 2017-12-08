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
var moment = require('moment');


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
 * @api {post} /polls/v1/pollList Show polls for Audience
 * @apiVersion 0.1.0
 * @apiName CreatePollList
 * @apiGroup Poll
 *
 * @apiParam {String} id Audience User Id.
 * @apiParam {String} limit Limit for number of polls.
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "userId": "4",
 *           "limit": "15"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *     {
 *     "id": 12,
 *     "start_date": "2015-10-23T05:22:22.000Z",
 *     "poll_id": 4,
 *     "is_skipped": 0,
 *     "is_boost": 0,
 *     "end_date": "2015-10-23T05:22:22.000Z",
 *     "user_id": 9,
 *     "poll_type_id": 3,
 *     "created_user_id": 9,
 *     "poll_name": "Cinema",
 *     "is_answered": "0",
 *     "is_active": 1,
 *     "isGeneric": 1,
 *     "reward_type_id": 1,
 *     "visibility_type_id": 1,
 *     "poll_answered_time": null
 *     },
 *     {
 *     "id": 15,
 *     "start_date": "2015-10-23T05:30:04.000Z",
 *     "poll_id": 5,
 *     "is_skipped": 0,
 *     "is_boost": 0,
 *     "end_date": "2015-10-23T05:30:04.000Z",
 *     "user_id": 9,
 *     "poll_type_id": 2,
 *     "created_user_id": 6,
 *     "poll_name": "Composer",
 *     "is_answered": "0",
 *     "is_active": 1,
 *     "isGeneric": 1,
 *     "reward_type_id": 1,
 *     "visibility_type_id": 1,
 *     "poll_answered_time": null
 *     }
 *     ]
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */


//listing polls intended to the specific user.
exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId !== null) && (request.body.limit != null)) {
            request.getConnection(function (connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = PollList.Create)");
                    json = {
                        error: "PollList.Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                connection.query('(SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, is_answered AS isAnswered, (SELECT concat(first_name," ",last_name)) AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id INNER JOIN audience_poll_map ON poll.id = poll_id WHERE poll.end_date > ? AND user_id = ?) UNION (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, "0" AS isAnswered, (SELECT concat(first_name," ",last_name)) AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id WHERE is_generic = ? AND poll.id NOT IN (SELECT poll_id FROM audience_poll_map WHERE user_id = ?)) LIMIT ?', [utcTimeStamp, request.body.userId, "1", request.body.userId, request.body.limit], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.body.userId) + "(Function = PollList.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(result) {
                        log.info({Function: "PollList.Create"}, "Fetched Poll List.");
                        return response.status(200).json(result);
                    }
                    else {
                        log.info({Function: "PollList.Create"}, "Requested UserId not found.");
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


/**
 * @api {get} /polls/v1/pollList/:id Show polls for Created User
 * @apiVersion 0.1.0
 * @apiName ShowPollList
 * @apiGroup Poll
 *
 * @apiParam {Number} id Created User Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *          "visibility_type_id": 1,
 *          "created_user_id": 6,
 *          "poll_type_id": 2,
 *          "id": 1,
 *          "poll_name": "Best Footballer",
 *          "start_date": "2015-10-23T04:39:20.000Z",
 *          "reward_type_id": 1,
 *          "is_boost": 0,
 *          "is_active": 1,
 *          "end_date": "2015-10-23T04:39:20.000Z"
 *      },
 *      {
 *          "visibility_type_id": 1,
 *          "created_user_id": 6,
 *          "poll_type_id": 2,
 *          "id": 5,
 *          "poll_name": "Composer",
 *          "start_date": "2015-10-23T05:30:04.000Z",
 *          "reward_type_id": 1,
 *          "is_boost": 0,
 *          "is_active": 1,
 *          "isGeneric": 1,
 *          "end_date": "2015-10-23T05:30:04.000Z"
 *      },
 *      {
 *          "visibility_type_id": 1,
 *          "created_user_id": 6,
 *          "poll_type_id": 2,
 *          "id": 6,
 *          "poll_name": "Composer",
 *          "start_date": "2015-10-23T05:30:09.000Z",
 *          "reward_type_id": 1,
 *          "is_boost": 0,
 *          "is_active": 1,
 *          "isGeneric": 1,
 *          "end_date": "2015-10-23T05:30:09.000Z"
 *      }
 *    ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */


//listing polls created by the specific user.
exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Poll.Show)");
                json = {
                    error: "PollList.Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM poll WHERE created_user_id = ?', request.params.id, function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.params.id) + "(Function = PollList.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result) {
                    log.info({Function: "PollList.Show"}, "Fetched Poll List.");
                    return response.status(200).json(result);
                }
                else {
                    log.info({Function: "PollList.Show"}, "Requested UserId not found.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = PollList.Create)");
        return response.status(500).json(json);
    }
};