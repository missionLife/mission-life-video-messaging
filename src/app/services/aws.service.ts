import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Sponsorship} from '../models/sponsorship';
import {Observable, Subject} from 'rxjs';
import {Supporter} from '../models/supporter';
import {map} from 'rxjs/operators';

import * as AWS from 'aws-sdk';


const REACH_URL = 'https://missionlife.reachapp.co/api/v1';
const HTTP_OPTIONS = {
  headers: {
    Authorization: 'Basic NDBiNjg5ODk0ZTRhZGNjOGFjNzcxMjk4MzRlYzMzY2Q6OWYwNGVhZGUxMzc5NjgwZGM0YmVjOTJlMjMyMTVmOWQ0NDNiZWU0Z' +
      'WVkMDljOTRkYzg0MjQwZGZkM2UzZTM5MA=='
  }
};

@Injectable()
export class AWSService {
  constructor(private http: HttpClient) { }

  public async uploadS3File() {
      console.log('in upload S3 file');
      AWS.config.update({
        accessKeyId: 'XXXX-Change this',
        secretAccessKey: 'XXX-Chagnge this'
    });

      const s3 = new AWS.S3();
      const params = {
        Body: 'abcdefg',
        Bucket: 'mission-life-videos',
        Key: 'HappyFace.txt'
       };
      s3.putObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
      return null;
  }

  // public getAllSponsorships(): Observable<Sponsorship[]> {
  //   const sponsorships = [];
  //   const result = new Subject<Sponsorship[]>();

  //   this.getSponsorships(1, sponsorships, () => {
  //     result.next(sponsorships);
  //   });

  //   return result;
  // }

  // public getSupporters(sponsorship: Sponsorship): Observable<Supporter[]> {
  //   return this.http.get<any[]>(`${REACH_URL}/sponsorships/${sponsorship.id}/sponsors`, HTTP_OPTIONS);
  // }

  // public getSponsorships(pageNumber: number, sponsorships: Sponsorship[], callback: () => void) {
  //   return this.http.get<Sponsorship[]>(`${REACH_URL}/sponsorships?page=${pageNumber}&per_page=200`, HTTP_OPTIONS).subscribe(results => {
  //     if (results.length > 0) {
  //       sponsorships.push(...results);
  //       this.getSponsorships(pageNumber + 1, sponsorships, callback);
  //     } else {
  //       callback();
  //     }
  //   });
  // }
}
