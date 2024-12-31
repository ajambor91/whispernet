// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {IHero} from "@/models/hero.model";
import {ELang} from "@/enums/lang.enum";

export default async function  getMainPage(lang: ELang = ELang.EN): Promise<IHero> {
  const response = await fetch(`/cms/main?lang=${lang}`);
  return await response.json();
}
