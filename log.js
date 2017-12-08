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
 * A generic logging mechanism that logs using bunyan.
 *
 * NOTE: this code requires the bunyan npm module.
 *       npm install bunyan --save-dev
 * 
 *************************************************************************/

var config = require('./config');
var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var streams = [];
var sourceView = false;

if (config.enableConsole) {
    streams = [
        {
            type: 'rotating-file',
            path: __dirname + '/log/nsm.log', // File path where to track logs
            period: '1d',   // daily rotation
            count: 7        // keep 3 back copies
        },
        {
            stream: prettyStdOut
        }
    ];
    sourceView = true;
} else {
    streams = [
        {
            type: 'rotating-file',
            path: __dirname + '/log/sample.log', // File path where to track logs
            period: '1d',   // daily rotation
            count: 7        // keep 3 back copies
        }
    ];
    sourceView = false;
}

var log = bunyan.createLogger({
    name: config.name,
    streams: streams,
    src: sourceView
});

module.exports = log;