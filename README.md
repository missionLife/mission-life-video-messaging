# MissionLifeVideoMessaging

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Overview
## Go to the cloudfront URL
## Select a sponsorship
## The supporter and partner information will be displayed
## The user can then select or take a video, then retake the video if needed
## The user can then click save and transfer the video to S3
## A lambda in AWS transfers the video to Mission Life YouTube channel and tags the video using key value pair metadata

# Limitations
## We could make REACH API calls to get all the supporters
## There is no authenication to the site currently but it should added
## The Google YouTube API goes over quota too quickly. Maybe a bug in the API or due to how the files are uploaded
## Some plain old JS mixed with Typescript for some of the video recording and AWS libraries. We should have use REACT.
## The videos are not encrypted at REST and rely on AWS permission to the S3 bucket

# cloudfront for POC
https://d1s3z7p9p47ieq.cloudfront.net/login- NOT WORKING ANYMORE

# AWS Lambda function
## Written in Python and monitors S3 bucket. When a video is uploaded the function uses the metadata passed in key value pairs attached to the file in the S3 bucket. The file is then uploaded to the Mission Life YouTube channel and tagged with information about the sponsorship, supporter, and partner

