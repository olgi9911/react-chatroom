class Message extends React.Component {
    constructor(props) {
        super(props);
         if (!firebase.apps.length) {
            this.app = firebase.initializeApp(config);
        } else {
            this.app = firebase.app();
        }
    }

    render() {
        const {profileUrl, type, name, text, timeTag} = this.props;
        return (
            <li class={type}>
                <img class="profile" src={this.props.profileUrl}/>
                <div class="message">
                    <div class="name">{name}</div>
                    <div class="text">{text}</div>
                    <div id="timeTag">{timeTag}</div>
                </div>
            </li>
        )
    }
}

export default Message;