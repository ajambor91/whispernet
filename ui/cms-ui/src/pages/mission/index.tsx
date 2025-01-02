import {useEffect, useState} from "react";
import {ELang} from "@/enums/lang.enum";
import styles from './Mission.module.scss';
import Centered from "../../../../shared/components/elements/centered/Centered";
import Indicator from "../../../../shared/components/indicator/Indicator";
import PrimaryHeader from "../../../../shared/components/elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../../../../shared/components/elements/secondary-header/SecondaryHeader";
import {useDispatch, useSelector} from "react-redux";
import {GetServerSideProps} from "next";
import {getLangFromCookies, setLangCookie} from "@/helpers/cookie";
import {setLang, settings} from "@/store/slice";
import { useTranslation } from 'next-i18next';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {IMission} from "@/models/mission.model";
import getMissionPage from "@/api/get-mission";
import {useAppSelector} from "@/store/store";



export const getServerSideProps: GetServerSideProps = async (context) => {
  let locale = getLangFromCookies(context.req);

  if (!locale) {
    locale = context.locale || 'en';
    setLangCookie(locale as ELang);

  }
  const translations = await serverSideTranslations(locale, ['translation']);
  return {
    props: {
      ...translations,
      lang: locale
    }
  };
}
export default function Mission({ lang }: { lang: ELang }) {
  const { t, i18n} = useTranslation("translation");
  const langFromStore = useAppSelector(state => state.settings.lang);
  const dispatch = useDispatch();
  const [ missionData, setMissionData] = useState<IMission | null>(null);
  const [newLang, setNewLang] = useState<ELang | null>(null);
  i18n.on('languageChanged', setNewLang);
  useEffect(() => {
    let currentLang: ELang;
    if (!langFromStore) {
      currentLang = lang;
      dispatch(setLang({lang: currentLang}))
    } else {
      currentLang = langFromStore;
    }
    const getData = async () => {
      setMissionData(null);
      const data = await getMissionPage(newLang ?? currentLang);
      setMissionData(data);
    };
    getData();
  }, [newLang]);
  return (
  <div>
    <Centered>
      {!missionData ?
          <Indicator />
          :
          <div className={styles['main-page']}>
            <div className={styles['main-page__headers']}>
              <PrimaryHeader>{missionData.title}</PrimaryHeader>
              <SecondaryHeader>{missionData.subtitle}</SecondaryHeader>
            </div>
            <div className={styles['main-page__description']}>
              <p>{missionData.description}</p>
            </div>
          </div>
          
      }
    </Centered>



  </div>
  );
}
