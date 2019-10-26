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
  public form: FormGroup;
  public uploadProgress: number;
  public uploadComplete = false;

  fileToUpload: File = null;

  constructor(
    private fb: FormBuilder,
    private reachService: ReachService, 
    private S3Service: S3Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.reachService.getAllSponsorships()
      .subscribe(supporters => this.sponsorships = supporters.sort((a, b) => ('' + a.title).localeCompare(b.title)));
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

  public save(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.form.valid) {
        resolve(false);
      } else {
        const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
        if (this.fileToUpload != null) {
          this.S3Service.uploadS3File(this.fileToUpload, metadata, progress => this.uploadProgress = progress)
            .subscribe(() => {
              this.uploadProgress = null;
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
    this.fileToUpload = files.item(0); /* now you can work with the file list */
  }

  public selectFileClick(event: any) {
    if (!this.selectedSponsorship) {
      event.preventDefault();
    }
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
