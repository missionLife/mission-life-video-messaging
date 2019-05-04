import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Sponsorship} from '../models/sponsorship';
import {Observable, Subject} from 'rxjs';

const REACH_URL = 'https://missionlife.reachapp.co/api/v1';

@Injectable()
export class ReachService {
  constructor(private http: HttpClient) { }

  public getAllSupporters(): Observable<Sponsorship[]> {
    const sponsorships = [];
    const result = new Subject<Sponsorship[]>();

    this.getSponsorships(1, sponsorships, () => {
      result.next(sponsorships);
    });

    return result;
  }

  public getSupporters(sponsorship: Sponsorship): Observable<Sponsorship[]> {
    return this.http.get<Sponsorship[]>(`${REACH_URL}/sponsorships/${sponsorship.id}/supporters`);
  }

  public getSponsorships(pageNumber: number, sponsorships: Sponsorship[], callback: () => void) {
    return this.http.get<Sponsorship[]>(`${REACH_URL}/sponsorships?page=${pageNumber}&per_page=200`, {
      headers: {
        Authorization: 'Basic NDBiNjg5ODk0ZTRhZGNjOGFjNzcxMjk4MzRlYzMzY2Q6OWYwNGVhZGUxMzc5NjgwZGM0YmVjOTJlMjMyMTVmOWQ0NDNiZWU0Z' +
          'WVkMDljOTRkYzg0MjQwZGZkM2UzZTM5MA=='
      }
    }).subscribe(results => {
      if (results.length > 0) {
        sponsorships.push(...results);
        this.getSponsorships(pageNumber + 1, sponsorships, callback);
      } else {
        callback();
      }
    });
  }
}
