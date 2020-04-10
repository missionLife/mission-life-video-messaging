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

  private initS3(params): AWS.S3.ManagedUpload {
    AWS.config.update({
      region: 'us-east-2'
    });
    console.log('Calling Upload 5 PARAMS: ', params);
    const s3 = new AWS.S3.ManagedUpload({params});

    return s3;
  }

  async uploadS3File(
    file,
    metadata,
    progressCallback: (progress: number) => void
  ): Promise<any> {

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
    console.log('Calling Upload 6 uploadS3File params: ', params);

    return this.initS3(params).on('httpUploadProgress', (event) => {
      console.log('THE event: ', event);
    }).send(function (err, data) {
      if (err) {
        console.log('The Error: ', err);
      } else {
        return Promise.resolve({ ok: true });
      }
    });
  } 
}
