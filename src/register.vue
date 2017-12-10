<template>
    <div>
        <b-container id="formContainer" v-if="!isSignedUp">
            <h6>Name:</h6>
            <b-form-input v-model="name"
                          type="text"
                          placeholder="What should we call you?"
                          lazy-formatter></b-form-input>

            <h6>Email:</h6>
            <b-form-input v-model="email"
                          type="text"
                          placeholder="You will use your email to login"
                          lazy-formatter></b-form-input>
            <h6>Phone:</h6>
            <b-form-input v-model="phone"
                          type="text"
                          placeholder="You will be contacted as soon you place an event"
                          lazy-formatter></b-form-input>
            <h6>Address:</h6>
            <b-form-input v-model="address"
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

            <b-btn class="mt-3" variant="outline-primary" block @click="onSignup()">Signup</b-btn>
        </b-container>
        <b-container id="formContainer" v-if="isSignedUp">
            <h1>You can now login to your account and start creating events!!</h1>
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
                isSignedUp: false
            }
        },
        methods: {
            onSignup(){
                this.msg=[];
                this.checkInvalid();
                console.log("Checking if invalid: " +this.isInvalid)
                if(!this.isInvalid) {
                    console.log("Its working")
                    Firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then((user)=>{
                        console.log("User created with email!!");
                        const id = user.uid;
                        this.setUser(id);
                    })
                }
            },
            checkInvalid() {
                if(this.password.length<6) {
                    this.msg.push('Your password must contain at least 6 letters')
                    this.isInvalid = true;
                }
                if(this.name==''||this.email==''||this.phone==''||this.address==''||this.password==''||this.confirm_password==''){
                    this.msg.push('You must fill up all the fields')
                    this.isInvalid = true;
                }
                if(this.password.length>6 && !(this.name==''||this.email==''||this.phone==''||this.address==''||this.password==''||this.confirm_password=='')){
                    this.isInvalid = false;
                }
            },
            submitOtherInfo() {
                console.log(Firebase.database().ref('UserInfo').child(this.uid).set({name:this.name, phone:this.phone, address:this.address}).then(res=>{this.signedUp()}));
            },
            setUser(uid) {
                this.uid = uid;
                this.submitOtherInfo()
            },
            signedUp() {
                this.isSignedUp = true;
            }
        },
        computed: {
            invalidPassword() {
                return this.password!=this.confirm_password;
            }
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
