import React from 'react';

interface NewChatProps {
    response: {
        userToken: string
    };
}

const NewChat: React.FC<NewChatProps> = (response: any) => {
    return (
        <div>
            <p>Kod: {response.userToken}</p>
        </div>
    )
}

export default NewChat;