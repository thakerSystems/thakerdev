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
	var guidInstance = guid.guid();
        var json = "";
        if (request.body.schoolName == null)
        {
            log.info({Function: "School.Create"}, "School Create Request. Details: 'School Name' is empty" + " Your Unique Reference is: " + guidInstance);
            json = {
                    error: "Leave Approve Request failed. School Name is not found in the request." + " Your Unique Reference is: " + guidInstance
                };
            return response.sendStatus(401).json(json);
        }

        if (request.body.accessType == null)
        {
            log.info({Function: "School.Create"}, "School Create Request. Details: 'Access Type' is empty" + " Your Unique Reference is: " + guidInstance);
            json = {
                    error: "School Create Request failed. User Id is not found in the request." + " Your Unique Reference is: " + guidInstance
                };
            return response.sendStatus(401).json(json);
        }

        request.getConnection(function(connectionError, connection)
        {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Approve School.Create)"  + " Your Unique Reference is: " + guidInstance);
                json = {
                    error: "School Create Request failed. Database could not be reached." + " Your Unique Reference is: " + guidInstance
                };
                return response.status(500).json(json);
            }
            var outSchoolId = "";
            var outStatus = "";
            connection.query('SET @outSchoolId = ""; SET @outStatus = ""; CALL schoolSignUpProc(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@outSchoolId, @outStatus); SELECT @outSchoolId as outSchoolId; SELECT @outStatus as outStatus;', [request.body.schoolName, request.body.schoolBoard, request.body.schoolStream, request.body.schoolAffiliationCountry, request.body.schoolLatLong, request.body.address1, request.body.address2, request.body.schoolLocation, request.body.Landmark, request.body.City, request.body.Province, request.body.Country, request.body.ZipCode, request.body.IsdCode, request.body.PhoneNumber1, request.body.PhoneNumber2, request.body.PhoneNumber3, request.body.FaxNumber1, request.body.Email1, request.body.Email2, request.body.Email3], function (queryError, schoolCreateResponse)
                {
                    if (queryError != null)
                    {
                        log.error(queryError, "Query Error. School Create Request failed. School Name: " + request.body.schoolName + " (Function = School.Create)" + " Your Unique Reference is: " + guidInstance);
                        json =
                            {
                                error: "School Create Request failed. Please contact administrator if the problem persists :: admin@thakersystems.com." + " Your Unique Reference is: " + guidInstance
                            };
                        return response.status(500).json(json);
                    }
					else if(schoolCreateResponse[4][0].outStatus != 'Success')
					{
						json = 
						{
							error: "School Create Request failed. Details: Error in Request, if the problem persits contact administrator :: admin@thersystems.com" + " Your Unique Reference is: " + guidInstance
						};
						log.info({Function: "School.Create"}, "School Create Request failed. Details: Invalid request or there is an issue with your request, please contact administrator if the problem persits :: admin@thakersystems.com." + " Your Unique Reference is: " + guidInstance);
                        return response.status(401).json(json);
		        	}
					else
		    		{
						json = 
						{
							success: schoolCreateResponse[3][0].outSchoolId + " School Created Successfully" + " Your Unique Reference is: " + guidInstance
						};
						log.info({Function: "School.Create"}, "School Create Request Success." + " Your Unique Reference is: " + guidInstance);
						return response.status(200).json(json);
  		    		}
                });
        });
    }
catch (error) {
        json = {
            error: "Error: " + error.message  + " Your Unique Reference is: " + guidInstance
        };
        log.error(error, "Exception Occurred (Function = School.Create)" + " Your Unique Reference is: " + guidInstance);
        return response.status(500).json(json);
    }
};


