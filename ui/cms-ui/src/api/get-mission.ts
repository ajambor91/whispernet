
import {ELang} from "@/enums/lang.enum";
import {IMission} from "@/models/mission.model";

export default async function  getMissionPage(lang: ELang = ELang.EN): Promise<IMission> {
  const response = await fetch(`/cms/mission?lang=${lang}`);
  return await response.json();
}
