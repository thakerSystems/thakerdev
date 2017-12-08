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
 * This class is used to send push notification using node-gcm.
 *
 *************************************************************************/

var config = require('./config');
var log = require('./log');
var gcm = require('node-gcm');

exports.sendAndroidPush = function(registrationIds, messageToBeSent) {

    if(config.pushNotification.enabled) {
        // Set up the sender with you API key
        var sender = new gcm.Sender(config.pushNotification.android.api_key);

        // Create a message
        var message = new gcm.Message();
        message.addNotification({
            title: 'nooshow Update',
            body: messageToBeSent,
            icon: 'ic_launcher'
        });

        // Send the message
        sender.send(message, registrationIds, 4, function (err, result) {
            console.log(result);
        });
    } else {
        log.info({Function: "Push.SendAndroidPush"}, "Push Notification is disabled. Please enable push notification in the configurations.");
    }
};