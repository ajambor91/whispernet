
import {ELang} from "@/enums/lang.enum";
import {IMission} from "@/models/mission.model";
import {getUrl} from "@/helpers/api.helpers";

export default async function  getMissionPage(lang: ELang = ELang.EN, isSSR: boolean = false): Promise<IMission> {
  const response = await fetch(getUrl(`/cms/mission?lang=${lang}`, isSSR));
  return await response.json();
}
