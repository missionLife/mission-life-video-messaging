import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable, Subject } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class S3Service {
  s3: AWS.S3;

  constructor(
    private auth: AuthorizationService
  ) {}

  uploadS3File(
    file,
    metadata
  ): Observable<any> {

    if (!this.s3) {
      this.s3 = new AWS.S3();
    }
    const result = new Subject();

    const partner = metadata.partner.split(' ').join('');

    const params = {
      Body: file,
      Bucket: 'mission-life-youtube-data-api-upload',
      Key: `${partner}/${file.name}`,
      Metadata: {
        'person-metadata': JSON.stringify(metadata)
      },
      ContentType: file.type
    };
    
    this.s3.putObject(params).send((err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        result.next();
      }
    });

      return result;
    }
}
