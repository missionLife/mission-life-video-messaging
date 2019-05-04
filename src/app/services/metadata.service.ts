
export class MetadataService {

  public static getVideoMetadataString(supporter: any, sponsorship: any): string {
    return JSON.stringify(this.getVideoMetadata(supporter, sponsorship));
  }

  public static getVideoMetadata(supporter: any, sponsorship: any): any {
    return {
      supporter: this.getSupporterTag(supporter),
      sponsorship: this.getSponsorshipTag(sponsorship),
      partner: this.getPartnerTag(sponsorship),
      upload: new Date()
    };
  }

  private static getSupporterTag(supporter: any) {
    return supporter.supporter.name;
  }

  private static getSponsorshipTag(sponsorship: any) {
    return sponsorship.title;
  }

  private static getPartnerTag(sponsorship: any) {
    return sponsorship.place.title;
  }
}
