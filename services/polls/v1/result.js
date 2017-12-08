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

/**
 * @apiDefine PollNotFoundError
 *
 * @apiError PollNotFound The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

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
 * @api {show} /polls/v1/result/:id  Show poll results
 * @apiVersion 0.1.0
 * @apiName Poll Result
 * @apiGroup Poll
 *
 * @apiParam {String} id Poll Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "pollName": "Composer",
 *      "questionList": [
 *          {
 *              "choices": [
 *                  {
 *                      "resultCount": 3,
 *                      "choice": "JS Bach"
 *                  }
 *              ],
 *              "questionType": "text",
 *              "question": "Who is the composer of the baroque period"
 *          },
 *          {
 *              "choices": [
 *                  {
 *                      "resultCount": 3,
 *                      "choice": "Beethovan"
 *                  }
 *              ],
 *              "questionType": "text",
 *              "question": "Who's is the symphony piece 'FurElise'?"
 *          }
 *      ],
 *      "createdUserId": 6,
 *      "category": "music"
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse PollNotFoundError
 *
 */


exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Poll.Result)");
                json = {
                    error: "Poll Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT poll.poll_name AS pollName,(SELECT name FROM category WHERE id = (SELECT category_id FROM category_poll_map WHERE poll_id = poll.id)) AS category, poll.created_user_id AS createdUserId, question.question AS question, question_options.`option` AS choices, COUNT(answer.question_options_id) AS resultCount FROM poll INNER JOIN question ON question.poll_id = poll.id INNER JOIN question_options ON question_options.question_id = question.id RIGHT JOIN answer ON (answer.question_id = question.id) AND (answer.question_options_id = question_options.id) WHERE poll.id = ? GROUP BY answer.question_options_id;', request.params.id, function(queryError, resultSet) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to record a new answer. Poll Result details " + JSON.stringify(request.params.id) + "(Function = Poll.Result)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    if (resultSet) {
                        var jsonOutput = {
                            pollName:           resultSet[0].pollName,
                            category:           resultSet[0].category,
                            createdUserId:      resultSet[0].createdUserId,
                            questionList: []
                        };
                        var questionObj = {};

                        resultSet.forEach(function(entry) {
                            if (typeof questionObj[entry.question] == "undefined") {
                                questionObj[entry.question] = [];
                            }
                            var choiceObj = {
                                choice:         entry.choices,
                                resultCount:    entry.resultCount
                            };
                            questionObj[entry.question].push(choiceObj);
                        });

                        for (var question in questionObj) {
                            if (questionObj.hasOwnProperty(question)) {
                                jsonOutput.questionList.push({
                                    choices: questionObj[question],
                                    questionType: "text",
                                    question: question
                                });
                            }
                        }
                        log.info({Function: "Poll.Result"}, "Fetched Poll Results. Poll Id: " + request.params.id);
                        return response.status(200).json(jsonOutput);
                    }
                    else {
                        log.info({Function: "Poll.Result"}, "Requested Poll Result Not Found");
                        return response.sendStatus(404);
                    }
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Poll.Result)");
        return response.status(500).json(json);
    }
};