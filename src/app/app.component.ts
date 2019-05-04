import {Component, OnInit} from '@angular/core';
import {ReachService} from './services/reach.service';
import {Supporter} from './models/supporter';
import {Sponsorship} from './models/sponsorship';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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
  public form: FormGroup;

  constructor(private fb: FormBuilder, private reachService: ReachService) { }

  public ngOnInit() {
    this.createForm();
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

  public save(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      alert('saving the form');
      resolve(true);
    });
  }

  private createForm(): void {
    const sponsorshipCtl: FormControl = new FormControl('', [Validators.required]);
    sponsorshipCtl.valueChanges.subscribe(change => {
      this.selectedSponsorship = change;
      this.sponsorshipChange();
    });
    this.form = this.fb.group({
      sponsorship: sponsorshipCtl
    });
  }
}
