/*
COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Thaker Systems.
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of FixNix Inc. Unauthorised copying of this  file, via any medium is
 * strictly prohibited. Redistribution and use in source and binary forms,
 * with or without modification, are not permitted.
 * Proprietary and confidential.
 *
 * Author:
 * Name: Jaffar
 * Email: --
 * Website: --
 *
 *
 * FILE SUMMARY
 * __________________
 *
 * This file contains the logic for the school creation service.
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
        if (request.body.inUserId == null)
        {
            log.info({Function: "Class.Create. GUID: " + guidInstance}, "Class Create Request. Details: 'User Id' is empty");
            json = {
                    error: "Class Create Request failed. User Id is not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }

	if (request.body.sessionToken == null || request.body.sessionToken.length < 1)
        {
            log.info({Function: "Class.Create. GUID: " + guidInstance}, "Class Create Request. Details: 'session Token' is empty");
            json = {
                    error: "Class Create Request failed. Session Token is not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }

        if (request.body.accessType == null)
        {
            log.info({Function: "Class.Create. GUID: " + guidInstance}, "Class Create Request. Details: 'Access Type' is empty");
            json = {
                    error: "Class Create Request failed. Access Type is not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }

	if (!request.body.className || !request.body.classSection || !request.body.schoolId || !request.body.classTeacherId)
        {
            log.info({Function: "Class.Create. GUID: " + guidInstance}, "Class Create Request Failed. Details: 'Mandatory Parameters are not found' with the request");
            json = {
                    error: "Class Create Request failed. Mandatory Parameters not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }
        request.getConnection(function(connectionError, connection)
        {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Class.Create). GUID: " + guidInstance);
                json = {
                    error: "Class Create Request failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                };
                return response.status(500).json(json);
            }
            var outStatus = "";
            connection.query('SET @outStatus = ""; CALL createClass(?,?,?,?,?,?,?, @outStatus); SELECT @outStatus as outStatus;', [request.body.inUserId, request.body.sessionToken, request.body.className, request.body.classSection, request.body.classTeacherId, request.body.classCaptain, request.body.schoolId], function (queryError, classCreateResponse)
                {
			var classResponse = JSON.parse(JSON.stringify(classCreateResponse));
                    if (queryError != null)
                    {
                        log.error(queryError, "Query Error. Class Create Request failed. Class Name: " + request.body.ClassName + " (Function = Class.Create). GUID: " + guidInstance);
                        json =
                            {
                                error: "Class Create Request failed. Please contact administrator if the problem persists :: admin@thakersystems.com. Your Unique Reference is: " + guidInstance
                            };
                        return response.status(500).json(json);
                    }
		    else if(classResponse[2][0].outStatus)
			{
		   		if(classResponse[2][0].outStatus != 'Success')
				{
				json = 
				{
					error: "Class Create Request failed. Details: Error in Request, if the problem persits contact administrator :: admin@thersystems.com. Your Unique Reference is: " + guidInstance
				};
			log.info({Function: "Class.Create"}, "Class Create Request failed. Details: Invalid request or there is an issue with your request, please contact administrator if the problem persits :: admin@thakersystems.com. GUID: " + guidInstance);
                        return response.status(401).json(json);
		        	}
				else
		    		{
					json = 
					{
						success: "Class Created Successfully. Your Unique Reference is: " + guidInstance
					};
					log.info({Function: "Class.Create"}, "Class Create Request Success. GUID: " + guidInstance);
					return response.status(200).json(json);
  		    		}
			}
                });
        });
    }
catch (error) {
        json = {
            error: "Error: " + error.message + " Your Unique Reference is: " + guidInstance
        };
        log.error(error, "Exception Occurred (Function = Class.Create). GUID: " + guidInstance);
        return response.status(500).json(json);
    }
};

/*Class Show [GET] */

