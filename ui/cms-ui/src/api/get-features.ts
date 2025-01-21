import {getUrl} from "@/helpers/api.helpers";
import {ELang} from "@/enums/lang.enum";
import {IFeatures} from "@/models/features.model";

export default async function  getFeaturesPage(lang: ELang = ELang.EN, isSSR: boolean = false): Promise<IFeatures> {
  const response = await fetch(getUrl(`/cms/features?lang=${lang}`, isSSR));
  return await response.json();
}
