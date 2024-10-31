import React from 'react';

interface NewChatProps {
    response: {
        userToken: string;
    };
}

declare const NewChat: React.FC<NewChatProps>;
export default NewChat;
