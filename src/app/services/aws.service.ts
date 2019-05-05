import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as AWS from 'aws-sdk';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AWSService {
  constructor(private http: HttpClient) { }

  public uploadS3File(file, metadata, progressCallback: (progress: number) => void): Observable<any> {
      console.log('in upload S3 file');
      AWS.config.update({
        accessKeyId: 'AKIATSRTY4JEELYVDAD4',
        secretAccessKey: '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'
    });

      const result = new Subject();

      const s3 = new AWS.S3({ region: 'us-east-2' });
      const params = {
        Body: file,
        Bucket: 'mission-life-videos',
        Key: file.name,
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
