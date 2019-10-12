import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable, Subject } from 'rxjs';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({
  accessKeyId: '',
  secretAccessKey: ''
});

const s3 = new AWS.S3({ region: 'us-east-2' });

@Injectable()
export class S3Service {
  constructor() { }

  public uploadS3File(file, metadata, progressCallback: (progress: number) => void): Observable<any> {
    
    const result = new Subject();

    const partner = metadata.partner.split(' ').join('');

    const params = {
      Body: file,
      Bucket: 'mission-life-youtube-upload-master',
      Key: `${partner}/${file.name}`,
      Metadata: {
        'person-metadata': JSON.stringify(metadata)
      },
      ContentType: file.type
    };

    s3.putObject(params).on('httpUploadProgress', progress => {
      progressCallback(Math.round(progress.loaded / progress.total * 100));
    }).send((err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        result.next();
      }
    });

    return result;
  }
}
