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
 * This file contains the logic for the survey service.
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
 * @api {post} /survey/v1/survey Create Survey
 * @apiVersion 0.1.0
 * @apiName Survey
 * @apiGroup Survey
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *          "pollId": "11",
 *          "fname": "steve",
 *          "lname": "jobs",
 *          "phone": "9878987678"
 *          "questionList": [
 *                  {
 *                      "question": "Who is the best cricketer?",
 *                      "option": "Sachin"
 *                  },
 *                  {
 *                      "question": "Who is the best footballer?",
 *                      "option": "Messi"
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
 *
 */


exports.create = function(request, response) {
  var json;
    try{
        if((request.body.questionList !== null) && (request.body.fname != null) && (request.body.lname != null) && (request.body.phone != null) && (request.body.pollId != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Poll.Answer)");
                    json = {
                        error: "Poll Delete failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                var fname = request.body.fname, lname = request.body.lname;
                connection.query('SET @userId = 0; CALL setAudienceForSurvey(?, ?, ?, ?, ?, @userId); SELECT @userId AS userId;', [request.body.phone, request.body.pollId, utcTimeStamp, fname, lname], function (queryError, user) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to update audience. User details " + JSON.stringify(request.body.phone) + "(Function= Survey.Create)");
                        jsn = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(user) {
                        var userObj = user[2];
                        var userId = userObj[0].userId;
                        var questionAnswer = request.body.questionList;
                        for(var i=0; i<questionAnswer.length; i++) {
                            connection.query('INSERT INTO ' + config.mysql.db.name + '.answer (time, question_id, question_options_id, user_id) VALUES (?, ?, ?, ?)', [utcTimeStamp, questionAnswer[i].questionId, questionAnswer[i].optionId, userId], function (queryError, result) {
                                if (queryError != null) {
                                    log.error(queryError, "Query error. Failed to record a new answer. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Survey.Create)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                                else {
                                    log.info({Function: "Survey.Create"}, "New answer has been recorded successfully.");
                                }
                            });
                        }
                        return response.sendStatus(200);
                    }
                    else {
                        log.info({Function: "Survey.Create"}, "Requested Poll Not Found");
                        return response.sendStatus(404);
                    }
                });
            });
        }
        else {
            log.info({Function: "Survey.Create"}, "Parameters required.");
            return response.sendStatus(400);
        }
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Survey.Create)");
        return response.status(500).json(json);
    }
};