# RecorderComponent (app-recorder)

## Rationale
This component exists to work with the "recorder.js" JavaScript.  This is all part getting the Media Stream Recorder
(https://github.com/streamproc/MediaStreamRecorder; https://www.npmjs.com/package/msr) to work.  This package was selected
because of the more modern video format.

# Implementation issues
 
However, because this package is made for use in straight JavaScript, and we designed the solution as an progressive, Angular application
this results in some issues that we needed to overcome.
 
1. We had to provide a mechanism to expose some of the variables within the CommonJS module MediaStreamRecorder.js to our second JavaScript 
   file, recorder.js.  Media Stream recorder was meant to be used in straight JavaScript.
2. Recorder.js is based upon sample code (https://www.webrtc-experiment.com/msr/video-recorder.html) that allows the Media Stream Recorder to work.
3. To consumer a straight JavaScript file (like recorder.js) within Angular, then you must expose this as a .d.ts file.  This is why there is a
   recorder.d.ts file.
4. Within onMediaSuccess function, we create a callback for `ondataavailable` to set the blob on the iFrame and expose `generatedBlob`
   as a more global variable (gross).
5. Then within `RecorderComponent.onClickSave` we retrieve `generatedBlob`, and then call `awsService.uploadS3File` as part of the Save/Publish to
   AWS step.

A better implementation (in hindsight) may have been to create a React solution.

The `<app-recorder>` has control has been disabled within the `*ngIf` on this control tag.  Currently, it can be activated by removing the false from `*ngIf="false&&!!supporter&&!!selectedSponsorship"` within `app.component.html`.
