import { Place } from './place';

export class Sponsorship {
  public id: number;
  public title: string;
  public place: Place;
  public isAvailableForUpload: boolean;
  public dateAvailableForUpload: number;
}
