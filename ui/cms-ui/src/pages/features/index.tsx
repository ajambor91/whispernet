import React, {useEffect, useState} from "react";
import {IFeatures} from "@/models/features.model";
import getFeaturesPage from "@/api/get-features";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps} from "next";
import {getLangFromCookies, setLangCookie} from "@/helpers/cookie";
import {ELang} from "@/enums/lang.enum";
import {setLang} from "@/store/slice";
import Centered from "../../../../shared/components/elements/centered/Centered";
import styles from './Features.module.scss';
import {useDispatch} from "react-redux";
import {useTranslation} from 'next-i18next';
import Indicator from "../../../../shared/components/indicator/Indicator";
import PrimaryHeader from "../../../../shared/components/elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../../../../shared/components/elements/secondary-header/SecondaryHeader";
import {useAppSelector} from "@/store/store";

export const getServerSideProps: GetServerSideProps = async (context) => {
    let locale = getLangFromCookies(context.req);

    if (!locale) {
        locale = context.locale || 'en';
        setLangCookie(locale as ELang);

    }
    const features: IFeatures = await getFeaturesPage(locale as ELang, true);
    const translations = await serverSideTranslations(locale, ['translation']);
    return {
        props: {
            ...translations,
            lang: locale,
            features
        }
    };
}
export default function FeaturesPage({ lang, features }: { lang: ELang, features: IFeatures }) {
    const langFromStore = useAppSelector(state => state.settings.lang);
    const [pageFeatures, setPageFeatures] = useState<IFeatures | null>(null);
    const { t, i18n } = useTranslation("translation");
    const [newLang, setNewLang] = useState<ELang | null>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if (features) setPageFeatures(features);
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
            setPageFeatures(null);
            const data = await getFeaturesPage(langFromStore);
            setPageFeatures(data);
        };
        getData();
    }, [langFromStore]);
    return (
        <Centered>

        <div>
            {!pageFeatures ?
                <div>
                        <Indicator />
                </div>

                : <div className={styles['features']}>
                    <div className={styles['features__headers']}>
                        <PrimaryHeader>{features.title}</PrimaryHeader>
                        <SecondaryHeader>{features.subtitle}</SecondaryHeader>
                    </div>
                    <div className={styles['features__points']}>
                      <ul className={styles['points-menu']}>
                          {pageFeatures.features.map((feature, index) =>
                              <li  className={styles['points-menu__item']} key={index}>
                                  <p  className={styles['points-menu__item__title']}>{feature.title}</p>
                                  <p  className={styles['points-menu__item__subtitle']}>{feature.subtitle}</p>
                              </li>)}
                      </ul>
                    </div>
                </div>
            }
        </div>
        </Centered>

    )
}