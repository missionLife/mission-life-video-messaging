import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const MISSION_LIFE_SPONSORSHIP_API = environment.missionLifeSponsorshipAPI;

@Injectable()
export class ReachService {
  constructor(private http: HttpClient) { }

  public getSponsorships(authToken) {
    let options = {
      headers: {
        Authorization: authToken
      }
    };
    return this.http.get<any>(`${MISSION_LIFE_SPONSORSHIP_API}/sponsorships`, options);
  }
}
