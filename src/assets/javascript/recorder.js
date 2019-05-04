var msr = require('./MediaStreamRecorder');

export var mediaConstraints = {
    audio: !msr.IsOpera && !msr.IsEdge, // record both audio/video in Firefox/Chrome
    video: true
};

export function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

// document.querySelector('#start-recording').onclick = function () {
//     console.log('start recording');
//     this.disabled = true;
//     captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
// };

// document.querySelector('#stop-recording').onclick = function () {
//     console.log('stop recording');
//     this.disabled = true;
//     mediaRecorder.stop();
//     mediaRecorder.stream.stop();

//     document.querySelector('#pause-recording').disabled = true;
//     document.querySelector('#start-recording').disabled = false;
// };

// document.querySelector('#pause-recording').onclick = function () {
//     console.log('pause recording');
//     this.disabled = true;
//     mediaRecorder.pause();

//     document.querySelector('#resume-recording').disabled = false;
// };

// document.querySelector('#resume-recording').onclick = function () {
//     console.log('resume recording');
//     this.disabled = true;
//     mediaRecorder.resume();

//     document.querySelector('#pause-recording').disabled = false;
// };

// document.querySelector('#save-recording').onclick = function () {
//     console.log('save recording');
//     this.disabled = true;
//     mediaRecorder.save();

//     // alert('Drop WebM file on Chrome or Firefox. Both can play entire file. VLC player or other players may not work.');
// };

export var mediaRecorder;

export var generatedBlob;

export function onMediaSuccess(stream) {
    var video = document.querySelector('video');
    var videosContainer = document.getElementById('videos-container');
    var videoWidth = document.getElementById('video-width').value || 320;
    var videoHeight = document.getElementById('video-height').value || 240;
    video = msr.mergeProps(video, {
        controls: true,
        muted: true,
        width: videoWidth,
        height: videoHeight
    });
    video.srcObject = stream;
    video.play();
    videosContainer.appendChild(video);
    videosContainer.appendChild(document.createElement('hr'));
    mediaRecorder = new msr(stream);
    mediaRecorder.stream = stream;
    var recorderType = document.getElementById('video-recorderType').value;
    if (recorderType === 'MediaRecorder API') {
        mediaRecorder.recorderType = MediaRecorderWrapper;
    }
    if (recorderType === 'WebP encoding into WebM') {
        mediaRecorder.recorderType = WhammyRecorder;
    }
    // don't force any mimeType; use above "recorderType" instead.
    // mediaRecorder.mimeType = 'video/webm'; // video/webm or video/mp4
    mediaRecorder.videoWidth = videoWidth;
    mediaRecorder.videoHeight = videoHeight;
    mediaRecorder.ondataavailable = function (blob) {
        console.info('blob', blob);
        var blobUrl = URL.createObjectURL(blob);
        var videoWidth = document.getElementById('video-width').value || 320;
        var videoHeight = document.getElementById('video-height').value || 240;
    
        var previewContainer = document.getElementById('preview-container');
        previewContainer.height = videoHeight;
        previewContainer.width = videoWidth;
        previewContainer.src = blobUrl;

        generatedBlob = blob;

        // var a = document.createElement('a');
        // a.target = '_blank';
        // a.innerHTML = 'Open Recorded Video No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
        // a.href = URL.createObjectURL(blob);
        // videosContainer.appendChild(a);
        // videosContainer.appendChild(document.createElement('hr'));

        // You can let this keep recording videos every "n" seconds (time-interval), but we stop recording after the first time interval.
        var btnStop = document.getElementById('stop-recording');
        btnStop.click();
    };
    var timeInterval = document.querySelector('#time-interval').value;
    if (timeInterval) timeInterval = parseInt(timeInterval);
    else timeInterval = 10 * 1000;  // default time interval is 10 seconds
    // get blob after specific time interval
    mediaRecorder.start(timeInterval);
}

export function onMediaError(e) {
    // Log errors to console as part of prototype only
    console.error('media error', e);
}

// Don't expose; use locally use as local var in onMediaSuccess
//export var videosContainer = document.getElementById('videos-container');
var index = 1;

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
    var data = new Date(milliseconds);
    return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
}

window.onbeforeunload = function () {
    document.querySelector('#start-recording').disabled = false;
};
