import {useEffect, useState} from "react";
import {IHero} from "@/models/hero.model";
import getMainPage from "@/api/get-main";
import {ELang} from "@/enums/lang.enum";
import Header from "../../../shared/components/header/Header";



export default function Home() {

  // const [ pageData, setPageData] = useState<IHero | null>(null);
  // useEffect(() => {
  //   const data = getMainPage(ELang.EN);
  //   setPageData(data);
  // }, []);
  return (
  <div>

    <Header />
    {/*{!pageData ?*/}
    {/*    <span>Loading</span>*/}
    {/*    :*/}
    {/*    <div>*/}
    {/*      <h1>{pageData.title}</h1>*/}
    {/*      <h2>{pageData.subtitle}</h2>*/}
    {/*    </div>*/}
    {/*}*/}


  </div>
  );
}
