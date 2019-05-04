import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as AWS from 'aws-sdk';

@Injectable()
export class AWSService {
  constructor(private http: HttpClient) { }

  public async uploadS3File(file, metadata) {
      console.log('in upload S3 file');
      AWS.config.update({
        accessKeyId: 'XX',
        secretAccessKey: 'X'
    });

      const s3 = new AWS.S3();
      const params = {
        Body: file,
        Bucket: 'mission-life-videos',
        Key: file.name,
        Metadata: {
          'person-metadata': JSON.stringify(metadata)
        },
        ContentType: file.type
       };
      s3.putObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
          console.log(data);           // successful response
        }
      });
      return null;
  }
}
