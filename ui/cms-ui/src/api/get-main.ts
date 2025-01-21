
import {IHero} from "@/models/hero.model";
import {ELang} from "@/enums/lang.enum";
import {getUrl} from "@/helpers/api.helpers";

export default async function  getMainPage(lang: ELang = ELang.EN, isSSR: boolean = false): Promise<IHero> {
  const response = await fetch(getUrl(`/cms/main?lang=${lang}`, isSSR));
  return await response.json();
}
