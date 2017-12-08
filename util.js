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
 * This class is a util class.
 *
 *************************************************************************/

var getCode = require('lodash');
var data = require('world-countries');

exports.getCountryCode = function(country) {
    var countryData = getCode.find(data, function(entry) {
        return(entry.name.common == country)
    });

    if(countryData == null)
        return "Undefined";
    else
        return countryData.callingCode;
};