import React, {useEffect, useState} from "react";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import { useNavigate } from "react-router-dom";
import Login from "../../../../../shared/components/login/Login";
import {useAppSelector} from "../../../../../shared/store/store";
import {ILoginState} from "../../../../../shared/slices/login.slice";
import useLogin from "../../../../../shared/hooks/useLogin";
import {useDispatch} from "react-redux";
import {setLoginData} from "../../../../../shared/slices/is-login.slize";
import {useToasts} from "../../../../../shared/providers/toast-provider";

const LoginPage: React.FC = () => {
    const router = useNavigate();
    const [b65File, setB64File] = useState<string>();
    const {login, response, error} = useLogin();
    const loginState: ILoginState = useAppSelector(state => state?.loginState);
    const dispatch = useDispatch();
    const {addToast} = useToasts()
    const submit = () => {
        if (!!b65File) {
            login({
                username: loginState.username,
                message: loginState.message,
                signedMessageFile: b65File
            });
        }
    };
    const submitSigned = (signedMessage: string) => {
        if (!!signedMessage) {
            login({
                username: loginState.username,
                message: loginState.message,
                signedMessage: signedMessage
            });
        }
    };
    useEffect(() => {
        if (response){
            localStorage.setItem("userData", JSON.stringify(response))
            dispatch(setLoginData({
                isLogin: true,
                ...response
            }));
            addToast({
                type: "success",
                title: "Success",
                autoClose: true,
                description: "Login succeed"
            })
            router("/");
        }
        if (error) {
            addToast({
                type: "error",
                title: "Error",
                description: error.message,
                autoClose: true
            })
        }
    }, [response, error]);
    const onFileUpload = (file: Blob) => {
        const fReader = new FileReader();
        fReader.onload = () => {
            const res: string = fReader.result as string;
            const splitted: string[] = res.split(",")
            setB64File(splitted[1]);
        }
        fReader.readAsDataURL(file);
    }


    return (
        <section className="full-screen">
            <Centered>
                <Login loginState={loginState} submit={submit} submitSigned={submitSigned}  onFileUpload={onFileUpload}/>
            </Centered>
        </section>
    )
}

export default LoginPage;
