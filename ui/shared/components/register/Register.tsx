import React, { useState} from "react";
import TertiaryHeader from "../elements/tertiary-header/TertiaryHeader";
import Input from "../elements/input/Input";
import Radio, {IRadioOption} from "../elements/radio-button/Radio";
import Textarea from "../elements/text-area/TextArea";
import Button from "../elements/button/Button";
import FileUploader from "../file-uploader/FileUploader";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import styles from "./Register.module.scss"
import {pgpPlaceholder} from "../../contstants/pgp-placeholder";
export interface IRegisterProps {
    submit: (username: string, key: string) =>  void;
    onFileUpload: (file: Blob) => void;
}
const Register: React.FC<IRegisterProps> = ({submit, onFileUpload}) => {
    const [fileDownloaded, setFileDownloaded] = useState<boolean>(false);
    const options: IRadioOption[] =  [{
        name: "file",
        value: "file",
        label: "Send file",
        id: 'file'
    },
        {
            name: "browser",
            value: "browser",
            label: "Paste key",
            id: 'browser'
        }
    ];
    const [currentOption, setCurrentOption] = useState<string | undefined>("browser");
    const [login, setLogin] = useState<string>();
    const [keyData, setKeyData] = useState<string>()
    const setLoginValue = (event: any) => {
        const loginValue = event.target.value;
        if (loginValue != null && login !== loginValue){
            setLogin(loginValue);
        }
    }

    const setKey = (event: any) => {
        setKeyData(event.target.value)
    }
    const submitForm = () => {

        submit(login, keyData);
    }
    return (
        <div className={styles["register"]} style={{width: '650px'}}>
            <SecondaryHeader style={{"padding": "10px"}}>Sign Up</SecondaryHeader>
            <Input style={{'width': '100%', 'text-align': 'center'}} onChange={setLoginValue}
                   placeholder="Type your username" type="text"/>
            <TertiaryHeader>Select registration method:</TertiaryHeader>
            <Radio options={options} valueChange={setCurrentOption}></Radio>
            <div className={styles["register__options"]}>
            {currentOption === 'browser' ?
                <div>
                    <TertiaryHeader>Paste your PGP Public key</TertiaryHeader>
                    <p className={styles["register__description"]}>
                        Please make sure to paste a valid PGP public key.
                        Some algorithms are not supported. It is strongly recommended to use RSA keys.
                    </p>
                    <Textarea placeholder={pgpPlaceholder} style={{"height": "400px", "width": "100%"}} onChange={setKey}/>
                </div>
                :
                <div>
                    <TertiaryHeader>Attach your public PGP signature file</TertiaryHeader>
                    <p className={styles["register__description"]}>
                        Please make sure that your file is a valid PGP public key.
                        Some algorithms are not supported. It is strongly recommended to use RSA keys.
                    </p>
                    <FileUploader onFile={onFileUpload}/>

                </div>}
            </div>
            <div className={styles["register__buttons"]}>
                <Button onClick={submitForm} className="button-primary">Register</Button>
            </div>
        </div>
    )
}

export default Register;