import Message from './Message';

class ChatBlock extends React.Component {
    render() {
        const {messageList} = this.props;

        return (
            <div id="chatBlock" >
                <ul id="messageList">
                    {messageList.map((item, index)=> {
                        return (<Message
                            profileUrl = {item.profileUrl}
                            name = {item.name}
                            type = {item.type}
                            text = {item.text}
                            timeTag = {item.timeTag}
                        />)
                    })}
                </ul>
            </div>
        )
    }
}

export default ChatBlock;