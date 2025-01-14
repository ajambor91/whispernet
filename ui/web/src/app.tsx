import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "@/app/pages/home/page";
import ChatWaiting from "@/app/pages/waiting/page";
import ChatJoining from "@/app/pages/join/page";
import ChatWaitingJoin from "@/app/pages/waiting-join/page";
import Chat from "@/app/pages/chat/page";
import AppBar from "../../shared/components/app-bar/AppBar";
import InitializeLoginPage from "@/app/pages/initialize-login/page";
import LoginPage from "@/app/pages/login/page";
import RegisterPage from "@/app/pages/register/page";
import useCheckLogin from "../../shared/hooks/useCheckLogin";
import {useAppSelector} from "../../shared/store/store";
import {IISLoginState, setLoginData} from "../../shared/slices/is-login.slize";
import {useDispatch} from "react-redux";
import {ILoginResponse} from "../../shared/models/login-response.model";

const App: React.FC = () => {
    const {checkLogin, response } = useCheckLogin()
    const dispatch = useDispatch();
    const loginData: IISLoginState =  useAppSelector(state => state?.isLoginState);
    useEffect(() => {
        checkLogin();
    }, []);

    useEffect(() => {
        if (response && response.userAuthorization) {
            const loginDataFromStorage: ILoginResponse = JSON.parse(localStorage.getItem("userData"));
            dispatch(setLoginData({
                isLogin: true,
                ...loginDataFromStorage
            }))        }
    }, [response]);
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="*" element={
                    <>
                        <AppBar isLogin={loginData.isLogin} username={loginData.username} />
                        <Routes>
                        <Route path="/waiting" element={<ChatWaiting />} />
                        <Route path="/join" element={<ChatJoining />} />
                        <Route path="/waiting-join" element={<ChatWaitingJoin />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/initialize-login" element={<InitializeLoginPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        </Routes>
                    </>
                } />
            </Routes>
        </Router>

)};
export default App