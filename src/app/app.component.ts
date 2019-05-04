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
  title = 'Mission Life - Video Messaging';

  public sponsorships: Sponsorship[];
  public selectedSponsorship: Sponsorship;
  public supporter: Supporter;
  public form: FormGroup;

  fileToUpload: File = null;

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

  public save(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.form.valid) {
        console.log('invalid form');
        resolve(false);
      } else {
        console.log(this.form.value);
        const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
        console.log(metadata);
        console.log('in save');
        if (this.fileToUpload != null) {
          console.log(this.fileToUpload);
          this.awsService.uploadS3File(this.fileToUpload, metadata);
        }
        resolve(true);
      }
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  public showError = (controlName: string) => {
    return !this.form.controls[controlName].pristine || this.form.controls[controlName].touched;
  }

  public handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0); /* now you can work with the file list */
  }

  private createForm(): void {
    const sponsorshipCtl: FormControl = new FormControl('', [Validators.required]);
    sponsorshipCtl.valueChanges.subscribe(change => {
      this.selectedSponsorship = change;
      this.sponsorshipChange();
    });
    this.form = this.fb.group({
      sponsorship: sponsorshipCtl,
      file: new FormControl('', [Validators.required])
    });
  }
}
