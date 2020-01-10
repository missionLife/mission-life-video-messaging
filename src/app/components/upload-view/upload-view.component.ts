import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormBuilder,
  Validators,
  FormControl 
} from '@angular/forms';
import { ReachService } from '../../services/reach.service';
import { Supporter } from '../../models/supporter';
import { Sponsorship } from '../../models/sponsorship';
import { MetadataService } from '../../services/metadata.service';
import { S3Service } from '../../services/s3.service';

@Component({
  selector: 'app-upload-view',
  templateUrl: './upload-view.component.html',
  styleUrls: ['./upload-view.component.scss']
})
export class UploadViewComponent implements OnInit {
  public sponsorships: Sponsorship[];
  public selectedSponsorship: Sponsorship = null;
  public supporter: Supporter;
  sponsorshipCtl: FormControl = new FormControl('', [Validators.required]); 
  fileCtl: FormControl = new FormControl('', [Validators.required])
  public form = this.fb.group({
    sponsorship: this.sponsorshipCtl,
    file: this.fileCtl
  });
  public uploadProgress: boolean;
  public uploadComplete = false;

  fileToUpload: File = null;

  constructor(
    private fb: FormBuilder,
    private reachService: ReachService, 
    private S3Service: S3Service
  ) { }

  ngOnInit() {
    this.sponsorshipCtl.valueChanges.subscribe(change => {
      this.selectedSponsorship = change;
      this.sponsorshipChange();
    });
    this.reachService.getAllSponsorships()
      .subscribe(supporters => this.sponsorships = supporters.sort((a, b) => ('' + a.title).localeCompare(b.title)));
  }

  public save(): Promise<boolean> {
    console.log('SAVE CLICKED');
    return new Promise<boolean>((resolve, reject) => {
      console.log('IS FORM VALID? ', this.form.valid);
      console.log('FILE TO UPLOAD: ', this.fileToUpload);
      console.log('THE FORM: ', this.form.status);
      console.log('FORM SPONSORSHIP: ', this.sponsorshipCtl.value);
      console.log('FORM FILE: ', this.fileCtl.value);
      if (!this.fileToUpload || !this.sponsorshipCtl.value) {
        console.log('SAVE CLICKED IF');
        resolve(false);
      } else {
        console.log('SAVE CLICKED ELSE');
        const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
        console.log('SAVE CLICKED fileToUpload', this.fileToUpload);
        if (this.fileToUpload != null) {
          console.log('SAVE CLICKED fileToUpload does NOT === null');
          this.uploadProgress = true;
          this.S3Service.uploadS3File(this.fileToUpload, metadata)
            .subscribe(() => {
              this.uploadProgress = false;
              this.selectedSponsorship = null;
              this.uploadComplete = true;
              this.form.reset();
              this.fileToUpload = undefined;
              this.supporter = undefined;
            });
        }
        resolve(true);
      }
    });
  }

  public handleFileInput(files: FileList) {
    console.log('handleFileInput files: ', files);
    console.log('handleFileInput files.item(0): ', files.item(0).name);
    this.fileToUpload = files.item(0); /* now you can work with the file list */
  }

  public selectFileClick(event: any) {
    if (!this.selectedSponsorship) {
      event.preventDefault();
    }
  }

  public sponsorshipChange() {
    if (this.selectedSponsorship) {
      this.reachService.getSupporters(this.selectedSponsorship)
        .subscribe(supporters => {
          if (supporters.length > 0) {
            this.supporter = supporters[0];
          }
        });
    }
  }
}
