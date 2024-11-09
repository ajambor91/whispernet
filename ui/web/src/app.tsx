import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "@/app/pages/home/page";
import ChatWaiting from "@/app/pages/waiting/page";
import ChatJoining from "@/app/pages/join/page";
import ChatWaitingJoin from "@/app/pages/waiting-join/page";
import RootLayout from "@/app/layout";
import Chat from "@/app/pages/chat/page";

const App: React.FC = () => (
    <RootLayout>

        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/waiting" element={<ChatWaiting />}/>
                <Route path="/join" element={<ChatJoining />}/>
                <Route path="/waiting-join" element={<ChatWaitingJoin />}/>
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    </RootLayout>

)
export default App