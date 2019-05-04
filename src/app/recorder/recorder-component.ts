import { Component, OnInit } from '@angular/core';
import { test1 } from 'src/assets/javascript/demo';
import { mediaConstraints, onMediaSuccess, onMediaError, captureUserMedia } from 'src/assets/javascript/recorder';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder-component.html',
  styleUrls: ['./recorder-component.scss']
})
export class RecorderComponent implements OnInit {
  title = 'mission-life-video-messaging';

  public startButtonDisabled: boolean;
  public stopButtonDisabled: boolean;
  public pauseButtonDisabled: boolean;
  public resumeButtonDisabled: boolean;
  public saveButtonDisabled: boolean;

  constructor() {

    this.startButtonDisabled = false;
    this.stopButtonDisabled = true;
    this.pauseButtonDisabled = true;
    this.resumeButtonDisabled = true;
    this.saveButtonDisabled = true;
  }

  public ngOnInit() {
  }

  //#region Public Event Handlers

  public onClickStart() {
    console.log('start recording');
    this.startButtonDisabled = true;
    test1();
    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

    this.pauseButtonDisabled = false;
    this.stopButtonDisabled = false;
    this.saveButtonDisabled = false;
  }

  public onClickStop() {
    console.log('stop recording');
    this.stopButtonDisabled = true;
    // mediaRecorder.stop();
    // mediaRecorder.stream.stop();

    this.pauseButtonDisabled = true;
    this.startButtonDisabled = false;
    this.resumeButtonDisabled = true;
  }

  public onClickPause() {
    console.log('pause recording');
    this.pauseButtonDisabled = true;
    // mediaRecorder.pause();

    this.resumeButtonDisabled = false;
}

  public onClickResume() {
    console.log('resume recording');
    this.resumeButtonDisabled = true;
    // mediaRecorder.resume();

    this.pauseButtonDisabled = false;
}

  public onClickSave() {
    console.log('save recording');
    this.saveButtonDisabled = true;
    // mediaRecorder.save();

    // alert('Drop WebM file on Chrome or Firefox. Both can play entire file. VLC player or other players may not work.');
}
  //#endregion

}
