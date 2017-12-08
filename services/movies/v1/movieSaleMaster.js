/**
 * Created by Jaffar on 5/7/2016.
 */

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
 * This file contains the logic for the movie service.
 *
 *************************************************************************/

var crypto = require('crypto');
var config = require('./../../../config');
var sms = require('./../../../sms');
var log = require('./../../../log');
var util = require('./../../../util');
var moment = require('moment');

/**
 * @apiDefine movieNotFoundError
 *
 * @apiError movieNotFound The requested movie was not found.
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
 * @api {post} /movies/v1/movie Create Movie Sale/Login
 * @apiVersion 0.1.0
 * @apiName Create Movie Sale Request
 * @apiGroup movie
 *
 * @apiParam {String} country movie's country name.
 * @apiParam {String} city movie's city name.
 * @apiParam {String} phone movie's phone number.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "country": "India",
 *           "city": "Chennai",
 *           "phone": "9991234567"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           "secretKey": "2b73926b3cf4f6554eb5f2eadc38be95e3b1e883b7e16d3f80fbe6b5732501007575f90ea947d988a6c63bab8216ca2dd2fcc2a0e7b604a8f8a76c3856f4fdf2",
 *           "publicKey": "5ba30d56a51dea3c77bba7bddc39885d6a01879d18dbb6eb4df406d6988d8d55",
 *           "movieId": "67"
 *     }
 *
 * @apiUse DatabaseError
 *
 */

