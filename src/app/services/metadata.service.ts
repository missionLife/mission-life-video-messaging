import { Supporter } from '../models/supporter';
import { Sponsorship } from '../models/sponsorship';
import { Place } from '../models/place';

export class MetadataService {

  public static getVideoMetadataString(supporter: Supporter, sponsorship: Sponsorship): string {
    return JSON.stringify(this.getVideoMetadata(supporter, sponsorship));
  }

  public static getVideoMetadata(supporter: Supporter, sponsorship: Sponsorship): any {
    return {
      supporter: this.getSupporterTag(supporter),
      sponsorship: this.getSponsorshipTag(sponsorship),
      partner: this.getPartnerTag(sponsorship.place),
      upload: new Date()
    };
  }

  private static getSupporterTag(supporter: Supporter) {
    return supporter.supporter.name;
  }

  private static getSponsorshipTag(sponsorship: Sponsorship) {
    return sponsorship.title;
  }

  private static getPartnerTag(place: Place) {
    return place.title;
  }
}
