import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable, Subject } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';
import * as sanitize from 'sanitize-filename';

@Injectable()
export class S3Service {

  constructor(
    private auth: AuthorizationService
  ) {}


  private initS3(): AWS.S3 {
    AWS.config.update({
      region: 'us-east-2'
    });
    const s3 = new AWS.S3();

    return s3;
  }

  uploadS3File(
    file,
    metadata
  ): Observable<any> {

    
    const result = new Subject();

    const partner = sanitize(metadata.partner.split(' ').join(''));
    const fileName = sanitize(file.name).replace(/\s/g, '_');
    const timestamp = metadata.upload.toDateString().replace(/\s/g, '_');

    const params = {
      Body: file,
      Bucket: 'mission-life-youtube-data-api-upload',
      Key: `${partner}/${fileName}_${timestamp}`,
      Metadata: {
        'person-metadata': JSON.stringify(metadata)
      },
      ContentType: file.type
    };
    
    this.initS3().putObject(params).send((err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        result.next();
      }
    });

    return result;
  } 
}
