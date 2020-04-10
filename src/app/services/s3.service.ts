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

      const params = {
        Body: file,
        Bucket: 'mission-life-youtube-data-api-upload',
        Key: `${partner}/${uniqueKeyId}`,
        Metadata: {
          'person-metadata': JSON.stringify(metadata)
        },
        ContentType: file.type
      };

      this.initS3().upload(params, function (err, data) {
        if (err) {
          observer.next();
          console.log(err.stack);
        }
        observer.complete();
      }).on('httpUploadProgress', function (progress) {
        const percentage = (progress.loaded) * 100 / progress.total;
        console.log('The Percentage: ', percentage);
        observer.next(percentage);
      });
    });
  }
}
