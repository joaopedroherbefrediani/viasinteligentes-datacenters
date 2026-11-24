import { Injectable } from '@nestjs/common';
import { SITE_CONTENT, SiteContent } from './content.data';

@Injectable()
export class ContentService {
  getSiteContent(): SiteContent {
    return SITE_CONTENT;
  }

  getInterests(): readonly string[] {
    return SITE_CONTENT.interests;
  }
}
