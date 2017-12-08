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
            log.info({Function: "Subject.Create. GUID: " + guidInstance}, "Subject.Create Request. Details: 'User Id' is empty");
            json = {
                    error: "Subject Create Request failed. User Id is not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }

	if (request.body.sessionToken == null || request.body.sessionToken.length < 1)
        {
            log.info({Function: "Subject.Create. GUID: " + guidInstance}, "Subject.Create Request. Details: 'session Token' is empty");
            json = {
                    error: "Subject Create Request failed. Session Token is not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }

        if (request.body.accessType == null)
        {
            log.info({Function: "Subject.Create. GUID: " + guidInstance}, "Subject.Create Request. Details: 'Access Type' is empty");
            json = {
                    error: "Subject Create Request failed. Access Type is not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }

	if (!request.body.subjectName || !request.body.subjectDescription || !request.body.schoolId || !request.body.subjectTeacherId)
        {
            log.info({Function: "Subject.Create. GUID: " + guidInstance}, "Subject.Create Request Failed. Details: 'Mandatory Parameters are not found' with the request");
            json = {
                    error: "Subject Create Request failed. Mandatory Parameters not found in the request. Your Unique Reference is: " + guidInstance
                };
            return response.status(401).json(json);
        }
        request.getConnection(function(connectionError, connection)
        {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Subject.Create). GUID: " + guidInstance);
                json = {
                    error: "Subject Create Request failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                };
                return response.status(500).json(json);
            }
            var outStatus = "";
            connection.query('SET @outStatus = ""; CALL createSubject(?,?,?,?,?,?,?, @outStatus); SELECT @outStatus as outStatus;', [request.body.userid, request.body.sessiontoken, request.body.subjectName, request.body.subjectDescription, request.body.subjectTeacherId, request.body.subjectAssociatedClass, request.body.schoolId], function (queryError, classCreateResponse)
                {
			var subjectResponse = JSON.parse(JSON.stringify(classCreateResponse));
                    if (queryError != null)
                    {
                        log.error(queryError, "Query Error. Subject Create Request failed. Subject.Name: " + request.body.ClassName + " (Function = Subject.Create). GUID: " + guidInstance);
                        json =
                            {
                                error: "Subject Create Request failed. Please contact administrator if the problem persists :: admin@thakersystems.com. Your Unique Reference is: " + guidInstance
                            };
                        return response.status(500).json(json);
                    }
		    else if(subjectResponse[2][0].outStatus)
			{
		   		if(subjectResponse[2][0].outStatus != 'Success')
				{
				json = 
				{
					error: "Subject Create Request failed. Details: Error in Request, if the problem persits contact administrator :: admin@thersystems.com. Your Unique Reference is: " + guidInstance
				};
			log.info({Function: "Subject.Create"}, "Subject.Create Request failed. Details: Invalid request or there is an issue with your request, please contact administrator if the problem persits :: admin@thakersystems.com. GUID: " + guidInstance);
                        return response.status(401).json(json);
		        	}
				else
		    		{
					json = 
					{
						success: "Subject Created Successfully. Your Unique Reference is: " + guidInstance
					};
					log.info({Function: "Subject.Create"}, "Subject.Create Request Success. GUID: " + guidInstance);
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
        log.error(error, "Exception Occurred (Function = Subject.Create). GUID: " + guidInstance);
        return response.status(500).json(json);
    }
};

/*Subject Show [GET] */

exports.show = function(request, response) {
try {
        var guidInstance = guid.guid();
        var json = {};
        if (!request.headers.sessiontoken || !request.headers.userid || !request.params.id) {
            log.error({
                Function: "Subject.Show.ByID, GUID: " + guidInstance
            }, "Session Token or User ID not found Error (Function = Subject.Show.ByID)");
            json = {
                error: "Session Token or User Id is not found in request, your Unique Reference # is: " + guidInstance
            }
            return response.status(500).json(json);
        }
        if (request.headers.sessiontoken && request.headers.userid && request.params.id) {
        /* Verify Session Token */
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Subject.Show.ByID). GUID: " + guidInstance);
                    json = {
                        error: "Subject Show ByID failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    };
                    return response.status(500).json(json);
                }
                var outStatus = "";
                connection.query('SET @outStatus = ""; CALL ' + config.mysql.db.name + '.validateSessionToken(?,?, @outStatus); SELECT @outStatus AS outStatus;', [request.headers.userid, request.headers.sessiontoken], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query Error. Failed To Validate Session Token, User Id: " + request.params.id + " (Function = Subject.Show.ByID). GUID: " + guidInstance);
                        json = {
                            error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                        };
                        return response.status(500).json(json);
                    } 
                    else {
                        var sessionValidity = result[2][0].outStatus;
                        if (sessionValidity.indexOf('ERROR') > -1) {
                            log.info({
                                Function: "Subject.Show.ByID"
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
                    			log.error(connectionError, "Database Connection Error (Function = Subject.Show). GUID: " + guidInstance);
                    			json = {
                        			error: "Subject Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    			};
                    			return response.status(500).json(json);
                			}
                			connection.query('SELECT subject_name, subject_description, subject_teacher_id, subject_associated_class,school_id FROM `' + config.mysql.db.name + '`.`subject` WHERE id = ?',request.params.id, function(queryError, result) {
                    			if (queryError != null) {
                        				log.error(queryError, "Query Error. Failed To Retrieve User Details. User ID: " + request.params.id + " (Function = Subject.Show). GUID: " + guidInstance);
                        				json = {
                        				    error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                        				};
                        				return response.status(500).json(json);
                    			} 
                    			else {
                        			if (result[0]) {
                        			    log.info({Function: "Subject.Show"}, "Fetched Subject.Details. User Id: " + request.headers.userid);
						    response.header("Access-Control-Allow-Origin", "*");
                        			    return response.status(200).json(result[0]);
                        			} 
                        			else {
                        		    	log.info({Function: "Subject.Show"}, "Subject.GET failed. GUID: " + guidInstance);
						json = {error: "GET Subject Request failed, please try after sometime. If the problem persits contact admin@thakersystems.com, Your Unique Reference ID: " + guidInstance};
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
        	log.error({Function: "Subject.Show"}, "A General Error (Function = Subject.Show). GUID: " + guidInstance);
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
	            log.error({Function: "Subject.Show, GUID: " + guidInstance}, "Session Token or User ID not found Error (Function = Subject.Show)");
    	        json = {error: "Session Token or User Id is not found in request, your Unique Reference # is: " + guidInstance}
        	    return response.status(500).json(json);
	    }
	
		var outStatus = "";
        	request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Subject.Show). GUID: " + guidInstance);
                    json = {
                        error: "Subject Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    };
                    return response.status(500).json(json);
                }
		connection.query('SET @outStatus = ""; CALL ' + config.mysql.db.name + '.validateSessionToken(?,?, @outStatus); SELECT @outStatus AS outStatus;', [request.headers.userid, request.headers.sessiontoken], function(queryError, result) 
        {
	        if (queryError != null) 
	        {
        	 	log.error(queryError, "Query Error. Failed To Validate Session Token, User Id: " + request.headers.userid + " (Function = Subject.Show). GUID: " + guidInstance);
                json = {error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
                return response.status(500).json(json);
            }
            else 
            {
            	var sessionValidity = result[2][0].outStatus;
                if (sessionValidity.indexOf('ERROR') > -1) 
                {
                	log.info({Function: "Subject.Show"}, "Fetched User Details. User Id: " + request.params.userid);
                            json = {error: "User Id or Session Token Invalid, please contact administrator if the problem persits. Your Unique Reference is: " + guidInstance};
                            return response.status(500).json(json);
  				}
                if(sessionValidity.indexOf('SUCCESS') > -1)
                	{
        				request.getConnection(function(connectionError, connection) 
						{
            				if (connectionError != null) 
							{
                				log.error(connectionError, "Database Connection Error (Function = Subject.Show. GUID: )" + guidInstance);
                				json = {error: "User Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
                				return response.status(500).json(json);
            				}
           					connection.query('SELECT * FROM `' + config.mysql.db.name + '`.`viewAllSubject`', function (queryError, result) 
           					{
                				if (queryError != null) 
								{
	                		    	log.error(queryError, "Query Error. Failed To Retrieve User Details." + " (Function = Subject.Show). GUID: " + guidInstance);
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
					log.error(queryError, "SessionToken Error. Failed To Retrieve User Details." + " (Function = Subject.Show). GUID: " + guidInstance);
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
