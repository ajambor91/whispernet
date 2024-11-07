import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "@/app/home/page";
import ChatWaiting from "@/app/waiting/page";
import ChatJoining from "@/app/join/page";
import ChatWaitingJoin from "@/app/waiting-join/page";
import RootLayout from "@/app/layout";

const App: React.FC = () => (
    <RootLayout>

        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/waiting" element={<ChatWaiting />}/>
                <Route path="/join" element={<ChatJoining />}/>
                <Route path="/waiting-join" element={<ChatWaitingJoin />}/>
            </Routes>
        </Router>
    </RootLayout>

)
export default App