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
import { promise } from 'protractor';

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

  constructor(
    private auth: AuthorizationService,
    private fb: FormBuilder,
    private reachService: ReachService,
    private router: Router,
    private S3Service: S3Service
  ) { }

  ngOnInit() {
    console.log('HEY 5');
    this.sponsorshipCtl.valueChanges.subscribe(change => {
      this.selectedSponsorship = change;
    });
    this.reachService.getSponsorships(this.auth.getAuthToken())
      .subscribe(res => {
        this.sponsorships = res.sponsorships.sort((a, b) => ('' + a.title).localeCompare(b.title));
        this.supporter = res.supporterName;
      });
  }

  public save(): Promise<boolean> {
    return new Promise<boolean>( async (resolve, reject) => {
      if (!this.fileToUpload || !this.sponsorshipCtl.value) {
        resolve(false);
      } else {
        const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
        if (this.fileToUpload != null) {
          this.S3Service.uploadFile(this.fileToUpload, metadata)
            .subscribe((progress) => {
              console.log('the progress in save', progress);
              this.uploadProgress = progress;
              if (this.uploadProgress == 100) {
                this.uploadProgress = null;
                this.selectedSponsorship = null;
                this.uploadComplete = true;
                this.form.reset();
                this.fileToUpload = undefined;
                this.supporter = undefined;
              }
              
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

  public handleFileInput(files: FileList) {
    const video = document.createElement('video');
    var fileURL = URL.createObjectURL(files[0]);
    video.src = fileURL;
    video.preload = 'metadata';

    video.ondurationchange = () => {
      console.log('THE LENGTH OF THE VIDEO', video.duration);
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
    if (!this.selectedSponsorship) {
      event.preventDefault();
    }
  }
}
