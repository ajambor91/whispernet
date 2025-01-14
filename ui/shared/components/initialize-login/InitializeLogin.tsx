import Input from "../elements/input/Input";
import Button from "../elements/button/Button";
import {useState} from "react";
import styles from "./InitializeLogin.module.scss"
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
export interface IInitializeLoginProps {
    submit: (login: string) =>  void
}
const InitializeLogin: React.FC<IInitializeLoginProps> = ({submit}) => {
    const [login, setLogin] = useState<string>();

    const setLoginValue = (event: any) => {
        const loginValue = event.target.value;
        if (loginValue != null && login !== loginValue){
            setLogin(loginValue);
        }
    }
    const initLogin = () => {
        submit(login)
    }
    return (
        <div className={styles["login-container"]}>
            <SecondaryHeader>Sign In</SecondaryHeader>
            <div className={styles["login-container__input"]}>
            <Input style={{'width': '100%', "text-align": "center"}} onChange={setLoginValue} placeholder="Type your username" type="text" />
            </div>
            <div className={styles["login-container__buttons"]}>
                <Button onClick={initLogin} className="button-primary">
                Login
            </Button>
            </div>
        </div>
    )
}

export default InitializeLogin;