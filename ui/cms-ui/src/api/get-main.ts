// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {IHero} from "@/models/hero.model";
import {ELang} from "@/enums/lang.enum";
import {getUrl} from "@/helpers/api.helpers";

export default async function  getMainPage(lang: ELang = ELang.EN): Promise<IHero> {
  const response = await fetch(getUrl(`/cms/main?lang=${lang}`));
  return await response.json();
}
