import {Component, OnInit} from '@angular/core';
import {ReachService} from './services/reach.service';
import {Supporter} from './models/supporter';
import {Sponsorship} from './models/sponsorship';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mission-life-video-messaging';

  public sponsorships: Sponsorship[];
  public selectedSponsorship: Sponsorship;
  public supporter: Supporter;

  constructor(private reachService: ReachService) { }

  public ngOnInit() {
    this.reachService.getAllSponsorships()
      .subscribe(supporters => this.sponsorships = supporters.sort((a, b) => ('' + a.title).localeCompare(b.title)));
  }

  public sponsorshipChange() {
    this.reachService.getSupporters(this.selectedSponsorship)
      .subscribe(supporters => {
        if (supporters.length > 0) {
          this.supporter = supporters[0];
        }
      });
  }
}
