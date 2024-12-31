import React from "react";
import {useState, useEffect} from "react";
import {IFeatures} from "@/models/features.model";
import getFeaturesPage from "@/api/get-features";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps} from "next";
import {getLangFromCookies, setLangCookie} from "@/core/cookie";
import {ELang} from "@/enums/lang.enum";
import {setLang} from "@/store/slice";
import Centered from "../../../../shared/components/elements/centered/Centered";
import styles from './Features.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {i18n, useTranslation } from 'next-i18next';
import Indicator from "../../../../shared/components/indicator/Indicator";
import PrimaryHeader from "../../../../shared/components/elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../../../../shared/components/elements/secondary-header/SecondaryHeader";
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
export default function FeaturesPage({ lang }: { lang: ELang }) {
    const [features, setFeatures] = useState<IFeatures | null>(null);
    const { t, i18n } = useTranslation("translation");
    const langFromStore = useSelector(state => state.lang);
    const [newLang, setNewLang] = useState<ELang | null>(null);
    i18n.on('languageChanged', setNewLang)
    const dispatch = useDispatch();
    useEffect(() => {

        const getData = async () => {
            const data = await getFeaturesPage(newLang ?? lang);
            setFeatures(data);
        };
        getData();
    }, [newLang]);
    return (
        <div>
            {!features ?
                <div>
                    <Centered>
                        <Indicator />
                    </Centered>
                </div>

                : <div className={styles['features']}>
                    <div className={styles['features__headers']}>
                        <PrimaryHeader>{features.title}</PrimaryHeader>
                        <SecondaryHeader>{features.subtitle}</SecondaryHeader>
                    </div>
                    <div className={styles['features__points']}>
                      <ul className={styles['points-menu']}>
                          {features.features.map((feature, index) =>
                              <li  className={styles['points-menu__item']} key={index}>
                                  <p  className={styles['points-menu__item__title']}>{feature.title}</p>
                                  <p  className={styles['points-menu__item__subtitle']}>{feature.subtitle}</p>
                              </li>)}
                      </ul>
                    </div>
                </div>
            }
        </div>
    )
}