class Sidebar extends React.Component {
    
    

    render() {
        const {profileUrl, email, name, roomList, changeRoom, createRoom, uploadProfile} = this.props;
        return(
            <div style={{height: '100%'}}>
                <div id="userInfo">
                    <img id="userProfile"  onClick={() => {document.getElementById("file").click()}} src={this.props.profileUrl}/>
                    <input type="file" id="file" onChange={(e)=>{this.props.uploadProfile(e)}} onClick={e => {e.currentTarget.value = null}} style={{display: "none"}}/>
                    <div id="displayName">{name}
                        <div id="email">{email}</div>
                    </div>
                    
                </div>
                <div id="roomListBlock" class="bg-light">
                    <ul id="chatList">
                        {roomList.map((item, index)=> {
                            return (<li onClick={() => {this.props.changeRoom(item)}}>
                            <div class="chatPic"></div>
                            <div class="chatName">{item}</div>
                            </li>)
                        })}
                        
                    </ul>
                </div>
                <div class="col" id="button-block">
                    <button type="button" class="btn btn-secondary btn-lg " id="createButton" onClick={this.props.createRoom}>New Chatroom</button>
                </div>
            </div>
            
        )
    }
}

export default Sidebar;