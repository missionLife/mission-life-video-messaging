import {Component, OnInit} from '@angular/core';
import {ReachService} from './services/reach.service';
import {Supporter} from './models/supporter';
import {Sponsorship} from './models/sponsorship';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MetadataService } from './services/metadata.service';

import { AWSService } from '../app/services/aws.service';
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

  constructor(private fb: FormBuilder, private reachService: ReachService, private awsService: AWSService) { }

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

  public save_orig(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      console.log(this.form.value);
      const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
      console.log(metadata);
      resolve(true);
    });
  }

  public save() {
    console.log('in save');
    this.awsService.uploadS3File();
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
