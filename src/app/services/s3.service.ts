import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable, Subject } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';
import { v4 as uuidv4 } from 'uuid';

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
    metadata,
    progressCallback: (progress: number) => void
  ): Observable<any> {

    const result = new Subject();
    const partner = metadata.partner.split(' ').join('');
    const uniqueKeyId = uuidv4();

    const params = {
      Body: file,
      Bucket: 'mission-life-youtube-data-api-upload',
      Key: `${partner}/${uniqueKeyId}`,
      Metadata: {
        'person-metadata': JSON.stringify(metadata)
      },
      ContentType: file.type
    };
    
    this.initS3().putObject(params).on('httpUploadProgress', progress => {
      console.log('the progress: ', progress);
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