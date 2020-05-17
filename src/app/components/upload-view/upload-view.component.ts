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
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';

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
  public uploadProgress: number;
  public uploadComplete = false;
  fileToUpload: File = null;
  errorMessage: string;
  isAvailableForUpload: boolean;

  constructor(
    private auth: AuthorizationService,
    private fb: FormBuilder,
    private reachService: ReachService,
    private router: Router,
    private S3Service: S3Service
  ) { }

  ngOnInit() {
    this.sponsorshipCtl.valueChanges.subscribe(change => {
      this.selectedSponsorship = change;
      if (this.selectedSponsorship) {
        const isAvailable = this.selectedSponsorship.isAvailableForUpload;
        const dateAvailableForUpload = new Date(this.selectedSponsorship.dateAvailableForUpload);
        if (isAvailable === false) {
          this.isAvailableForUpload = false;
          var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const timestampString = dateAvailableForUpload.toLocaleDateString("en-US", options);
          this.errorMessage = `
            Only 1 upload per month.  Next upload date for ${this.selectedSponsorship.title} is ${timestampString}
          `;
        } else {
          this.isAvailableForUpload = true;
          this.errorMessage = null;
        }
      }
    });
    this.reachService.getSponsorships(this.auth.getAuthToken())
      .subscribe(res => {
        this.sponsorships = res.sponsorships.sort((a, b) => ('' + a.title).localeCompare(b.title));
        this.supporter = res;
      });
  }

  public save(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.fileToUpload || !this.sponsorshipCtl.value) {
        resolve(false);
      } else {
        const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
        if (this.fileToUpload != null) {
          this.S3Service.uploadS3File(this.fileToUpload, metadata, progress => this.uploadProgress = progress)
            .subscribe(() => {
              this.updateSponsorship(this.selectedSponsorship);
              this.uploadProgress = null;
              this.selectedSponsorship = null;
              this.uploadComplete = true;
              this.form.reset();
              this.fileToUpload = undefined;
            });
        }
        resolve(true);
      }
    });
  }

  checkAuth() {
    const isLoggedIn = this.auth.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login'])
    }
  }

  updateSponsorship(sponsorship: Sponsorship) {
    for (const sponsorshipObject of this.sponsorships) {
      if (sponsorshipObject.id === sponsorship.id) {
        sponsorship.isAvailableForUpload = false;
        const dateAvailableForUpload = new Date();
        sponsorship.dateAvailableForUpload = dateAvailableForUpload.setDate(
          dateAvailableForUpload.getDate() + 30
        );
      }
    }
  }

  public handleFileInput(files: FileList) {
    const video = document.createElement('video');
    var fileURL = URL.createObjectURL(files[0]);
    video.src = fileURL;
    video.preload = 'metadata';

    video.ondurationchange = () => {
      if (video.duration < 61) {
        this.fileToUpload = files.item(0); /* now you can work with the file list */
        this.errorMessage = null;
      } else {
        this.errorMessage = `
          Your video is longer than 1 minute. Please select a shorter video
        `;
        this.fileToUpload = null;
      }
    };
  }

  public selectFileClick(event: any) {
    if (!this.selectedSponsorship || !this.isAvailableForUpload) {
      event.preventDefault();
    }
  }

  public resetAfterSave() {
    this.checkAuth();
    this.uploadComplete = false;
  }
}
