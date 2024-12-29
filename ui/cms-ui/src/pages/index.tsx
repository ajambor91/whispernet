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



export default function Home() {

  const [ pageData, setPageData] = useState<IHero | null>(null);
  useEffect(() => {

    const getData = async () => {
      const data = await getMainPage(ELang.EN);
      setPageData(data);
    };
    getData();
  }, []);
  return (
  <div>
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
              <Button className={"button-primary"}>Start chat!</Button>
              <Button className={"button-primary"}>Learn more</Button>
            </div>
          </div>
          
      }
    </Centered>



  </div>
  );
}
