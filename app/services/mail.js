import AWS from 'aws-sdk';
import config from '~/config';

AWS.config.update({
    accessKeyId: config.AWSAccessKeyId,
    secretAccessKey: config.AWSSecretKey,
    region: config.AWSRegion,
  });

let mail = new AWS.SES();

export default mail;