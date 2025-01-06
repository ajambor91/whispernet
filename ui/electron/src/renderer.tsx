import React from 'react';
import ReactDOM from 'react-dom';
import ChatActions from "@shared/components/chat-actions/ChatActions";

function App() {
    return (
        <div>
            <p>Hello React</p>
            <ChatActions/>
        </div>
    );
}

// Renderuj aplikację React w kontenerze `div#root`
ReactDOM.render(<App/>, document.getElementById('root'));