import Navbar from './src/Navbar'
import Sidebar from './src/Sidebar'
import ChatBlock from './src/ChatBlock'
import Login from './src/Login'
import {Route, Routes, HashRouter} from 'react-router-dom'
//import firebase from 'firebase';
import config from './src/config';
import "./src/index.css"

export class Root extends React.Component {
    constructor(props) {
        super(props);
        
        if (!firebase.apps.length) {
            this.app = firebase.initializeApp(config);
        } else {
            this.app = firebase.app();
        }
        
        this.state = {
            messageList: [],
            blockList: [],
            roomList: ['Public room'],
            currentRoom: 'Public room', 
            email: '',
            name: '',
            profileUrl: '',
            uid: ''
        }
    }

    componentDidMount() { 
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else {
            Notification.requestPermission();
        }
        // Get the input field
        var input = document.getElementById("messageInput");

        // Execute a function when the user releases a key on the keyboard
        input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("button-send").click();
        }
        });

        var handle = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if(user) {
                firebase.database().ref("userData/" + user.uid).once('value').then(function(userInfo) {
                    handle.setState({uid: firebase.auth().currentUser.uid, email: userInfo.val().email, name: userInfo.val().displayName, profileUrl: userInfo.val().profileUrl});
                });

                var login = document.getElementById("login");
                login.addEventListener('click', function() {
                    firebase.auth().signOut();
                    handle.setState({messageList: []});
                    //window.location.replace('./#/login');
                });
                handle.changeRoom(handle.state.currentRoom);
                handle.setRoomList();
                
            } else {
                window.location.replace('./#/login');
            }
        });

        /*firebase.database().ref(handle.state.currentRoom).on('child_added', function(snapshot) {
                    let newItem = [];
                    var data = {
                    email: snapshot.val().email,
                    name: snapshot.val().name,
                    type: (snapshot.val().email == user.email) ? "sent" : "received",
                    text: snapshot.val().text,
                    timeTag: snapshot.val().timeTag,
                    }
                    newItem.push(data);
                    
                    handle.setState({messageList: [...handle.state.messageList, ...newItem]});
        });*/
        
    }

    componentDidUpdate(prevProps) {
        let element = document.getElementById('chatBlock');
            element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    AddMessageSent = () => {
        if(document.getElementById('messageInput').value) {
            let newItem = [];
            var time = new Date().toLocaleTimeString([], {hourCycle: 'h23', hour: '2-digit', minute: "2-digit"});
            var data = {
                profileUrl: this.state.profileUrl,
                email: this.state.email,
                name: this.state.name,
                type: 'sent',
                text: document.getElementById('messageInput').value,
                timeTag: time,
            }
            newItem.push(data);
            firebase.database().ref("room/" + this.state.currentRoom + '/message').push(data);
            //this.setState({messageList: [...this.state.messageList, ...newItem]});
            document.getElementById('messageInput').value = '';
        }
    }

    changeRoom = (roomName) => {
        console.log("ChangeRoom: " + roomName);
        firebase.database().ref("room/" + this.state.currentRoom + "/message").off();
        this.setState({currentRoom: roomName, messageList: []});
        //console.log('success!');
        var handle = this;

        let first_time = true;
        firebase.database().ref("room/" + roomName + "/message").on('child_added', function(snapshot) {
            if(first_time) return;
            console.log("New message");
            let newItem = [];
            var data = {
            profileUrl: snapshot.val().profileUrl, 
            email: snapshot.val().email,
            name: snapshot.val().name,
            type: (snapshot.val().email == handle.state.email) ? "sent" : "received",
            text: snapshot.val().text,
            timeTag: snapshot.val().timeTag,
            }
            if(!handle.state.blockList.includes(snapshot.val().email)) {
                newItem.push(data);
            } else {
                var data = {
                profileUrl: "https://firebasestorage.googleapis.com/v0/b/midterm-chatroom-f762a.appspot.com/o/profile%2Fuser.png?alt=media&token=562a1b04-a54f-4124-a3e1-cc971ed4b553", 
                email: snapshot.val().email,
                name: "Blocked User",
                type: (snapshot.val().email == handle.state.email) ? "sent" : "received",
                text: "Message Hidden",
                timeTag: snapshot.val().timeTag,
                }
                newItem.push(data);
            }
            handle.setState({messageList: [...handle.state.messageList, ...newItem]});
            var notifyConfig = {
                body: snapshot.val().text,
                tag: handle.state.currentRoom
            };
            if (Notification.permission === 'granted') {
                // 使用者同意授權
                var notification = new Notification(snapshot.val().name + " in " + handle.state.currentRoom, notifyConfig); // 建立通知
            }

        });

        firebase.database().ref("userData/" + firebase.auth().currentUser.uid + "/blockList").once('value', function(snapshots) {
            let newList = [];
            snapshots.forEach(function(snapshot) {
                newList.push(snapshot.val().email);
                console.log(snapshot.val().email);
            })
            handle.setState({blockList: newList});
            console.log(handle.state.blockList);
        });
        firebase.database().ref("room/" + roomName + "/message").once('value').then(function(snapshots) {
            first_time = false;
            console.log("first_time");
            let newItem = [];
            snapshots.forEach( function(snapshot) {
                var data = {
                    profileUrl: snapshot.val().profileUrl,  
                    email: snapshot.val().email,
                    name: snapshot.val().name,
                    type: (snapshot.val().email == handle.state.email) ? "sent" : "received",
                    text: snapshot.val().text,
                    timeTag: snapshot.val().timeTag,
                    }
                if(!handle.state.blockList.includes(snapshot.val().email)) {
                    newItem.push(data);
                } else {
                    var data = {
                    profileUrl: "https://firebasestorage.googleapis.com/v0/b/midterm-chatroom-f762a.appspot.com/o/profile%2Fuser.png?alt=media&token=562a1b04-a54f-4124-a3e1-cc971ed4b553", 
                    email: snapshot.val().email,
                    name: "Blocked User",
                    type: (snapshot.val().email == handle.state.email) ? "sent" : "received",
                    text: "Message Hidden",
                    timeTag: snapshot.val().timeTag,
                    }
                    newItem.push(data);
                }
            })  
            handle.setState({messageList: newItem});
        });
    }

    createRoom = () => {
        let name = prompt("Enter room name: ", this.state.name + "'s Chatroom");
        if(name != null) {
            let room = [name];
            this.setState({roomList: [...this.state.roomList, ...room]});
            const time = new Date().getTime(); // room will be ordered by created/joined time.
            firebase.database().ref("userData/" + firebase.auth().currentUser.uid).child("room/" + name).set(time);
            firebase.database().ref("room/" + name + "/member").child(firebase.auth().currentUser.uid).set({email: this.state.email});
        }
        
    } 

    setRoomList = () => {
        let userRef = firebase.database().ref("userData/" + firebase.auth().currentUser.uid + "/room");
        let handle = this;
        
        userRef.on('child_added', function (snapshot) {
            //let userRoomList = [];
            //userRoomList.push(snapshot.key);
            //handle.setState({roomList: [...handle.state.roomList, ...userRoomList]});
            userRef.orderByValue().once('value', function (snapshots) {
                let userRoomList = ["Public room"];
                snapshots.forEach(function (item) {
                    userRoomList.push(item.key);
                });
                handle.setState({roomList: userRoomList});
            });
        });
    }

    addPeople = () => {
        let email = prompt("Enter user's email: ");
        if(email == null || email == '') {
            return;
        } 
        if(email == this.state.email) {
            alert("You're already in the room!")
            return;
        }
        var handle = this;
        let found = false;
        let uid;
        let userDataRef = firebase.database().ref("userData");
        userDataRef.once('value', function(snapshots) {
            snapshots.forEach(function(item) {
                //console.log(item.val().email);
                if(email == item.val().email) {
                    found = true;
                    uid = item.key;
                }
            });
        }).then(function() {
            if(!found) {
                alert("Person not found!");
                return;
            }
            let roomMemberRef = firebase.database().ref("room/" + handle.state.currentRoom + "/member/" + uid);
            roomMemberRef.once('value').then(function(snapshot) {
                if(snapshot.exists()) {
                    alert("The person is already in the room.");
                    return;
                }
                firebase.database().ref("room/" + handle.state.currentRoom + "/member").child(uid).set({email: email});
                const time = new Date().getTime();
                firebase.database().ref("userData/" + uid).child("room/" + handle.state.currentRoom).set(time);
                alert("Person added successfully.");
            })
        })
    }

    blockPeople = () => {
        let email = prompt("Enter user's email: ");
        if(email == null || email == '') {
            return;
        } 
        if(email == this.state.email) {
            alert("You're can not block yourself!")
            return;
        }
        var handle = this;
        let found = false;
        let uid;
        let userDataRef = firebase.database().ref("userData");
        userDataRef.once('value', function(snapshots) {
            snapshots.forEach(function(item) {
                //console.log(item.val().email);
                if(email == item.val().email) {
                    found = true;
                    uid = item.key;
                }
            });
        }).then(function() {
            if(!found) {
                alert("Person not found!");
                return;
            }
            let newAdded = [email];
            firebase.database().ref("userData/" + handle.state.uid + "/blockList").push({"email": email});
            handle.setState({blockList: [...handle.state.blockList, ...newAdded]});
            alert("Person blocked successfully.");

            firebase.database().ref("room/" + handle.state.currentRoom + "/message").once('value').then(function(snapshots) {
                let newItem = [];
                snapshots.forEach( function(snapshot) {
                    var data = {
                        profileUrl: snapshot.val().profileUrl,  
                        email: snapshot.val().email,
                        name: snapshot.val().name,
                        type: (snapshot.val().email == handle.state.email) ? "sent" : "received",
                        text: snapshot.val().text,
                        timeTag: snapshot.val().timeTag,
                        }
                    if(!handle.state.blockList.includes(snapshot.val().email)) {
                        newItem.push(data);
                    } else {
                        var data = {
                        profileUrl: "https://firebasestorage.googleapis.com/v0/b/midterm-chatroom-f762a.appspot.com/o/profile%2Fuser.png?alt=media&token=562a1b04-a54f-4124-a3e1-cc971ed4b553", 
                        email: snapshot.val().email,
                        name: "Blocked User",
                        type: (snapshot.val().email == handle.state.email) ? "sent" : "received",
                        text: "Message Hidden",
                        timeTag: snapshot.val().timeTag,
                        }
                        newItem.push(data);
                    }
                })  
                handle.setState({messageList: newItem});
                console.log("Hi");
            });
        })
    }

    uploadProfile = (e) => {
        let handle = this;
        var file = e.target.files[0];
        firebase.storage().ref("profile").child(firebase.auth().currentUser.uid).put(file).then(function() {
            console.log("Profile uploaded");
            firebase.storage().ref("profile").child(firebase.auth().currentUser.uid).getDownloadURL().then(function(url) {
                handle.setState({profileUrl: url});
                firebase.database().ref("userData/" + handle.state.uid + "/profileUrl").set(url);
            })
        })
        e.value = '';
    }    

    ///
    render() {
        const style = {
            height: '100%',
        }
        return (
            <div style= {{height: '100%'}}>
                <Navbar/>
                <div class="container-fluid" style={{height: 'calc(100% - 56px)'}}>
                    <div class="row flex-grow-1" style={style}>
                        <div class="col-3" style={{ padding: '0px 0px' }}>
                            <Sidebar
                                profileUrl={this.state.profileUrl}
                                email={this.state.email}
                                name={this.state.name}
                                roomList={this.state.roomList}
                                changeRoom={this.changeRoom}
                                createRoom={this.createRoom}
                                uploadProfile={this.uploadProfile}
                            />
                            
                        </div>
                        <div class="col" style={{ padding: '0px 0px'}}>
                            <div id="roomInfo" class="bg-light">
                                <div id="roomName">{this.state.currentRoom}</div>
                                {this.state.currentRoom != "Public room" && 
                                    <button type="button" id="addPeopleBtn" class="btn btn-secondary btn-sm" onClick={this.addPeople}>Add people</button>
                                }
                                <button type="button" id="blockPeopleBtn" class="btn btn-secondary btn-sm" onClick={this.blockPeople}>Block people</button>
                            </div>
                            <ChatBlock
                                
                                messageList={this.state.messageList}
                            />
                            <div class="input-group mt-1" id="input-group">
                                <input type="text" class="form-control" id="messageInput" placeholder="Write message here..."/>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" id="button-send" onClick={this.AddMessageSent}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>  

        );
    }
}
  
ReactDOM.render((
    <HashRouter>
        <Routes>
            <Route path="/" element={<Root/>}/>
            <Route path="/login" element={<Login/>}/>
         </Routes>
    </HashRouter>
    
), document.getElementById("root"));