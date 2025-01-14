import Input from "../elements/input/Input";
import Button from "../elements/button/Button";
import Radio, {IRadioOption} from "../elements/radio-button/Radio";
import React, {useEffect, useState} from "react";
import TertiaryHeader from "../elements/tertiary-header/TertiaryHeader";
import {ILoginState} from "../../slices/login.slice";
import Textarea from "../elements/text-area/TextArea";
import FileUploader from "../file-uploader/FileUploader";
import {createCleartextMessage, readPrivateKey, sign} from "openpgp";
import styles from "./Login.module.scss";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import {pgpPlaceholder, pgpPrivatePlaceholder} from "../../contstants/pgp-placeholder";
export interface ILoginProps {
    submit: (...[any]) => any | void;
    submitSigned: (signedMsg: string) => void;
    onFileUpload: (file: Blob) => void;
    loginState: ILoginState
}
const Login: React.FC<ILoginProps> = ({submit, loginState, onFileUpload, submitSigned}) => {
    const [fileDownloaded, setFileDownloaded] = useState<boolean>(false);
    const [keyPGP, setKeyPGP] = useState<string>();
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
    useEffect(() => {
        if (currentOption === 'file' && loginState.message && !fileDownloaded) {
            const fileToDownload: Blob = new Blob([loginState.message], {type: "text/plain"});
            const url = URL.createObjectURL(fileToDownload);
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'challenge.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            setFileDownloaded(true)
        }
    }, [currentOption]);

    const setPGPState = (event: any) => {
        setKeyPGP(event.target.value);
    }

    const signMessage = () => {

        const signMsg = async () => {
            const pKey = await readPrivateKey({armoredKey: keyPGP});
            const signedMsg = await sign({
                message:await createCleartextMessage({text: loginState.message}),
                signingKeys: pKey
            });
            submitSigned(signedMsg);
        }
        if (keyPGP && loginState.message) {
            signMsg();

        }
    }

    return (
        <div className={styles["login-container"]} style={{width: '650px'}}>
            <SecondaryHeader>Sign In</SecondaryHeader>
            <TertiaryHeader>Sign below message</TertiaryHeader>
            <Input value={loginState.message} type="text" disabled style={{width: '100%', "text-align": "center"}}/>
            <TertiaryHeader>Select verify method:</TertiaryHeader>
            <Radio options={options} valueChange={setCurrentOption}></Radio>
            <div className={styles["options"]}>

                {currentOption === 'browser' ?
                    <div className={styles["options__item"]}>
                        <TertiaryHeader>Paste your PGP private key to sign message</TertiaryHeader>
                        <p className={styles["options__description"]}>
                            Please ensure that you paste a valid PGP private key. Note that some algorithms are not supported, and we strongly recommend using RSA keys for compatibility. Your key will not be sent or saved; it is only required to sign the message.
                        </p>
                        <Textarea placeholder={pgpPrivatePlaceholder} style={{"height": "400px", "width": "100%"}} onChange={setPGPState}/>
                        <div className={styles["options__buttons"]}>
                            <Button onClick={signMessage} className="button-primary">Sign and authorize</Button>
                        </div>
                    </div>
                    :
                    <div>
                        <TertiaryHeader>Paste your signed by PGP file</TertiaryHeader>
                        <p className={styles["options__description"]}>
                            Please ensure that your file is not encrypted, as we only require a signed file.
                            Note that some algorithms are not supported. We strongly recommend using RSA keys for compatibility.
                        </p>
                        <FileUploader onFile={onFileUpload}/>
                        <div className={styles["options__buttons"]}>
                            <Button onClick={submit} className="button-primary">Send file to authorize</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Login;