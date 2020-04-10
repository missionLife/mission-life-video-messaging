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
  
  uploadFile(file, metadata): Observable<any> {

    return new Observable<any>((observer) => {
      

      const partner = metadata.partner.split(' ').join('');
      const uniqueKeyId = uuidv4();
      console.log('the file: ', file);
      const params = {
        Body: file,
        Bucket: 'mission-life-youtube-data-api-upload',
        Key: `${partner}/${uniqueKeyId}`,
        Metadata: {
          'person-metadata': JSON.stringify(metadata)
        },
        ContentType: file.type
      };

      let options: AWS.S3.ManagedUpload.ManagedUploadOptions = {
        params: params,
        partSize: 64*1024*1024,
      };

      this.initS3().putObject(params, (err, data) => {}).on('httpUploadProgress', (progress: ProgressEvent) => console.log(`progress - ${progress}`));
    });
  }
}
