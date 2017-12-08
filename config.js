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
 * Main config file.
 * 
 *************************************************************************/

var cafile, cafiles, config, fs;

fs = require('fs');

process.env.NODE_ENV = 'production';

config = {
    name: 'ThakerSystemsDevAPI',
    version: '0.1.0',
    hashIterations: 1000,
    emailFilterRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    passwordFilterRegex: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
    enableConsole: true,
    http: {
        enabled: true,
        port: 3000
    },
    https: {
        enabled: false,
        port: 443,
        options: {
            key: '',
            cert: '',
            ca: ''
        }
    },
    mysql: {
        server: {
            host: 'thakerdevdb.czpe9bzf9bhl.us-east-2.rds.amazonaws.com',
            port: 3306
        },
        db: {
            name: 'thakerdevdb',
            username: 'dba',
            password: 'Thaker123'
        }
    },
    pushNotification: {
        enabled: true,
        android: {
            api_key: 'AIzaSyDsF2yFanZD302BOPk76a1EUCn1qgPqvH4'
        },
        ios: {

        },
        message: 'Hi! You have a new poll to answer.'
    },
    email: {
        enabled: false,
        mandrill: {
            api_key: '',
            fromEmail: 'support@thakersystems.com',
            fromName: 'Thaker Support'
        }
    },
    sms: {
        enabled: true,
        adithya: {
            host: 'thakersystems.com',
            username: 'thakeradmin',
            password: 'IqEWSAOu',
            senderId: 'thaker',
            message: 'thaker: You have a poll to answer. Install nooshow to enjoy unlimited polling!'
        }
    },
    userVerification: {
        enabled: true
    },
    poll: {
        expiresAfter: 28
    },
    vote: {
        allowChange: 2
    },
    awsS3: {
	accessKeyId: 'AKIAI2WOL6WXIUKLP5VA',
	secretAccessKey: '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',
	region: 'us-east-2'
    },
    fileUploadFolder: {
	folderLocation: '/home/ThakerAPI/api/files'
    }
};

if (process.env.NODE_ENV == 'production') {

    // Production db setup
    //config.mysql.server.host = 'nooshowdb.cloudapp.net';
    //config.mysql.db.username = 'dev';
    //config.mysql.db.password = 'dev@123';
    //config.mysql.server.port = 3306;
    //config.mysql.db.name = 'nooshow';
    config.mysql.server.host = 'thakerdevdb.czpe9bzf9bhl.us-east-2.rds.amazonaws.com';
    config.mysql.db.username = 'dba';
    config.mysql.db.password = 'Thaker123';
    config.mysql.server.port = 3306;
    config.mysql.db.name = 'thakerdevdb';
    // production http/https setup
    config.http.port = 3000;
    config.https.enabled = false;
    config.https.port = 443;

    // Production ssl support
    //cafiles = ['/web/cert/EssentialSSLCA_2.crt', '/web/cert/ComodoUTNSGCCA.crt', '/web/cert/UTNAddTrustSGCCA.crt', '/web/cert/AddTrustExternalCARoot.crt'];
    //config.http.port = 80;
    //config.https.options.key = fs.readFileSync('/web/cert/star_re3tech_com.key');
    //config.https.options.cert = fs.readFileSync('/web/cert/star_re3tech_com.crt');
    //config.https.options.ca = (function() {
    //    var _i, _len, _results;
    //    _results = [];
    //    for (_i = 0, _len = cafiles.length; _i < _len; _i++) {
    //        cafile = cafiles[_i];
    //        _results.push(fs.readFileSync(cafile));
    //    }
    //    return _results;
    //})();

} else {
    // Development environment setup
    config.mysql.server.host = 'thakerdevdb.czpe9bzf9bhl.us-east-2.rds.amazonaws.com';
    config.mysql.db.username = 'dba';
    config.mysql.db.password = 'Thaker123';
    config.mysql.server.port = 3306;
    config.mysql.db.name = 'thakerdevdb';
    config.https.enabled = false;
}

module.exports = config;
