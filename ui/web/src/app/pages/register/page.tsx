import React, {useEffect, useState} from "react";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import { useNavigate } from "react-router-dom";
import Register from "../../../../../shared/components/register/Register";
import {IRegisterRequest} from "../../../../../shared/models/register-request.model";
import useRegister from "../../../../../shared/hooks/useRegister";
import {useToasts} from "../../../../../shared/providers/toast-provider";
import styles from "./Register.module.scss";
const RegisterPage: React.FC = () => {
    const router = useNavigate();
    const [b65File, setB64File] = useState<string>();
    const {register, response, error} = useRegister();
    const {addToast} = useToasts();
    const submit = (username: string, key: string) => {
        const userReg: IRegisterRequest = {
            username: username,
            stringKey: key,
        }
        if (!!b65File) {
            userReg.stringFile = b65File;
        }

        if (userReg && (key || b65File)) {
            register(userReg);
        }
    };

    const onFileUpload = (file: Blob) => {
        const fReader = new FileReader();
        fReader.onload = () => {
            const res: string = fReader.result as string;
            const splitted: string[] = res.split(",")
            setB64File(splitted[1]);
        }
        fReader.readAsDataURL(file);
    }

    useEffect(() => {
        if (!!response) {
            addToast({
                type: "success",
                title: "Success",
                autoClose: true,
                description: "Register successfully. Please sign up."
            })
            router("/initialize-login");
        }
        if (!!error) {
            addToast({
                type: "error",
                description: error.message,
                autoClose: true,
                title: "Error"
            })
        }
    }, [response, error]);
    return (
        <section className="full-screen">
            <Centered>

            <div className={styles["sign-up-container"]}>

                <Register submit={submit}  onFileUpload={onFileUpload}/>
            </div>
            </Centered>

        </section>
    )
}
export default RegisterPage;
