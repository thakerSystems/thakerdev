var crypto = require('crypto');
var config = require('./../../../config');
var guid = require('./../../../guid');
var log = require('./../../../log');
var AWS = require('aws-sdk');
var awsConfig = new AWS.Config({accessKeyId: 'AKIAI2WOL6WXIUKLP5VA', secretAccessKey: '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', region: 'us-east-2'});
s3 = new AWS.S3(awsConfig, {apiVersion: '2006-03-01'});

exports.create = function(request, response) 
{
var json = {};
var guidInstance = guid.guid();
console.log("GUID: " + JSON.stringify(guidInstance));
try
{
  	if (!request.files)
	{
		log.info({Function: "Upload.Create" + "GUID: " + guidInstance}, "Upload request failed, no files attached to be uploaded.IP Address: " + request.connection.remoteAddress);
		return response.status(400).send('No files attached to be uploaded.');
	}

	else
	{
		log.info({Function: "Upload.Create" + "GUID: " + guidInstance}, "Upload request logged, IP Address: " + request.connection.remoteAddress);
		var file = request.files.file;
		var uploadParams = {Bucket: 'thakerdevfiles', Key: '', Body: '', ContentEncoding: 'base64', ACL: 'public-read'};
		var fs = require('fs');
		var date = new Date();
		var dateTime = date.getDate() + "/"
                + (date.getMonth()+1)  + "/" 
                + date.getFullYear() + "_"  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
		var fileName = file.name.split(" ").join("_");
		var filePath = config.fileUploadFolder.folderLocation + '/';
		var fileFullPath = filePath.toString() + fileName.toString();
		console.log("FilePath: " + fileFullPath);
		log.info({Function: "Upload.Create" + "GUID: " + guidInstance}, "File Path : " + JSON.stringify(fileFullPath));
		file.mv(fileFullPath, function(err) {
    		if (err)
			{
				log.error({Function: "Upload.Create" + "GUID: " + guidInstance}, err);
				json = {"ERROR": "A general error occurred, please contact the administrator with the ID: " + guidInstance};
				return response.status(500).end(json);
  			}
		});

		var fileStream = fs.createReadStream(fileFullPath);
		fileStream.on('error', function(err) 
		{
			json = {"ERROR": "A general error occurred, please contact the administrator with the ID: " + guidInstance};
			log.error({Function: "Upload.Create" + "GUID: " + guidInstance}, "File stream error, Description: " + err);
			return response.status(500).send(json);
		});
		uploadParams.Body = fileStream;
		uploadParams.Key = fileName;
		// call S3 to retrieve upload file to specified bucket
		s3.putObject(uploadParams, function (err, data) 
		{
			if (err) 
			{
				json = {"ERROR": "A general error occurred, please contact the administrator with the ID: " + guidInstance};
	                        log.error({Function: "Upload.Create" + "GUID: " + guidInstance}, "S3 Bucket upload error, Description: " + err);
        	                return response.status(500).send(json);
  			} 
			else if (data != null) 
			{
				console.log("Data: " + JSON.stringify(data));
				log.info({Function: "Upload.Create" + "GUID: " + guidInstance}, "Upload Successful, file path: " + JSON.stringify(data));
				json = data;
				json.url = "https://s3.us-east-2.amazonaws.com/thakerdevfiles/" + fileName;
				fs.unlinkSync(fileFullPath);
				return response.status(200).send(json);
  			}
		});
	}
}
catch (error) 
{
        json = 
	{
            error: "Error: A General error occurred, please contact the adminstrator with the ID: " + guidInstance
        };
	log.error({Function: "Upload.Create" + "GUID: " + guidInstance}, "A General error occurred, Description: " + error);
        return response.status(500).json(json);
}
};

