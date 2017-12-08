/*************************************************************************
 *
 * COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, FixNix Inc.
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of FixNix Inc.. Unauthorised copying of this  file, via any medium is
 * strictly prohibited. Redistribution and use in source and binary forms,
 * with or without modification, are not permitted.
 * Proprietary and confidential.
 *
 * Author:
 * Name: Jaffar Meeran
 * Email: jaffar@fixnix.co
 * Website: http://fixnix.co
 *
 *
 * FILE SUMMARY
 * __________________
 *
 * This file contains the logic for the user service.
 *
 *************************************************************************/

var crypto = require('crypto');
var config = require('./../../../config');
var sms = require('./../../../sms');
var log = require('./../../../log');
var util = require('./../../../util');
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
 * @api {post} /users/v1/user Create User/Login
 * @apiVersion 0.1.0
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} country User's country name.
 * @apiParam {String} city User's city name.
 * @apiParam {String} phone User's phone number.
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
 *           "userId": "67"
 *     }
 *
 * @apiUse DatabaseError
 *
 */
exports.create = function(request, response) {
    var jsn;
    try {
        if((request.body.country != null && request.body.country.length != 0) && (request.body.city != null && request.body.city.length != 0) && (request.body.phone != null && request.body.phone.length != 0) && (request.body.deviceId != null && request.body.deviceId.length != 0) && (request.body.deviceToken != null && request.body.deviceToken.length != 0) && (request.body.osType != null && request.body.osType.length != 0) && (request.body.osVersion != null && request.body.osVersion.length != 0)) {

            if(request.body.country != null) {
                var country = request.body.country;
            }

            if(request.body.phone != null) {
                var phoneFilter = /^\d{10}$/;
                if(!request.body.phone.match(phoneFilter))
                {
                    jsn = {
                        error : "Not a valid phone number"
                    };
                    log.info({Function: "User.Create"}, "Not a valid phone number. Phone:" + request.body.phone);
                    return response.status(400).json(jsn);
                }
            }

            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = User.Create)");
                    jsn = {
                        error: "User Create failed. Database could not be reached."
                    };
                    return response.status(500).json(jsn);
                }

                connection.query('SELECT id FROM '+ config.mysql.db.name +'.user WHERE phone = ?', [request.body.phone], function(queryError, result) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to create a new user. User Details: " + JSON.stringify(request.body.phone) + "(Function = User.Create)");
                        jsn = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(jsn);
                    }
                    if (result[0]) {
                        if (result[0].device_token != request.body.deviceToken) {
                            var jsnData = {};
                            jsnData['device_id'] = request.body.deviceId;
                            jsnData['device_token'] = request.body.deviceToken;
                            jsnData['os_type'] = request.body.osType;
                            jsnData['os_version'] = request.body.osVersion;
                            connection.query('UPDATE '+ config.mysql.db.name +'.user SET ? Where id = ?', [jsnData, result[0].id], function(queryError, item) {
                                if(queryError != null) {
                                    log.error(queryError, "Query error. Failed to create a new user. User Details: " + JSON.stringify(request.body.phone) + "(Function = User.Create)");
                                    jsn = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(jsn);
                                }
                            });
                        }

                        var authCode = Math.floor(Math.random()*9000) + 1000;
                        var jsonData = {};
                        jsonData['auth_code'] = authCode;
                        var verificationFlag = 0;
                        if(config.userVerification.enabled) {
                            verificationFlag = 0;
                        }
                        else {
                            verificationFlag = 1;
                        }
                        connection.query('SET @publicKey = ""; SET @secretKey = ""; SET @userId = ""; CALL updateAuthCode(?, ?, ?, @publicKey, @secretKey, @userId); SELECT @publicKey AS publicKey; SELECT @secretKey AS secretKey; SELECT @userId AS userId;', [authCode, request.body.phone, verificationFlag], function(queryError, user) {

                            if(queryError != null) {
                                log.error(queryError, "Query error. Failed to create a new user. User details " + JSON.stringify(request.body.phone) + "(Function= User Create)");
                                jsn = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(jsn);
                            }
                            else {
                                if(config.userVerification.enabled) {
                                    var phoneArray = [];
                                    phoneArray.push(request.body.phone);

                                    sms.sendSMS(phoneArray, "This is fixnix OTP Service. Please enter the following verification code. Auth Code: " + authCode);
                                }
                                var userOBJ = user[6];
                                var publickkeyOBJ = user[4];
                                var secretOBJ = user[5];
                                jsn = {
                                    userId: userOBJ[0].userId,
                                    publicKey: publickkeyOBJ[0].publicKey,
                                    secretKey:  secretOBJ[0].secretKey
                                };
                                log.info({Function: "User.Create"}, "New auth code generated for a user. User ID: " + userOBJ[0].userId);
                                return response.status(200).json(jsn);

                            }
                        });
                    }
                    else {
                        var utcTimeStamp =  moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

                        crypto.randomBytes(24,function(cryptoRandomError, randomBytes) {
                            if(cryptoRandomError) {
                                jsn = {
                                    error: "Failed to create a new user."
                                };

                                log.error(cryptoRandomError, "Failed to create a new user. User Details: " + JSON.stringify(request.body.phone) + "(Function = User.Create)");
                                return response.status(500).json(jsn);
                            }
                            else {
                                crypto.pbkdf2(request.body.phone, randomBytes.toString("base64"), config.hashIterations, 24, function(cryptoPdkError, encodedPhone) {
                                    if(cryptoPdkError) {
                                        jsn = {
                                            error: "Failed to create a new user."
                                        };
                                        log.error(cryptoPdkError, "Failed to create new user. User Details: " + JSON.stringify(request.body.phone) + "(Function = User.Create)");
                                        return response.status(500).json(jsn);
                                    }
                                    else {
                                        var authCode = Math.floor(Math.random()*9000) + 1000;
                                        var publicKey = crypto.randomBytes(32).toString("hex");
                                        var secretKey = crypto.randomBytes(64).toString("hex");

                                        var verificationFlag = 0;
                                        if(config.userVerification.enabled) {
                                            verificationFlag = 0;
                                        }
                                        else {
                                            verificationFlag = 1;
                                        }

                                        if(util.getCountryCode(request.body.country) == "Undefined") {
                                            jsn = {
                                                error: "Invalid Country Name"
                                            };
                                            log.info({Function: "User.Create"}, "Invalid Country Name. Country Name: " + JSON.stringify(request.body.country));
                                            return response.status(500).json(jsn);
                                        }

                                        //userPhone, userCountry, countryCode, userCity, userRole, authCode, createdTime, publicKey, secretKey, verificationFlag, authCode, roleId, authTypeId, country, city, countryCode, deviceId, deviceToken, osType, osVersion
                                        connection.query('INSERT INTO '+ config.mysql.db.name +'.user (phone, public_key, secret_key, access_time, created_time, updated_time, is_verified, auth_code, role_id, auth_type_id, country, city, country_code, device_id, device_token, os_type, os_version, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [request.body.phone, publicKey, secretKey, utcTimeStamp, utcTimeStamp, utcTimeStamp, verificationFlag, authCode, "1", "1", request.body.country, request.body.city, util.getCountryCode(request.body.country), request.body.deviceId, request.body.deviceToken, request.body.osType, request.body.osVersion, "1"], function(queryError, user) {

                                            if(queryError != null) {
                                                log.error(queryError, "Query error. Failed to create a new user. User details " + JSON.stringify(request.body.phone) + "(Function= User Create)");
                                                jsn = {
                                                    error: "Requested action failed. Database could not be reached."
                                                };
                                                return response.status(500).json(jsn);
                                            }
                                            else {
                                                if(config.userVerification.enabled) {
                                                    var phoneArray = [];
                                                    phoneArray.push(request.body.phone);

                                                    sms.sendSMS(phoneArray, "This is fixnix OTP Service. Please enter the following verification code. Auth Code: " + authCode);
                                                }
                                                var userID = user.insertId;
                                                jsn = {
                                                    userId: userID,
                                                    publicKey: publicKey,
                                                    secretKey: secretKey
                                                };
                                                log.info({Function: "User.Create"}, "New user created successfully. User ID: " + userID);
                                                return response.status(200).json(jsn);

                                            }
                                        });
                                    }

                                });
                            }

                        });
                    }
                });
            });

        }
        else {
            jsn ={
                error: "Country, city, phone, deviceId, deviceToken, osType, osVersion are required."
            };
            log.error({Function: "User.Create"}, "Country, city, phone, deviceId, deviceToken, osType, osVersion are required.");
            return response.status(400).json(jsn);
        }
    }
    catch(error){
        jsn = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: User.Create)");
        return response.status(500).json(jsn);
    }
};

