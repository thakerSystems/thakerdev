/*************************************************************************
 * 
 * COPYRIGHT NOTICE
 * __________________
 * 
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Jaffar Meeran
 * All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains the property 
 * of Jaffar Meeran. Unauthorised copying of this  file, via any medium is
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
 * This class is used to send sms using nexmo and smslane.
 * 
 *************************************************************************/

var config = require('./config');
var log = require('./log');
var http = require('http');

exports.sendSMS = function(recipientList, text) {

    if(config.sms.enabled) {
        for (var i=0; i<recipientList.length; i++) {
            var content = encodeURIComponent(text);
            var options = {
                hostname: config.sms.adithya.host,
                method: "GET",
                path: '/adithya/Api/?username='+ config.sms.adithya.username +'&password='+ config.sms.adithya.password + '&senderid=' + config.sms.adithya.senderId + '&message=' + content + '&msgtype=normal&mobileno=' + recipientList[i],
            };
            var req = http.request(options, function(res) {
                res.on('data', function(chunk) {
                    log.info({Function: "SMS.sendSMS"}, "SMS sent successfully. Details: " + chunk);
                });
            });
            req.end();
            req.on('error', function(error) {
                log.error(error, "Sms Error. Failed to send sms." + "(Function= SMS.sendSMS)");
            });
        }
    } else {
        log.info({Function: "SMS.SendSMS"}, "SMS is disabled. Please enable sms in the configurations.");
    }

};

