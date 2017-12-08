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
 * THis class is used to send email using mandrill.
 * 
 *************************************************************************/

var mandrill = require('mandrill-api/mandrill');
var config = require('./config');
var log = require('./log');

exports.sendEmail = function(toAddress, subject, text) {

    if(config.email.enabled) {
        var mandrill_client = new mandrill.Mandrill(config.email.mandrill.api_key);

        var message = {
            "text": text,
            "subject": subject,
            "from_email": config.email.mandrill.fromEmail,
            "from_name": config.email.mandrill.fromName,
            "to": [{
                "email": toAddress,
                "type": "to"
            }]
        };
        var async = false;
        mandrill_client.messages.send({"message": message, "async": async}, function(result) {
            console.log(result);
            /*
             [{
             "email": "recipient.email@example.com",
             "status": "sent",
             "reject_reason": "hard-bounce",
             "_id": "abc123abc123abc123abc123abc123"
             }]
             */
        }, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });
    } else {
        log.info({Function: "Email.SendEmail"}, "Email is disabled. Please enable email in the configurations.");
    }
};

