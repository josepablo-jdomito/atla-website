import { authorType } from "./author";
import { categoryType } from "./category";
import { journalArticleType } from "./journalArticle";
import { seoSettingsType } from "./seoSettings";
import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";

export const schemaTypes = [
  seoType,
  socialLinkType,
  authorType,
  categoryType,
  seoSettingsType,
  journalArticleType,
];
