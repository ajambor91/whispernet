import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import Centered from "../../../../../shared/components/elements/centered/Centered";
import { useNavigate } from "react-router-dom";
import InitializeLogin from "../../../../../shared/components/initialize-login/InitializeLogin";
import useInitLogin from "../../../../../shared/hooks/useInitLogin";
import {setInitialLoginData} from "../../../../../shared/slices/login.slice";
import {useToasts} from "../../../../../shared/providers/toast-provider";
import {IPeerState} from "../../../../../shared/slices/createSession.slice";
import {useAppSelector} from "../../../../../shared/store/store";

const InitializeLoginPage: React.FC = () => {
    const router = useNavigate();
    const {initLogin, response, error} = useInitLogin();
    const dispatch = useDispatch();
    const peerState: IPeerState = useAppSelector(state => state.peerState);
    const {addToast} = useToasts();
    const submit = (login: string) => {
        if (!!login) {
            initLogin({username: login});
        }
    };

    useEffect(() => {
        if (!!response) {
            dispatch(setInitialLoginData(response))
            addToast({
                title: "Success",
                type: "success",
                description: "Initialized login",
                autoClose: true
            })
            router("/login");
        }
        if (error) {
            addToast({
                title: "Error",
                type: "error",
                description: error.message,
                autoClose: true
            })
        }
    }, [response, error]);

    useEffect(() => {
        if (peerState) {
            console.log("peerState", peerState);
        }
    }, [peerState]);
    return (
        <section className="full-screen">
            <Centered>
                <InitializeLogin submit={submit} />
            </Centered>
        </section>
    )
}

export default InitializeLoginPage;
