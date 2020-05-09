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
      supporterEmail: this.getSupporterEmail(supporter),
      sponsorship: this.getSponsorshipTag(sponsorship),
      sponsorshipId: this.getSponsorshipId(sponsorship),
      partner: this.getPartnerTag(sponsorship.place),
      upload: new Date()
    };
  }

  private static getSupporterEmail(supporter: Supporter) {
    return supporter.supporterEmail;
  }

  private static getSupporterTag(supporter: Supporter) {
    return supporter.supporterName;
  }

  private static getSponsorshipTag(sponsorship: Sponsorship) {
    return sponsorship.title;
  }

  private static getSponsorshipId(sponsorship: Sponsorship) {
    return sponsorship.id;
  }

  private static getPartnerTag(place: Place) {
    return place.title;
  }
}
