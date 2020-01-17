export interface CognitoCallback {
  cognitoCallback(message: Error | string, result: any): void;
}