// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {IHero} from "@/models/hero.model";
import {ELang} from "@/enums/lang.enum";
import {IFeatures} from "@/models/features.model";

export default async function  getFeaturesPage(lang: ELang = ELang.EN): Promise<IFeatures> {
  const response = await fetch(`/cms/features?lang=${lang}`);
  return await response.json();
}
