import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sponsorship } from '../models/sponsorship';
import { Observable, Subject } from 'rxjs';
import { Supporter } from '../models/supporter';
import { environment } from '../../environments/environment';

const MISSION_LIFE_SPONSORSHIP_API = environment.missionLifeSponsorshipAPI;
const REACH_URL = 'https://missionlife.reachapp.co/api/v1';
const HTTP_OPTIONS = {
  headers: {
    Authorization: 'Basic NDBiNjg5ODk0ZTRhZGNjOGFjNzcxMjk4MzRlYzMzY2Q6OWYwNGVhZGUxMzc5NjgwZGM0YmVjOTJlMjMyMTVmOWQ0NDNiZWU0Z' +
      'WVkMDljOTRkYzg0MjQwZGZkM2UzZTM5MA=='
  }
};

@Injectable()
export class ReachService {
  constructor(private http: HttpClient) { }

  public getSponsorships(authToken: string) {
    let options = {
      headers: {
        Authorization: authToken
      }
    };
    return this.http.get<any>(`${MISSION_LIFE_SPONSORSHIP_API}/sponsorships`, options);
  }

  public getSupporters(sponsorship: Sponsorship): Observable<Supporter[]> {
    console.log('MISSION_LIFE_SPONSORSHIP_API: ', MISSION_LIFE_SPONSORSHIP_API);
    return this.http.get<any[]>(`${REACH_URL}/sponsorships/${sponsorship.id}/sponsors`, HTTP_OPTIONS);
  }
}
