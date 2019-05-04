import { Component, OnInit, ViewChild, ContentChildren, ContentChild, ViewChildren, ElementRef, QueryList, Input } from '@angular/core';
import { test1 } from 'src/assets/javascript/demo';
import {
  mediaConstraints,
  onMediaSuccess,
  onMediaError,
  captureUserMedia,
  mediaRecorder,
  generatedBlob
} from 'src/assets/javascript/recorder';
import { AWSService } from '../services/aws.service';
import { MetadataService } from '../services/metadata.service';
import { Supporter } from '../models/supporter';
import { Sponsorship } from '../models/sponsorship';


@Component({
  selector: 'app-recorder',
  templateUrl: './recorder-component.html',
  styleUrls: ['./recorder-component.scss']
})
export class RecorderComponent implements OnInit {

  //#region Private Constants
  private static readonly DEFAULT_RECORDING_TIME_INTERVAL = 10000; // 10 seconds
  //#endregion

  //#region Public Properties
  public startButtonDisabled: boolean;
  public stopButtonDisabled: boolean;
  public pauseButtonDisabled: boolean;
  public resumeButtonDisabled: boolean;
  public saveButtonDisabled: boolean;

  public numTakes: number;  // number of takes so far

  @Input()
  public supporter: Supporter;

  @Input()
  public selectedSponsorship: Sponsorship;

  //#endregion

  //#region Public Readonly Properties
  public get showPauseButton(): boolean {
    // Pause/resume functionality will not be exposed as part of the prototype.
    return false;
  }

  public get showResumeButton(): boolean {
    // Pause/resume functionality will not be exposed as part of the prototype.
    return false;
  }

  public get defaultRecordingTimeInterval() {
    return RecorderComponent.DEFAULT_RECORDING_TIME_INTERVAL;
  }

  public get displayPreviewContainer(): boolean {
    return !this.startButtonDisabled && (this.numTakes > 0);
  }
  //#endregion

  //#region Constructor and Lifecyle Methods
  constructor(
    private awsService: AWSService
  ) {
    this.startButtonDisabled = false;
    this.stopButtonDisabled = true;
    this.pauseButtonDisabled = true;
    this.resumeButtonDisabled = true;
    this.saveButtonDisabled = true;
    this.numTakes = 0;
  }

  public ngOnInit() {
  }
  //#endregion

  //#region Public Event Handlers
  public onClickStart() {
    // Start recording
    console.log('start recording');
    this.startButtonDisabled = true;
    this.numTakes++;

    test1();
    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

    this.pauseButtonDisabled = false;
    this.stopButtonDisabled = false;
    this.saveButtonDisabled = true;
  }

  public onClickStop() {
    // Stop recording and finish generating blob
    console.log('stop recording');
    this.stopButtonDisabled = true;
    mediaRecorder.stop();
    mediaRecorder.stream.stop();

    this.startButtonDisabled = false;
    this.pauseButtonDisabled = true;
    this.resumeButtonDisabled = true;
    this.saveButtonDisabled = false;
  }

  public onClickPause() {
    // This only suspends recording/generation of blobs every time interval.  This will not be exposed as part of the prototype.
    console.log('pause recording');
    mediaRecorder.pause();

    this.pauseButtonDisabled = true;
    this.resumeButtonDisabled = false;
  }

  public onClickResume() {
    // This only suspends recording/generation of blobs every time interval.  This will not be exposed as part of the prototype.
    console.log('resume recording');
    mediaRecorder.resume();

    this.resumeButtonDisabled = true;
    this.pauseButtonDisabled = false;
  }

  public onClickPreview() {
    console.log('preview recording');
  }

  public onClickSave() {
    // This saves a .webm file to the file system
    console.log('save/publish recording');
    // mediaRecorder.save(); // use this to save to the file system

    const blob = generatedBlob;
    const fileToUpload: File = new File([blob], 'blob' + Date.now());
    const metadata = MetadataService.getVideoMetadata(this.supporter, this.selectedSponsorship);
    this.awsService.uploadS3File(fileToUpload, metadata);

    this.saveButtonDisabled = true;

    // alert('Drop WebM file on Chrome or Firefox. Both can play entire file. VLC player or other players may not work.');
  }
  //#endregion

}
