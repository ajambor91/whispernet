import {useEffect, useState} from "react";
import {IHero} from "@/models/hero.model";
import getMainPage from "@/api/get-main";
import {ELang} from "@/enums/lang.enum";
import styles from './Index.module.scss';
import Centered from "../../../shared/components/elements/centered/Centered";
import Indicator from "../../../shared/components/indicator/Indicator";
import PrimaryHeader from "../../../shared/components/elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../../../shared/components/elements/secondary-header/SecondaryHeader";
import Button from "../../../shared/components/elements/button/Button";
import {useDispatch} from "react-redux";
import {GetServerSideProps} from "next";
import {getLangFromCookies, setLangCookie} from "@/helpers/cookie";
import {setLang} from "@/store/slice";
import { useTranslation } from 'next-i18next';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import { useRouter } from 'next/router';
import {useAppSelector} from "@/store/store";
import {appURL} from "@/api/consts";
import AppHead from "@/components/head/AppHead";



export const getServerSideProps: GetServerSideProps = async (context) => {
  let locale = getLangFromCookies(context.req);
  if (!locale) {
    locale = context.locale || 'en';
    setLangCookie(locale as ELang);

  }
  const page: IHero = await getMainPage(locale as ELang, true);
  const translations = await serverSideTranslations(locale, ['translation']);
  return {
    props: {
      ...translations,
      lang: locale,
      page
    }
  };
}
export default function Home({ lang, page }: { lang: ELang, page: IHero }) {
  const { t, i18n  } = useTranslation("translation");
  const langFromStore = useAppSelector(state => state.settings.lang);
  const dispatch = useDispatch();
  const router = useRouter();
  const [ pageData, setPageData] = useState<IHero | null>(null);
  const [newLang, setNewLang] = useState<ELang | null>(null);

  const goToFeatures = () => {
    router.push('/features');
  }
  const goToChat = () => {
    window.open(appURL);
  }

  useEffect(() => {
    if (page) setPageData(page);
    if (!lang) {
      setNewLang(ELang.EN);
      dispatch(setLang({lang: ELang.EN}))
    } else {
      setNewLang(lang);
      dispatch(setLang({lang}));
    }
  }, []);

  useEffect(() => {
    if (!langFromStore || !newLang || newLang === langFromStore) return;
    setNewLang(langFromStore)
    const getData = async () => {
      setPageData(null);
      const data = await getMainPage(langFromStore);
      setPageData(data);
    };
    getData();
  }, [langFromStore]);
  return (
  <div>
    <AppHead lang={lang}/>
    <main>
    <Centered>
      {!pageData ?
          <Indicator />
          :
          <div className={styles['main-page']}>
            <div className={styles['main-page__headers']}>
              <PrimaryHeader>{pageData.title}</PrimaryHeader>
              <SecondaryHeader>{pageData.subtitle}</SecondaryHeader>
            </div>
            <div className={styles['main-page__description']}>
              <p>{pageData.description}</p>
            </div>
            <div className={styles['main-page__button-container']}>
              <Button onClick={goToChat} style={{width: '250px'}} className={"button-primary"}>{t('start-chat')}</Button>
              <Button onClick={goToFeatures} style={{width: '250px'}} className={"button-primary"}>{t('learn-more')}</Button>
            </div>
          </div>
          
      }
    </Centered>
    </main>


  </div>
  );
}