/**
 * @api {delete} users/v1/user/:id Delete User
 * @apiVersion 0.1.0
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */
exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = User.Delete)");
                json = {
                    error: "User Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('CALL deleteUser(?);', request.params.id, function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Delete A User. User ID: " + request.params.id + " (Function = User.Delete)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (result.affectedRows != 0) {
                        log.info({Function: "User.Delete"}, "User Deleted Successfully. id: " + request.params.id);
                        return response.sendStatus(200);
                    } else {
                        log.info({Function: "User.Delete"}, "Requested User Not Found. User ID: " + request.params.id );
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = User.Delete)");
        return response.status(500).json(json);
    }
};

exports.index = function(request, response) {
    var json = {};

    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = User.Show)");
                json = {
                    error: "User Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT * FROM ' + config.mysql.db.name + '.user', function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Retrieve User Details." + " (Function = User.Show)");
                    json =
                    {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else
                {
                    return response.status(200).json({data: result});
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = User.Show)");
        return response.status(500).json(json);
    }
};

/**
 * @api {get} users/v1/user/:id Show User
 * @apiVersion 0.1.0
 * @apiName ShowUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "access_time": "2015-10-12T18:44:48.000Z",
 *         "dob": null,
 *         "country": "India",
 *         "country_code": 91,
 *         "city": "Chennai",
 *         "last_name": "Doe",
 *         "is_verified": 1,
 *         "secret_key": "35126696ab4cd2eb09ec0f65c42aa6d8fb404033175244da209e89551e4890b38c43bb5941ece6fa7ce7bc835a0e68d696b4be0346fabefccb3a4f92c90c3170",
 *         "id": 3,
 *         "gender": "male",
 *         "email": "johndoe@gmail.com",
 *         "phone": "9991234567",
 *         "auth_code": "6425",
 *         "auth_type_id": 1,
 *         "created_time": "2015-10-12T18:44:48.000Z",
 *         "role_id": 1,
 *         "password": null,
 *         "updated_time": "2015-10-12T19:51:41.000Z",
 *         "first_name": "John",
 *         "public_key": "144150e9404af9bb6b3fb7a480e2c122bd0af209235c6a673b7a33a62d58f293"
 *       }
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */
exports.show = function(request, response) {
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = User.Show)");
                json = {
                    error: "User Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT * FROM ' + config.mysql.db.name + '.user WHERE id = ?', request.params.id, function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Retrieve User Details. User ID: " + request.params.id + " (Function = User.Show)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (result[0]) {
                        log.info({Function: "User.Show"}, "Fetched User Details. User Id: " + request.params.id);
                        return response.status(200).json(result[0]);
                    } else {
                        log.info({Function: "User.Show"}, "Requested User Not Found");
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = User.Show)");
        return response.status(500).json(json);
    }
};