exports.show = function(request, response) {
try {
        var guidInstance = guid.guid();
        var json = {};
        if (!request.headers.sessiontoken || !request.headers.userid || !request.params.id) {
            log.error({
                Function: "Class.Show.ByID, GUID: " + guidInstance
            }, "Session Token or User ID not found Error (Function = Class.Show.ByID)");
            json = {
                error: "Session Token or User Id is not found in request, your Unique Reference # is: " + guidInstance
            }
            return response.status(500).json(json);
        }
        if (request.headers.sessiontoken && request.headers.userid && request.params.id) {
        /* Verify Session Token */
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Class.Show.ByID). GUID: " + guidInstance);
                    json = {
                        error: "Class Show ByID failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    };
                    return response.status(500).json(json);
                }
                var outStatus = "";
                connection.query('SET @outStatus = ""; CALL ' + config.mysql.db.name + '.validateSessionToken(?,?, @outStatus); SELECT @outStatus AS outStatus;', [request.headers.userid, request.headers.sessiontoken], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query Error. Failed To Validate Session Token, User Id: " + request.params.id + " (Function = Class.Show.ByID). GUID: " + guidInstance);
                        json = {
                            error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                        };
                        return response.status(500).json(json);
                    } 
                    else {
                        var sessionValidity = result[2][0].outStatus;
                        if (sessionValidity.indexOf('ERROR') > -1) {
                            log.info({
                                Function: "Class.Show.ByID"
                            }, "Fetched User Details. User Id: " + request.params.id);
                            json = {
                                error: "User Id or Session Token Invalid, please contact administrator if the problem persits. Your Unique Reference is: " + guidInstance
                            };
                            return response.status(500).json(json);
                        }
                        if(sessionValidity.indexOf('SUCCESS') > -1)
                        {
                        	/* Valid Session Token, continue with user search in User Table */
            				request.getConnection(function(connectionError, connection) {
                			if (connectionError != null) {
                    			log.error(connectionError, "Database Connection Error (Function = Class.Show). GUID: " + guidInstance);
                    			json = {
                        			error: "Class Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    			};
                    			return response.status(500).json(json);
                			}
                			connection.query('SELECT class_name, class_section, class_teacher_id, class_captain,school_id FROM `' + config.mysql.db.name + '`.`class` WHERE id = ?',request.params.id, function(queryError, result) {
                    			if (queryError != null) {
                        				log.error(queryError, "Query Error. Failed To Retrieve User Details. User ID: " + request.params.id + " (Function = Class.Show). GUID: " + guidInstance);
                        				json = {
                        				    error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                        				};
                        				return response.status(500).json(json);
                    			} 
                    			else {
                        			if (result[0]) {
                        			    log.info({Function: "Class.Show"}, "Fetched Class Details. User Id: " + request.headers.userid);
						    response.header("Access-Control-Allow-Origin", "*");
                        			    return response.status(200).json(result[0]);
                        			} 
                        			else {
                        		    	log.info({Function: "Class.Show"}, "Class GET failed. GUID: " + guidInstance);
						json = {error: "GET Class Request failed, please try after sometime. If the problem persits contact admin@thakersystems.com, Your Unique Reference ID: " + guidInstance};
                        		    	return response.status(404).json(json);
                        			}
                    			}
                			});
            				});
                        }
                    }
                });
            });	
        }
        else
        {
        	log.error({Function: "Class.Show"}, "A General Error (Function = Class.Show). GUID: " + guidInstance);
			json = {
				error: "A General Error Occurred, please contact the administrator if the problem persists. Your Unique Reference is: " + guidInstance
			};
			return response.status(500).json(json);
        }
    } 
    	catch (error) {
        json = {
            error: "Error: " + error.message + " GUID: " + guidInstance
        };
        log.error(error, "Exception Occurred (Function = User.Show). Your Unique Reference is: " + guidInstance);
        return response.status(500).json(json);
    }
};


exports.index = function(request, response) 
{
    var json = {};
    var guidInstance = guid.guid();
    try 
    {
		if (!request.headers.sessiontoken || !request.headers.userid) 
		{
	            log.error({Function: "Class.Show, GUID: " + guidInstance}, "Session Token or User ID not found Error (Function = Class.Show)");
    	        json = {error: "Session Token or User Id is not found in request, your Unique Reference # is: " + guidInstance}
        	    return response.status(500).json(json);
	    }
	
		var outStatus = "";
        	request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Class.Show). GUID: " + guidInstance);
                    json = {
                        error: "User Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    };
                    return response.status(500).json(json);
                }
		connection.query('SET @outStatus = ""; CALL ' + config.mysql.db.name + '.validateSessionToken(?,?, @outStatus); SELECT @outStatus AS outStatus;', [request.headers.userid, request.headers.sessiontoken], function(queryError, result) 
        {
	        if (queryError != null) 
	        {
        	 	log.error(queryError, "Query Error. Failed To Validate Session Token, User Id: " + request.headers.userid + " (Function = Class.Show). GUID: " + guidInstance);
                json = {error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
                return response.status(500).json(json);
            }
            else 
            {
            	var sessionValidity = result[2][0].outStatus;
                if (sessionValidity.indexOf('ERROR') > -1) 
                {
                	log.info({Function: "Class.Show"}, "Fetched User Details. User Id: " + request.params.userid);
                            json = {error: "User Id or Session Token Invalid, please contact administrator if the problem persits. Your Unique Reference is: " + guidInstance};
                            return response.status(500).json(json);
  				}
                if(sessionValidity.indexOf('SUCCESS') > -1)
                	{
        				request.getConnection(function(connectionError, connection) 
						{
            				if (connectionError != null) 
							{
                				log.error(connectionError, "Database Connection Error (Function = Class.Show. GUID: )" + guidInstance);
                				json = {error: "User Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
                				return response.status(500).json(json);
            				}
           					connection.query('SELECT * FROM `' + config.mysql.db.name + '`.`viewAllClass`', function (queryError, result) 
           					{
                				if (queryError != null) 
								{
	                		    	log.error(queryError, "Query Error. Failed To Retrieve User Details." + " (Function = Class.Show). GUID: " + guidInstance);
    	            		    	json ={error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
        	            			return response.status(500).json(json);
            	    			}
                				else
                				{
                    				return response.status(200).json({data: result});
                				}
            				});
						});
					}
				else
				{
					log.error(queryError, "SessionToken Error. Failed To Retrieve User Details." + " (Function = Class.Show). GUID: " + guidInstance);
                    json ={error: "Requested Action Failed. Invalid Session Token. Your Unique Reference is: " + guidInstance};
					return response.status(500).json(json);
				}
			}
		});
        });        	
    } catch (error) 
    {
        json = {error: "Error: " + error.message + "GUID: " + guidInstance};
        log.error(error, "Exception Occurred (Function = User.Show). GUID: " + guidInstance);
        return response.status(500).json(json);
    }
};
