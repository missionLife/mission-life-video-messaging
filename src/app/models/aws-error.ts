const INVALID_CREDENTIALS_ERROR_MESSAGES = {
  'User does not exist.': 'Invalid Username or Password',
  'Incorrect username or password.': 'Incorrect Username or Password',
  'Password does not conform to policy: Password must have uppercase characters': 'Password must have uppercase characters',
  'Password does not conform to policy: Password must have lowercase characters': 'Password must have lowercase characters',
  'Password does not conform to policy: Password must have numeric characters': 'Password must have numeric characters',
  'Password does not conform to policy: Password not long enough': 'Password not long enough',
};

export class AWSError {
  public message: string;
  constructor(awsErrorMessage) {
    this.message = INVALID_CREDENTIALS_ERROR_MESSAGES[awsErrorMessage];
  }
}