exports.create = function(request, response) {
    var jsn;

    try {
        if ((request.body.movieId != null && request.body.movieId.length != 0) &&
            (request.body.movieName != null && request.body.movieName.length != 0) &&
            (request.body.postedByUserId != null && request.body.postedByUserId.length != 0) &&
            (request.body.sessionToken != null && request.body.sessionToken.length != 0) &&
            (request.body.deviceToken != null && request.body.deviceToken.length != 0))
        {
            var movieId = request.body.movieId;
            var movieName = request.body.movieName;
            var userId = request.body.postedByUserId;
            log.info({Function: "movie.Create"}, "New Movie Sale Request:" + request.body.movieId);
            console.log({Function: "movie.Create"}, "New Movie Sale Request:" + request.body.movieId);
        }
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = movie.Create)");
                console.log(connectionError, "Database connection error (Function = movie.Create)");
                jsn = {error: "movie Create failed. Database could not be reached."};
                return response.status(500).json(jsn);
            }

            connection.query('SELECT sessionToken FROM ' + config.mysql.db.name + '.session WHERE sessionToken = ?', [request.body.sessionToken], function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create a new sale for movie. movie Details: " + JSON.stringify(request.body.movieId) + "(Function = movie.Create)");
                    console.log(queryError, "Query error. Failed to create a new sale for movie. movie Details: " + JSON.stringify(request.body.movieId) + "(Function = movie.Create)");
                    jsn = {error: "Requested action failed. Database could not be reached."};
                    return response.status(500).json(jsn);
                }
                if (result[0]) {
                    if (result[0].sessionToken == request.body.sessionToken) {
                        var jsnData = {};
                        var id = Math.floor(Math.random() * 900) + 999;
                        var updatedAt = new Date();

                        connection.query('SELECT movieName FROM ' + config.mysql.db.name + '.movieMaster WHERE movieId = ?', request.body.movieObjectId,function(queryError,objectId)
                        {
                            if(queryError!=null)
                            {
                                log.error(queryError, "Query error. Failed to add new movie sale post" + JSON.stringify(request.body.movieId) + "(Function = movieSaleMaster.create)");
                                console.log("error: "+queryError);
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }

                            if(!objectId[0])
                            {
                                json =
                                {
                                    error: "An error occurred, please contact administrator, in parallel you can logout and relogin"
                                };
                                console.log("Movie Object ID mismatch");
                                return response.status(500).json(json);
                            }

                            if(objectId[0])
                            {
                                var checkmovieName = objectId[0].movieName;
                                if(checkmovieName != request.body.movieName)
                                {
                                    json =
                                    {
                                        error: "An error occurred, please contact administrator, in parallel you can logout and relogin"
                                    };
                                    console.log("Movie Object ID mismatch");
                                    return response.status(500).json(json);
                                }
                                if(checkmovieName == request.body.movieName)
                                {
                                    console.log("movieName matched: " + checkmovieName);

                                    connection.query('SELECT postedByUser, movieName FROM ' + config.mysql.db.name + '.moviesalemaster WHERE postedByUser = ? AND postedByUserId = ? AND movieName = ? AND theatreName = ? AND screenName = ? AND originalSeatsArray = ? AND originalNoOfTickets = ? AND movieDateTime = ?',
                                        [request.body.postedByUser,request.body.postedByUserId,request.body.movieName,request.body.theatreName, request.body.screenName,request.body.originalSeats,request.body.originalNoOfTickets,request.body.movieDateTime],
                                        function(queryError, status)
                                        {
                                            if(queryError!=null)
                                            {
                                                log.error(queryError, "Query error. Failed to add new movie sale post" + JSON.stringify(request.body.movieId) + "(Function = movieSaleMaster.create)");
                                                console.log("error: "+queryError);
                                                json = {
                                                    error: "Requested action failed. Database could not be reached."
                                                };
                                                return response.status(500).json(json);
                                            }
                                            if(status[0])
                                            {
                                                json = {
                                                    duplicate: "A similar request already exists, you can only post a ticket once"
                                                };
                                                return response.status(500).json(json);
                                            }
                                            if (!status[0])
                                            {
                                                connection.query('INSERT INTO ' + config.mysql.db.name + '.moviesalemaster (id, movieId, movieObjectId, movieName, updatedAt, theatreName, screenName, pricePerTicket, postedByUser, postedByUserId, sessionToken, originalSeatsArray, tradedSeatsArray, originalNoOfTickets, tradedNoOfTickets, ticketFile, movieDateTime, movieStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                                    [id, request.body.movieId, request.body.movieObjectId, request.body.movieName, updatedAt, request.body.theatreName, request.body.screenName, request.body.pricePerTicket, request.body.postedByUser, request.body.postedByUserId, request.body.sessionToken, request.body.originalSeats, request.body.originalSeats, request.body.originalNoOfTickets, request.body.originalNoOfTickets, request.body.ticketFile, request.body.movieDateTime, "Active"],
                                                    function (queryError, status)
                                                    {
                                                        if (queryError != null)
                                                        {
                                                            log.error(queryError, "Query error. Failed to add new movie sale post" + JSON.stringify(request.body.movieId) + "(Function = movieSaleMaster.create)");
                                                            console.log("error");
                                                            json = {
                                                                error: "Requested action failed. Database could not be reached."
                                                            };
                                                            return response.status(500).json(json);
                                                        }
                                                        if (status != null)
                                                        {
                                                            var newSalePostCount;
                                                            connection.query('SELECT COUNT(movieName) as CNT from ' + config.mysql.db.name + '.moviesalemaster WHERE movieObjectId = ?',[request.body.movieObjectId],
                                                            function(queryError,count)
                                                            {
                                                                if(queryError!=null)
                                                                {
                                                                    log.error(queryError, "Query error. Failed to update salePostCount" + JSON.stringify(request.body.movieObjectId) + "(Function = movieSaleMaster.create)");
                                                                    console.log("error: "+queryError);
                                                                }
                                                                if(count[0])
                                                                {
                                                                    console.log(count[0]);
                                                                    newSalePostCount = count[0].CNT;
                                                                    console.log("Count: " + newSalePostCount);
                                                                    connection.query('UPDATE ' + config.mysql.db.name + '.moviemaster SET salePostCount = ? WHERE movieId = ?',[newSalePostCount,request.body.movieObjectId],
                                                                        function(queryError,status)
                                                                        {
                                                                            if (queryError != null)
                                                                            {
                                                                                log.error(queryError, "Query error. Failed to add new movie sale post count" + JSON.stringify(request.body.movieId) + "(Function = movieSaleMaster.create)");
                                                                                console.log("error");
                                                                                json = {
                                                                                    error: "Requested action failed. Database could not be reached."
                                                                                };
                                                                                return response.status(500).json(json);
                                                                            }

                                                                            if(status!= null)
                                                                            {
                                                                                return response.status(200).json("Success, movie Sale Captured");
                                                                            }
                                                                            console.log(status);
                                                                        });
                                                                }
                                                            });
                                                        }

                                                    });
                                            }
                                        });
                                }

                            }
                        })

                    }
                }
            });
        });
    }

    catch(error)
    {
        json =
        {
            error: "Error: " + error.message
        };
        console.log("Error" + error.message);
        log.error(error, "Exception Occurred (Function = Answer.Create)");
        return response.status(500).json(json);
    }
};