/**
 * @api {put} users/v1/user/:id Update User
 * @apiVersion 0.1.0
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 * @apiParam {String} fname User's first name.
 * @apiParam {String} lname User's last name.
 * @apiParam {String} email User's email.
 * @apiParam {String} phone User's phone number.
 * @apiParam {String} country User's country name.
 * @apiParam {String} city User's city name.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *        "fname": "John",
 *        "lname": "Doe",
 *        "email": "johndoe@gmail.com",
 *        "phone": "9991234567",
 *        "country": "India",
 *        "city":"Chennai"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "access_time": "2015-10-12T18:44:48.000Z",
 *         "dob": null,
 *         "country": "India",
 *         "country_code": 91,
 *         "city": "Chennai",
 *         "last_name": "Doe",
 *         "is_verified": 1,
 *         "secret_key": "35126696ab4cd2eb09ec0f65c42aa6d8fb404033175244da209e89551e4890b38c43bb5941ece6fa7ce7bc835a0e68d696b4be0346fabefccb3a4f92c90c3170",
 *         "id": 3,
 *         "gender": "male",
 *         "email": "johndoe@gmail.com",
 *         "phone": "9991234567",
 *         "auth_code": "6425",
 *         "auth_type_id": 1,
 *         "created_time": "2015-10-12T18:44:48.000Z",
 *         "role_id": 1,
 *         "password": null,
 *         "updated_time": "2015-10-12T19:51:41.000Z",
 *         "first_name": "John",
 *         "public_key": "144150e9404af9bb6b3fb7a480e2c122bd0af209235c6a673b7a33a62d58f293"
 *       }
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */
exports.update = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = User.Update)");
                json = {
                    error: "User Update failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT id FROM ' + config.mysql.db.name + '.user WHERE id = ?', request.params.id, function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Update User Details. User ID: " + request.params.id + " (Function = User.Update)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (result[0]) {
                        if ((request.body.publickey != null) || (request.body.secret != null) || (request.body.user_id != null) || (request.body.access_time != null) || (request.body.updated_time != null) || (request.body.created_time != null)) {
                            json = {
                                error: "Failed To Update The User Details"
                            };
                            log.info({Function: "User.Update"}, "Failed To Update The User Details. User ID: " + request.params.id);
                            return response.status(400).json(json);
                        }

                        var jsonData = {};
                        if (request.body.fname != null) {
                            jsonData['first_name'] = request.body.fname;
                        }
                        if (request.body.lname != null) {
                            jsonData['last_name'] = request.body.lname;
                        }
                        if(request.body.country != null) {
                            jsonData['country'] = request.body.country;
                            jsonData['country_code'] = util.getCountryCode(request.body.country);
                        }
                        if(request.body.isActive != null) {
                            jsonData['is_active'] = request.body.isActive;
                        }
                        if(request.body.city != null) {
                            jsonData['city'] = request.body.city;
                        }
                        if (request.body.email != null) {
                            var emailFilter = config.emailFilterRegex;
                            if (!emailFilter.test(request.body.email)) {
                                json = {
                                    error: "Not a valid email address"
                                };
                                log.info({Function: "User.Update"}, "Not a valid email address. Email:" + request.body.email);
                                return response.status(400).json(json);
                            }
                            jsonData['email'] = request.body.email.toLowerCase();
                        }
                        if ((request.body.phone != null)) {
                            var phoneFilter = /^\d{10}$/;
                            if(request.body.phone.match(phoneFilter)) {
                                jsonData['phone'] = request.body.phone;
                            } else {
                                json = {
                                    error: "Not a valid phone number"
                                };
                                log.info({Function: "User.Update"}, "Not a valid phone number. Phone:" + request.body.phone);
                                return response.status(400).json(json);
                            }
                        }
                        if (request.body.password != null) {
                            var passwordFilter = config.passwordFilterRegex;
                            if (!passwordFilter.test(request.body.password)) {
                                json = {
                                    error: "Not a valid password. Password should be 6 characters and must contain at least one digit"
                                };
                                log.info({Function: "User.Update"}, "Not a valid password. Password:" + "REDACT");
                                return response.status(400).json(json);
                            }
                            var randomBytes = crypto.randomBytes(24);
                            var encodedPassword = crypto.pbkdf2Sync(request.body.password, randomBytes.toString("base64"), config.hashIterations, 24);
                            jsonData['password'] = config.hashIterations + ":" + randomBytes.toString("base64") + ":" + (encodedPassword.toString("base64"));
                        }

                        var utcTimeStamp =  moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                        jsonData['updated_time'] = utcTimeStamp;

                        connection.query('UPDATE '+ config.mysql.db.name +'.user SET ? WHERE id = ?', [jsonData,request.params.id], function(queryError, result) {
                            if (queryError != null) {
                                log.error(queryError, "Query Error. Failed To Update User Details. User ID: " + request.params.id + " (Function = User.Update)");
                                json = {
                                    error: "Requested Action Failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            } else {
                                connection.query('SELECT * FROM '+ config.mysql.db.name +'.user WHERE id = ?', request.params.id, function(queryError, user) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query Error. Failed To Update User Details. User ID: " + request.params.id + " (Function = User.Update)");
                                        json = {
                                            error: "Requested Action Failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    } else {
                                        log.info({Function: "User.Update"}, "User Updated Successfully. User Id: " + request.params.id);
                                        return response.status(200).json(user[0]);
                                    }
                                });

                            }
                        });

                    } else {
                        log.info({Function: "User.Update"}, "Requested user not found");
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = User.Update)");
        return response.status(500).json(json);
    }
};

exports.options = function(request, response) {
    return response.sendStatus(200);
};

exports.head = function(request, response) {
    return response.sendStatus(200);
};
