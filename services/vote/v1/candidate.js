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
 * This file contains the logic for the user service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');


exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId != null) && (request.body.electionId != null) && (request.body.userName != null) && (request.body.nickName != null) && (request.body.about != null) && (request.body.manifesto != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Candidate.Create");
                    json = {
                        error: "Association Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT is_accepted FROM '+ config.mysql.db.name +'.candidate  WHERE user_id = ?', request.body.userId, function(queryError, candidates) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Candidate.Create)");
                        json  = {
                            error: "Query error. Failed to create new candidate."
                        };
                        return response.status(500).json(json);
                    }
                    if(candidates) {
                        if(candidates[0].is_accepted == 1) {
                            json = {
                                message: "This user is already a candidate."
                            };
                            log.info({Function: "Candidate.Create"}, "User is already a candidate.");
                            return response.status(501).json(json);
                        }
                        else if(candidates[0].is_accepted == 0) {
                            json = {
                                message: "This user is already a nominated and is being scrutinized."
                            };
                            log.info({Function: "Candidate.Create"}, "User under scrutiny.");
                            return response.status(501).json(json);
                        }
                    }
                    else if(!candidates) {
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.candidate (user_id, election_id, name, nick_name, about, manifesto) VALUES (?, ?, ?, ?, ?, ?)', [request.body.userId, request.body.electionId, request.body.userName, request.body.nickName, request.body.about, request.body.manifesto], function(queryError, entry) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Candidate.Create)");
                                json  = {
                                    error: "Query error. Failed to create new candidate."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                var candidateId = entry.insertId;
                                json = {
                                    CandidateID : candidateId
                                };
                                log.info({Function: "Candidate.Create"}, "Nomination filed successfully and awaits approval.");
                                return response.status(200).json(json);
                            }
                        });
                    }
                });
            });
        }
        else {
            json = {
                error: "Parameters - userID,electionId,userName,nickName,about,manifesto  should not be empty!"
            };
            log.error({Function: "Candidate.Create"}, "Parameters are empty.");
            return status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Association.Create)");
        return response.status(500).json(json);
    }
};

exports.update = function(request, response) {
    var json;
    try{
        if(request.body.electionId != null) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Candidate.Create");
                    json = {
                        error: "Association Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', request.params.id, function(queryError, result) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Candidate.Create)");
                        json  = {
                            error: "Query error. Failed to create new candidate."
                        };
                        return response.status(500).json(json);
                    }
                    if(result[0]) {
                        var jsonData= {};
                        if(request.body.userName != null) {
                            jsonData['name'] = request.body.userName
                        }
                        if(request.body.nickName != null) {
                            jsonData['name'] = request.body.nickName
                        }
                        if(request.body.about != null) {
                            jsonData['name'] = request.body.about
                        }
                        if(request.body.manifesto != null) {
                            jsonData['name'] = request.body.manifesto
                        }

                        connection.query('UPDATE '+ config.mysql.db.name +'.candidate SET ? WHERE id = ?', [jsonData, request.params.id], function(queryError, entry) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Candidate.Update)");
                                json  = {
                                    error: "Query error. Failed to create new candidate."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', request.params.id, function(queryError, detail) {
                                    if(queryError != null) {
                                        log.error(queryError, "Query error. (Function: Candidate.Update)");
                                        json  = {
                                            error: "Query error. Failed to create new candidate."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    log.info({Function: "Candidate.Update"}, "Candidate details updated.");
                                    return response.status(200).json(detail[0]);
                                });
                            }
                        });
                    }
                    else {
                        json = {
                            message: "This user is not a candidate for this election."
                        };
                        log.info({Function: "Candidate.Update"}, "Candidate not found. Candidate ID: " + request.body.electionId);
                        return response.status(404).json(json);
                    }
                });
            });
        }
        else {
            json = {
                error: "Parameters - electionId & userName/nickName/about/manifesto  are required!"
            };
            log.error({Function: "Candidate.Update"}, "Parameters required.");
            return status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Association.Update)");
        return response.status(500).json(json);
    }
};


exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Candidate.Show");
                json = {
                    error: "Candidate Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', request.params.id, function(queryError, nominee) {
                if(queryError != null) {
                    log.error(queryError, "Query error. (Function: Candidate.Show)");
                    json  = {
                        error: "Query error. Failed to show candidate details."
                    };
                    return response.status(500).json(json);
                }
                else if(nominee) {
                    log.info({Function: "Candidate.Show"}, "Fetched Candidate Details.");
                    return response.status(200).json(nominee[0]);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Candidate.Show)");
        return response.status(500).json(json);
    }
};


exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Candidate.Delete");
                json = {
                    error: "Candidate delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('DELETE FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', request.params.id, function(queryError, nominee) {
                if(queryError != null) {
                    log.error(queryError, "Query error. (Function: Candidate.Delete)");
                    json  = {
                        error: "Query error. Failed to delete candidate."
                    };
                    return response.status(500).json(json);
                }
                else if(nominee) {
                    log.info({Function: "Candidate.Show"}, "Fetched Candidate Details.");
                    return response.status(200).json(nominee[0]);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Candidate.Delete)");
        return response.status(500).json(json);
    }
};


exports.index = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Candidate.Index");
                json = {
                    error: "Candidate listing failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT name AS candidateName, nick_name AS nickName, about, manifesto FROM '+ config.mysql.db.name +'.candidate WHERE election_id = ?', request.body.electionId, function(queryError, result) {
                if(queryError != null) {
                    log.error(queryError, "Query error. (Function: Candidate.Index)");
                    json  = {
                        error: "Query error. Failed to list candidates."
                    };
                    return response.status(500).json(json);
                }

            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Candidate.Index)");
        return response.status(500).json(json);
    }
};