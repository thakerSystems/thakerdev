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
 * @apiDefine PollNotFoundError
 *
 * @apiError PollNotFound The requested poll was not found.
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
 * @api {post} /polls/v1/answer Answer poll
 * @apiVersion 0.1.0
 * @apiName Answer
 * @apiGroup Poll
 *
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *          "pollId": "11",
 *          "userId": "4",
 *          "questionList": [
 *                  {
 *                      "questionId": "4",
 *                      "optionId": "8"
 *                  },
 *                  {
 *                      "questionId": "5",
 *                      "optionId": "11"
 *                  }
 *             ]
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse PollNotFoundError
 *
 */


exports.create = function(request, response) {
    var json;
    try {
        if((request.body.questionList !== null) && (request.body.questionList.optionId != null) && (request.body.questionList.questionId != null) && (request.body.userId != null) && (request.body.pollId != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Answer.create)");
                    json = {
                        error: "Poll Delete failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var questionAnswer = request.body.questionList;
                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                connection.query('SELECT is_generic FROM ' + config.mysql.db.name + '.poll WHERE id = ?', request.body.pollId, function(queryError, item) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to update audience. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(item[0].is_generic == 1) {
                        connection.query('INSERT INTO '+ config.mysql.db.name + '.audience_poll_map (user_id, poll_id, poll_answered_time, is_answered) VALUES (?, ?, ?, ?)', [request.body.userId, request.body.pollId, utcTimeStamp, "1"], function(queryError, check) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to update audience. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(check) {
                                for(var i=0; i<questionAnswer.length; i++) {
                                    if((questionAnswer[i].questionId != null) && (questionAnswer[i].optionId != null)) {
                                        connection.query('INSERT INTO ' + config.mysql.db.name + '.answer (time, question_id, question_options_id, user_id) VALUES (?, ?, ?, ?)', [utcTimeStamp, questionAnswer[i].questionId, questionAnswer[i].optionId, request.body.userId], function (queryError, result) {
                                            if (queryError != null) {
                                                log.error(queryError, "Query error. Failed to record a new answer. Answer details: PollID " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                                json = {
                                                    error: "Requested action failed. Database could not be reached."
                                                };
                                                return response.status(500).json(json);
                                            }
                                            else {
                                                log.info({Function: "Poll.Answer"}, "New answer has been recorded successfully.");
                                            }
                                        });
                                    }
                                    else {
                                        log.error(queryError, "Query error. Failed to record a new answer. Answer details: PollID " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                        json = {
                                            error: "Question and option should not be null."
                                        };
                                        return response.status(500).json(json);
                                    }
                                }
                            }

                        });

                        return response.sendStatus(200);
                    }
                    else if(item[0].is_generic == 0) {
                        connection.query('SELECT user_id FROM audience_poll_map WHERE poll_id = ? AND user_id = ?', [request.body.pollId, request.body.userId], function(queryError, check) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to select audience. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(check[0]) {
                                connection.query('UPDATE '+ config.mysql.db.name + '.audience_poll_map SET poll_answered_time = ?, is_answered = 1 WHERE poll_id = ? AND user_id = ?', [utcTimeStamp, request.body.pollId, request.body.userId], function(queryError, action) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query error. Failed to update audience. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                        json = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    else{
                                        for(var i=0; i<questionAnswer.length; i++) {
                                            if((questionAnswer[i].questionId != null) && (questionAnswer[i].optionId != null)) {
                                                connection.query('INSERT INTO ' + config.mysql.db.name + '.answer (time, question_id, question_options_id, user_id) VALUES (?, ?, ?, ?)', [utcTimeStamp, questionAnswer[i].questionId, questionAnswer[i].optionId, request.body.userId], function (queryError, result) {
                                                    if (queryError != null) {
                                                        log.error(queryError, "Query error. Failed to record a new answer. Answer details: PollID " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                                        json = {
                                                            error: "Requested action failed. Database could not be reached."
                                                        };
                                                        return response.status(500).json(json);
                                                    }
                                                    else {
                                                        log.info({Function: "Poll.Answer"}, "New answer has been recorded successfully.");
                                                    }
                                                });
                                            }
                                            else {
                                                log.error(queryError, "Query error. Failed to record a new answer. Answer details: PollID " + JSON.stringify(request.body.pollId) + "(Function = Answer.create)");
                                                json = {
                                                    error: "Question and option should not be null."
                                                };
                                                return response.status(500).json(json);
                                            }
                                        }
                                        return response.sendStatus(200);
                                    }
                                });
                            }
                            else {
                                log.info({Function: "Answer.create"}, "PollID and UserID doesn't match.");
                                return response.sendStatus(404);
                            }
                        });
                    }
                    else {
                        log.info({Function: "Answer.create"}, "Requested poll not found.");
                        return response.sendStatus(404);
                    }
                });
            });
        }
        else {
            json = {
                error: "Parameters should not be empty!"
            };
            log.info({Function: "Answer.create"}, "Parameters are empty.");
            return response.status(500).json(json);
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Answer.Create)");
        return response.status(500).json(json);
    }
};