exports.show = function(request, response) {
try {
        var guidInstance = guid.guid();
        var json = {};
        if (!request.headers.sessiontoken || !request.headers.userid || !request.params.id) {
            log.error({
                Function: "School.Show.ByID, GUID: " + guidInstance
            }, "Session Token or User ID not found Error (Function = School.Show.ByID)");
            json = {
                error: "Session Token or User Id is not found in request, your Unique Reference # is: " + guidInstance
            }
            return response.status(500).json(json);
        }
        if (request.headers.sessiontoken && request.headers.userid && request.params.id) {
        /* Verify Session Token */
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = School.Show.ByID). GUID: " + guidInstance);
                    json = {
                        error: "School Show ByID failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    };
                    return response.status(500).json(json);
                }
                var outStatus = "";
                connection.query('SET @outStatus = ""; CALL ' + config.mysql.db.name + '.validateSessionToken(?,?, @outStatus); SELECT @outStatus AS outStatus;', [request.headers.userid, request.headers.sessiontoken], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query Error. Failed To Validate Session Token, User Id: " + request.params.id + " (Function = School.Show.ByID). GUID: " + guidInstance);
                        json = {
                            error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                        };
                        return response.status(500).json(json);
                    } 
                    else {
                        var sessionValidity = result[2][0].outStatus;
                        if (sessionValidity.indexOf('ERROR') > -1) {
                            log.info({
                                Function: "School.Show.ByID"
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
                    			log.error(connectionError, "Database Connection Error (Function = School.Show). GUID: " + guidInstance);
                    			json = {
                        			error: "School Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    			};
                    			return response.status(500).json(json);
                			}
                			connection.query('SELECT * FROM `' + config.mysql.db.name + '`.`school` WHERE id = ?',request.params.id, function(queryError, result) {
                    			if (queryError != null) {
                        				log.error(queryError, "Query Error. Failed To Retrieve User Details. User ID: " + request.params.id + " (Function = School.Show). GUID: " + guidInstance);
                        				json = {
                        				    error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                        				};
                        				return response.status(500).json(json);
                    			} 
                    			else {
                        			if (result[0]) {
                        			    log.info({Function: "School.Show"}, "Fetched School Details. User Id: " + request.headers.userid);
						    response.header("Access-Control-Allow-Origin", "*");
						    json = { data: result[0] };
                        			    return response.status(200).json(json);
                        			} 
                        			else {
                        		    	log.info({Function: "School.Show"}, "School GET By ID failed. GUID: " + guidInstance);
						json = {error: "GET School By ID Request failed, please try after sometime. If the problem persits contact admin@thakersystems.com, Your Unique Reference ID: " + guidInstance};
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
        	log.error({Function: "School.Show"}, "A General Error (Function = School.Show). GUID: " + guidInstance);
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
        log.error(error, "Exception Occurred (Function = School.Show). Your Unique Reference is: " + guidInstance);
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
	            log.error({Function: "School.Show, GUID: " + guidInstance}, "Session Token or User ID not found Error (Function = School.Show)");
    	        json = {error: "Session Token or User Id is not found in request, your Unique Reference # is: " + guidInstance}
        	    return response.status(500).json(json);
	    }
	
		var outStatus = "";
        	request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = School.Show). GUID: " + guidInstance);
                    json = {
                        error: "School Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance
                    };
                    return response.status(500).json(json);
                }
		connection.query('SET @outStatus = ""; CALL ' + config.mysql.db.name + '.validateSessionToken(?,?, @outStatus); SELECT @outStatus AS outStatus;', [request.headers.userid, request.headers.sessiontoken], function(queryError, result) 
        {
	        if (queryError != null) 
	        {
        	 	log.error(queryError, "Query Error. Failed To Validate Session Token, User Id: " + request.headers.userid + " (Function = School.Show). GUID: " + guidInstance);
                json = {error: "Requested Action Failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
                return response.status(500).json(json);
            }
            else 
            {
            	var sessionValidity = result[2][0].outStatus;
                if (sessionValidity.indexOf('ERROR') > -1) 
                {
                	log.info({Function: "School.Show"}, "Fetched User Details. User Id: " + request.params.userid);
                            json = {error: "User Id or Session Token Invalid, please contact administrator if the problem persits. Your Unique Reference is: " + guidInstance};
                            return response.status(500).json(json);
  				}
                if(sessionValidity.indexOf('SUCCESS') > -1)
                	{
        				request.getConnection(function(connectionError, connection) 
						{
            				if (connectionError != null) 
							{
                				log.error(connectionError, "Database Connection Error (Function = School.Show. GUID: )" + guidInstance);
                				json = {error: "School Show failed. Database could not be reached. Your Unique Reference is: " + guidInstance};
                				return response.status(500).json(json);
            				}
           					connection.query('SELECT * FROM `' + config.mysql.db.name + '`.`viewAllSchool`', function (queryError, result) 
           					{
                				if (queryError != null) 
								{
	                		    	log.error(queryError, "Query Error. Failed To Retrieve User Details." + " (Function = School.Show). GUID: " + guidInstance);
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
					log.error(queryError, "SessionToken Error. Failed To Retrieve User Details." + " (Function = School.Show). GUID: " + guidInstance);
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


