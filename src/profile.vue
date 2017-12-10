<template>
    <div>
        <b-container id="formContainer">
            <h6>Name:</h6>
            <b-form-input v-model="form.name"
                          type="text"
                          placeholder="What should we call you?"
                          lazy-formatter></b-form-input>

            <h6>Email:</h6>
            <b-form-input v-model="email"
                          type="text"
                          placeholder="You will use your email to login"
                          lazy-formatter
            ></b-form-input>
            <h6>Phone:</h6>
            <b-form-input v-model="form.phone"
                          type="text"
                          placeholder="You will be contacted as soon you place an event"
                          lazy-formatter></b-form-input>
            <h6>Address:</h6>
            <b-form-input v-model="form.address"
                          type="text"
                          placeholder="We provide faster support if we know your address"
                          lazy-formatter></b-form-input>
            <h6>Password:</h6>
            <b-form-input v-model="password"
                          type="password"
                          placeholder="We provide faster support if we know your address"
                          lazy-formatter></b-form-input>
            <h6>Confirm Password:</h6>
            <b-form-input v-model="confirm_password"
                          type="password"
                          placeholder="We provide faster support if we know your address"
                          lazy-formatter></b-form-input>
            <div id="invalid" v-if="invalidPassword">Your password does not match</div>
            <div id="invalid" v-if="isInvalid" v-for="m in msg">{{m}}</div>

            <b-btn class="mt-3" variant="outline-primary" block @click="onSignup">Update</b-btn>
        </b-container>
        <b-container id="formContainer" v-if="isSignedUp">
            <b-alert variant="success" show>Successfully Updated!!</b-alert>
        </b-container>


    </div>
</template>

<script>
    import Firebase from 'firebase'
    export default {
        data () {
            return {
                name:'',
                email:'',
                phone:'',
                address:'',
                password:'',
                confirm_password:'',
                isInvalid: true,
                msg:[],
                uid:'x',
                isSignedUp: false,
                form:{name:'',phone:'',address:''}
            }
        },
        methods: {
            onSignup(){
                this.msg=[];
                this.checkInvalid();
                if(!this.isInvalid) {
                    console.log("Its working")
                    Firebase.auth().currentUser.updatePassword(this.password)
                        .then(data=>{
                            this.submitOtherInfo()
                            console.log(data)
                        })
                        .catch(error=>{
                            console.log(error.message)
                            this.msg.push(error.message)
                        });
                }
            },
            checkInvalid() {
                if(this.password.length<6) {
                    this.msg.push('Your password must contain at least 6 letters')
                    this.isInvalid = true;
                }
                if(this.form.name==''||this.email==''||this.form.phone==''||this.form.address==''||this.password==''||this.confirm_password==''){
                    this.msg.push('You must fill up all the fields')
                    this.isInvalid = true;
                }
                if(this.password.length>6 && !(this.form.name==''||this.email==''||this.form.phone==''||this.form.address==''||this.password==''||this.confirm_password=='')){
                    this.isInvalid = false;
                }
            },
            submitOtherInfo() {
                Firebase.database().ref('UserInfo').child(this.uid).update(this.form).then(res=>{this.signedUp()});
            },
            setUser(uid) {
                this.uid = uid;
                this.submitOtherInfo()
            },
            signedUp() {
                this.isSignedUp = true;
            },
            checkAuthState() {
                console.log("Auth State")
                Firebase.auth().onAuthStateChanged(
                    user => {
                        if(user) {
                            this.isLogged = true;
                            this.uid = user.uid;
                            this.getProfileInfo();
                        } else {
                            this.$router.push('/');
                        }
                    }
                )
            },
            getProfileInfo() {
                console.log(this.uid);
                Firebase.database().ref('UserInfo').child(this.uid).once('value')
                    .then(data=>
                        {
                            this.form = JSON.stringify(data)
                            this.form = JSON.parse(this.form);
                        }
                    );
                this.email = Firebase.auth().currentUser.email;
            }
        },
        computed: {
            invalidPassword() {
                return this.password!=this.confirm_password;
            }
        },
        created() {
            this.isLogged;
            this.checkAuthState();
        }
    }
</script>

<style>
    #invalid {
        color: red;
    }
    #formContainer {
        margin-top: 20px;
        border-radius: 10px;
        border: 3px solid whitesmoke;
        padding: 10px;
    }
    h6 {
        margin-top: 10px;
    }
</style>
