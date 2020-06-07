import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sponsorship } from '../models/sponsorship';
import { Observable, Subject } from 'rxjs';
import { Supporter } from '../models/supporter';
import { environment } from '../../environments/environment';

const MISSION_LIFE_SPONSORSHIP_API = environment.missionLifeSponsorshipAPI;

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
}
