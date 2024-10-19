interface MessageProps {
    message: string;
}

const Message: React.FC<MessageProps> = ({message}) => {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: message}}/>
        </div>
    )
}

export default Message;