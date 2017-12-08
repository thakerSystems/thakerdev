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
 * This file contains the resource definitions for the service module
 * 
 *************************************************************************/

module.exports = {
    resources: [
        {
            name: 'user',
            methods: require('./user'),
            auth: 'bypass'
        }, {
            name: 'login',
            methods: require('./login'),
            auth: 'bypass'
        },{
            name: 'logout',
            methods: require('./logout'),
            auth: 'bypass'
        }, {
            name: 'verification',
            methods: require('./verification'),
            auth: 'bypass'
        }
    ]
};