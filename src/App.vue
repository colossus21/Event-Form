<template>
    <div id="app">
        <b-navbar toggleable="md" type="dark" variant="info">

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-navbar-brand href="#">Event Mangement</b-navbar-brand>

            <b-collapse is-nav id="nav_collapse">

                <b-navbar-nav>
                    <template v-for="m in menu">
                        <b-nav-item :href="m.to">{{m.name}}</b-nav-item>
                    </template>
                    <b-nav-item-dropdown text="Events" v-if="isLogged">
                        <b-dropdown-item href="/add_event">Place an Event</b-dropdown-item>
                        <b-dropdown-item href="/my_events">My Events</b-dropdown-item>
                        <b-dropdown-item href="#">Analytics</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <b-nav-form>
                        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
                        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                    </b-nav-form>



                    <b-nav-item-dropdown right v-if="isLogged">
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                            <em>{{name}}</em>
                        </template>
                        <b-dropdown-item href="/profile">Profile</b-dropdown-item>
                        <b-dropdown-item @click="logout">Signout</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-navbar-nav right v-else>
                        <b-nav-item href="#" @click="showLogin">Login</b-nav-item>
                        <b-nav-item href="/register">Register</b-nav-item>
                    </b-navbar-nav>
                </b-navbar-nav>

            </b-collapse>
        </b-navbar>
        <router-view></router-view>

        <b-modal ref="loginModal" hide-footer title="Login to your account">
            <div class="d-block text-center">
                <b-form-input v-model="email"
                              type="text"
                              placeholder="Email"></b-form-input>
                <b-form-input v-model="password"
                              type="password"
                              placeholder="Password"></b-form-input>
                <div id="invalid">{{msg}}</div>
            </div>
            <b-btn class="mt-3" variant="outline-success" block @click="hideLogin">Login</b-btn>
        </b-modal>
    </div>
</template>

<script>
    import Firebase from 'firebase'
    export default {
        data () {
            return {
                isLogged: false,
                email: '',
                password: '',
                msg:'',
                menu : [
                    {to: '/', name:'Home'}
                ],
                name:''
            }
        },
        methods: {
            showLogin() {
                this.$refs.loginModal.show()
            },
            hideLogin() {
                Firebase.auth().signInWithEmailAndPassword(this.email,this.password)
                    .then(user=>{
                        console.log(user.uid)
                        this.$refs.loginModal.hide()
                    })
                    .catch(error=> {
                        console.log(error)
                        this.msg = error.message
                    });

            },
            checkAuthState() {
                console.log("Auth State")
                Firebase.auth().onAuthStateChanged(
                    user => {
                        if(user) {
                            this.isLogged = true;
                        } else {
                            this.isLogged = false;
                        }
                        Firebase.database().ref('UserInfo').child(Firebase.auth().currentUser.uid).once('value')
                            .then(data=>
                                {
                                    let form = JSON.stringify(data)
                                    form = JSON.parse(form);
                                    this.name = form.name;
                                    console.log(form.name);
                                    localStorage.setItem('uid',Firebase.auth().currentUser.uid)
                                }
                            );
                    }
                )

            },
            logout() {
                localStorage.removeItem('uid')
                this.$router.push('/');
                Firebase.auth().signOut();
            }
        },
        created() {
            this.checkAuthState();
        }
    }
</script>

<style>

</style>
