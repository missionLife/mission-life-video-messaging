import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable, Subject } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class S3Service {

  constructor(
    private auth: AuthorizationService
  ) {}


  private initS3() {
    AWS.config.update({
      region: 'us-east-2'
    });
    const s3 = new AWS.S3();
    console.log('the s3 instance credentials', s3.config.credentials);
    return s3;
  }

  uploadS3File(
    file,
    metadata
  ): Observable<any> {

    
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
    console.log('uploadToS3 s3 params', params);
    this.initS3();
    // .putObject(params).send((err, data) => {
    //   if (err) {
    //     console.log(err, err.stack);
    //   } else {
    //     result.next();
    //   }
    // });

    return result;
  } 
}
