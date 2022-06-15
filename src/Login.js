import config from './config';
class Login extends React.Component {
    constructor(props) {
        super(props);
         if (!firebase.apps.length) {
            this.app = firebase.initializeApp(config);
        } else {
            this.app = firebase.app();
        }
    }

    componentDidMount() {
        // Login with Email/Password

        var txtEmail = document.getElementById('inputEmail');
        var txtPassword = document.getElementById('inputPassword');
        var txtName = document.getElementById('inputName');
        var btnLogin = document.getElementById('btnLogin');
        var btnGoogle = document.getElementById('btnGoogle');
        var btnSignUp = document.getElementById('btnSignUp');

        btnSignUp.addEventListener('click', function(e) {
            /// TODO 2: Add email signup button event
            ///         1. Get user input email and password to signup
            ///         2. Show success message by "create_alert()" and clean input field
            ///         3. Show error message by "create_alert()" and clean input field
            var email = txtEmail.value;
            var password = txtPassword.value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function() {
                const uid = firebase.auth().currentUser.uid;
                firebase.database().ref("userData/" + uid).set({
                    email: txtEmail.value,
                    displayName: txtName.value,
                    profileUrl: "https://firebasestorage.googleapis.com/v0/b/midterm-chatroom-f762a.appspot.com/o/profile%2Fuser.png?alt=media&token=562a1b04-a54f-4124-a3e1-cc971ed4b553"
                }).then(() => {
                    window.location.replace('./#');
                });
                txtEmail.value = ""; txtPassword.value = "";
        }).catch(function(error) {alert(error.message);;
            txtEmail.value = ""; txtPassword.value = "";});
        });

        btnLogin.addEventListener('click', function(e) {
            /// TODO 3: Add email login button event
            ///         1. Get user input email and password to login
            ///         2. Back to index.html when login success
            ///         3. Show error message by "create_alert()" and clean input field
            var email = txtEmail.value;
            var password = txtPassword.value;
            firebase.auth().signInWithEmailAndPassword(email, password).then(
                function() {
                    
                    window.location.replace('./#');
                }
                ).catch(function(error) {
                    alert(error.message);
                    txtEmail.value = ""; txtPassword.value = "";});
        });

        var provider = new firebase.auth.GoogleAuthProvider();

        btnGoogle.addEventListener('click', function(e) {
            /// TODO 4: Add google login button event
            ///         1. Use popup function to login google
            ///         2. Back to index.html when login success
            ///         3. Show error message by "create_alert()"
            firebase.auth().signInWithPopup(provider).then(function (result) {
                const uid = firebase.auth().currentUser.uid;
                firebase.database().ref("userData/" + uid).once("value", function(snapshot) {
                    if(!snapshot.exists()) {
                        firebase.database().ref("userData/" + uid).set({
                        email: firebase.auth().currentUser.email,
                        displayName: firebase.auth().currentUser.email.split('@')[0],
                        profileUrl: "https://firebasestorage.googleapis.com/v0/b/midterm-chatroom-f762a.appspot.com/o/profile%2Fuser.png?alt=media&token=562a1b04-a54f-4124-a3e1-cc971ed4b553"
                        }).then(() => {
                            window.location.replace('./#');
                        });
                    } else {
                        window.location.replace('./#');
                    }
                });
                    
            }).catch(function(error) {alert(error.message);});

        });

        // Execute a function when the user releases a key on the keyboard
        txtPassword.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            btnLogin.click();
        }
        });
    }

    render() {
        //const { handleName} = this.props;
        return(
            <div class="form-signin">
                <h1 class="h3 mb-3 font-weight-normal">Please sign in/register</h1>
                <label for="inputEmail" class="sr-only">displayName</label>
                <input type="name" id="inputName" class="form-control" placeholder="Name (register only)" required autoFocus/>
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autoFocus/>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required/>
                <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"/> Remember me
                </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" id="btnLogin">Sign in</button>
                <button class="btn btn-lg btn-info btn-block" id="btnGoogle">Sign in with Google</button>
                <button class="btn btn-lg btn-secondary btn-block" id="btnSignUp">New account</button>
            </div>
        )
    }
}

export default Login;