<template>
    <div>

        <br>

        <b-container class="contentBox">

            <b-card-group columns v-for="n in index.length">
                <b-card border-variant="primary"
                        :header="form[index[n-1]].eventName"
                        header-bg-variant="primary"
                        header-text-variant="white"
                        align="center"
                >
                    <p class="card-text">
                        <i>{{form[index[n-1]].eventDate}}</i> <br>
                        <i>{{form[index[n-1]].startTime}}-{{form[index[n-1]].endTime}} (24-hour)</i> <br>
                        Venue: {{getVenueHall(form[index[n-1]].selectedVenue,form[index[n-1]].selectedHall)[0]}}  <br>
                        Hall: {{getVenueHall(form[index[n-1]].selectedVenue,form[index[n-1]].selectedHall)[1]}} <br>
                        <strong> Status: {{form[index[n-1]].status}} </strong>
                    </p>
                    <div slot="footer">
                        <b-button size="sm" variant="primary" @click="details(form[index[n-1]])">View Details</b-button>
                        <b-button size="sm" variant="danger" @click="deleteModal(index[n-1])">Cancel Event</b-button>
                    </div>
                </b-card>
            </b-card-group>

        </b-container>
        <b-modal ref="confirmModal" hide-footer title="Event Details">
            <div class="d-block text-center">
                <p v-for="m in msg">{{m}}</p>
            </div>
        </b-modal>
        <b-modal ref="deleteModal" hide-footer title="Do you really want to delete the event? It cannot be reverted.">
            <div class="d-block text-center">
                <b-btn class="mt-3" variant="outline-danger" block @click="deleteByID()">Delete</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Firebase from 'firebase'
    export default {
        data () {
            return {
                form: {},
                name: 'WOW',
                index:[],
                venues:[],
                selectedHall: 0,
                selectedVenue: 0,
                msg:[],
                services:[],
                deleteID:''
            }
        },
        methods: {
            deleteModal(obj) {
                this.$refs.deleteModal.show();
                this.deleteID = obj;
            },
            deleteByID() {
                Firebase.database().ref('/events/'+localStorage.getItem('uid')).child(this.deleteID).remove()
                    .then(data => {

                        this.$refs.deleteModal.hide();
                            this.checkEvents();
                        }
                    );
            },
            details(obj) {


                this.msg.push("Venue cost: " + obj.venueCost)
                this.msg.push("Extra fee for theme: " + obj.themeCost)
                this.msg.push("Details you have provided: " + obj.eventDetails)
                console.log(obj.selectedServices)
                console.log(this.services)
                for(var i = 0; i<obj.selectedServices.length; i++) {
                    if (this.services[this.selectedServices[i]].type == 'hourly') {
                        this.msg.push('Hourly Service: ' + this.services[obj.selectedServices[i]].text + ', Fee: ' + this.services[obj.selectedServices[i]].price);
                    } else {
                        this.msg.push('Fixed Service: ' + this.services[obj.selectedServices[i]].text + ', Fee: ' + this.services[obj.selectedServices[i]].price);
                    }
                }
                this.msg.push("Total additional service charge: " + obj.serviceCost)


                this.$refs.confirmModal.show();
            },
            getVenueHall(venue,hall) {
                return [this.venues[venue].text, this.venues[venue].halls[hall].text];
            },
            checkEvents() {
                if(localStorage.getItem('uid')) {
                    Firebase.database().ref('events').child(localStorage.getItem('uid')).once('value')
                        .then(data => {

                                this.form = JSON.parse(JSON.stringify(data))

                            }
                        );
                    Firebase.database().ref('venues').once('value')
                        .then(data => {

                                this.venues = data
                                this.venues = JSON.parse(JSON.stringify(this.venues))
                                this.venues= JSON.parse(this.venues)

                            }
                        );
                    Firebase.database().ref('services').once('value')
                        .then(data => {

                                this.services = data
                                this.services = JSON.parse(JSON.stringify(this.services))
                                this.services= JSON.parse(this.services)

                            }
                        );
                }
            },
            buildIndex() {
                for (var x in this.form) {
                    this.index.push(x);
                }
            }
        },
        watch: {
            form() {
                this.buildIndex();
            }

        },
        created() {
            this.checkEvents()
        }
    }
</script>

<style>


</style>
