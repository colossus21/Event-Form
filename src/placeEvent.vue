<template>
    <div>
        <b-container id="formContainer" v-if="!confirmed">

            <b-progress :value="progress" variant="success" class="mb-2"></b-progress>
            <b-container id="formContainer" v-if="progress==0">
                <h6>Event Name:</h6>
                <b-form-input v-model="eventName"
                              type="text"
                              placeholder="Name your event"
                              lazy-formatter></b-form-input>

                <h6>Select a Date:</h6>
                <b-form-input v-model="eventDate"
                              type="date"
                              placeholder="Select a date for your event"
                              lazy-formatter></b-form-input>
                <h6>Start Time:</h6>
                <b-form-input v-model="startTime"
                              type="time"
                              placeholder="Select start time for your event"
                              lazy-formatter></b-form-input>
                <h6>End Time:</h6>
                <b-form-input v-model="endTime"
                              type="time"
                              placeholder="When is your event going to end"
                              lazy-formatter></b-form-input>

            </b-container>

            <b-container id="formContainer" v-if="progress==25">
                <h6>Location:</h6>
                <hr>
                <h6>Select Venue:</h6>
                <b-form-radio-group id="venueInput"
                                    buttons
                                    button-variant="outline-primary"
                                    size="md"
                                    v-model="selectedVenue"
                                    :options="venues"
                                    name="venueInput"
                                    @change="selectedHall==0"
                />
                <h6>Select Room/Hall:</h6>
                <b-form-radio-group id="hallInput"
                                    buttons
                                    button-variant="outline-primary"
                                    size="sm"
                                    v-model="selectedHall"
                                    :options="venues[selectedVenue].halls"
                                    name="hallInput" />
                <hr>
                <b-list-group>
                    <b-list-group-item>
                        <strong>Capacity:</strong> {{venues[selectedVenue].halls[selectedHall].capacity}}
                    </b-list-group-item>
                    <b-list-group-item>
                        <strong>Size:</strong> {{venues[selectedVenue].halls[selectedHall].hourly}} Square Feet
                    </b-list-group-item>
                    <b-list-group-item>
                        <strong>Base Venue Fee:</strong> Tk. {{venues[selectedVenue].halls[selectedHall].base}}
                    </b-list-group-item>
                    <b-list-group-item>
                        <strong>Venue Fee Per Hour:</strong> Tk. {{venues[selectedVenue].halls[selectedHall].hourly}}
                    </b-list-group-item>

                </b-list-group>



            </b-container>
            <b-container id="formContainer" v-if="progress==50">

                <b-form-group id="eventTheme" label="Event Theme:">
                    <b-form-select id="eventTheme"
                                   :options="eventThemes"
                                   required
                                   v-model="eventTheme">
                    </b-form-select>
                </b-form-group>
                    <b-form-textarea id="eventDetails"
                                     v-model="eventDetails"
                                     placeholder="How do you want us to decorate the event?"
                                     :rows="3"
                                     :max-rows="6">
                    </b-form-textarea>



            </b-container>
            <b-container id="formContainer" v-if="progress==75">
                <h6>Services with hourly rates:</h6>
                <b-form-checkbox-group stacked v-model="selectedServices" name="servicesHourly" :options="services"></b-form-checkbox-group>
            </b-container>
            <b-container id="formContainer" v-if="progress==100">
                <b-alert v-for="m in msg" show variant="secondary">{{m}}</b-alert>
                <b-alert show variant="primary">{{'Total Cost: '+(this.venueCost+this.serviceCost+this.themeCost)}}</b-alert>
            </b-container>

            <b-alert show variant="danger" v-if="err.length>0" v-for="e in err">{{e}}</b-alert>
            <b-btn :class="['mt-3', {'hide':progress<perSlideProgress}]" variant="outline-primary" @click="prev()">Previous</b-btn>
            <b-btn class="mt-3" style="float:right; display:block;" variant="outline-primary"  @click="next()">{{progress==75?'Calculate':progress==100?'Confirm Event':'Next'}}</b-btn>

        </b-container>
        <b-container style="margin-top: 5%" v-if="confirmed">
            <b-alert show variant="success">
                <h4 class="alert-heading">You have created the event!</h4>
                <p>
                    Once we review your event placement request, we will call you as soon as possible.
                    Meanwhile, you can check your placed event in "My Event" section.

                </p>
                <hr>
                <p class="mb-0">
                    For any queries call - 01723334442
                </p>
            </b-alert>
        </b-container>

    </div>
</template>

<script>
    import Firebase from 'firebase'
    export default {
        data () {
            return {
                formData: {
                    eventName:'',
                    eventDate:'',
                },
                isInvalid: true,
                msg:[],
                err:[],
                progress: 0,
                perSlideProgress: 25,
                venues: [
                    { text: 'Hotel Lakeshore', value: '0', halls:
                        [
                            {text:'La-Vita Banquet Hall', value:0, base:8000, size:3350, capacity:500, hourly:5000},
                            {text:'Alap Meeting Room', value:1, base:5000, size:300 , capacity:80, hourly:1500},
                            {text:'Shamadhan Banquet Hall', value:2, base:5000, size:1221, capacity:120, hourly:2800}
                        ]
                    },
                    { text: 'Radisson Blu', value: '1', halls:
                        [
                            {text:'The Inis Mór Ballroom', value:0, base:50000, size:8900, capacity:990, hourly:8000},
                            {text:'Veranda Lounge Boardroom', value:1, base:35000, size:3520 , capacity:230, hourly:7000}
                        ]
                    },
                    { text: 'Le Meridien', value: '2', halls:
                        [
                            {text:'Shubeccha Hall', value:0, base:30000, size:2100, capacity:220, hourly:3500},
                            {text:'Executive Meeting Room', value:1, base:50000, size:1200 , capacity:80, hourly:2500},
                            {text:'Central Hall', value:2, base:45000, size:9100, capacity:1050, hourly:5000},
                            {text:'Rooftop (Full)', value:3, base:75000, size:9150 , capacity:1100, hourly:1200}
                        ]
                    },
                    { text: 'The Westin', value: '3', halls:
                        [
                            {text:'Cadillac Detroit', value:0, base:60000, size:7579, capacity:860, hourly:5500},
                            {text:'Woodward Ballroom', value:1, base:52000, size:6900 , capacity:665, hourly:7800},
                            {text:'Esquire Room', value:2, base:12000, size:946, capacity:75, hourly:950}
                        ]
                    },
                    { text: 'Dhaka Regency', value: '4', halls:
                        [
                            {text:'Royal Suite', value:0, base:11000, size:5350, capacity:500 , hourly:1300},
                            {text:'Regency Premium', value:1, base:5000, size:1331 , capacity:120, hourly:1500},
                            {text:'Luxury Studio', value:2, base:15000, size:4600, capacity:380, hourly:1500}
                        ]
                    },
                    { text: 'Mainland China', value: '5', halls:
                        [
                            {text:'Whole Floor', value:0, base:10000, size:6250, capacity:580, hourly:1000},
                            {text:'Block A', value:1, base:6000, size:2120, capacity:250, hourly:1000},
                            {text:'Block B', value:2, base:5700, size:1785, capacity:195, hourly:1000}
                        ]
                    }
                ],
                services: [
                    {text: 'Catering [Tk. 5000/Hour]', value: 0, type:'hourly', price: 5000},
                    {text: 'Security [Tk. 2500/Hour]', value: 1, type:'hourly', price: 2500},
                    {text: 'Announcer [Tk. 8000/Hour]', value: 2, type:'hourly', price: 8000},
                    {text: 'Photographer Package - 1 (120 Photos) [Tk. 10000]', value: 3, type:'Fixed', price: 10000},
                    {text: 'Photographer Package - 2 (250 Photos) [Tk. 15000]', value: 4, type:'Fixed', price: 15000},
                    {text: 'Party Band - 5 Songs by The Underground [Tk.20000]', value: 5, type:'Fixed', price: 20000},
                    {text: 'Party Band - 10 Songs by Wasi and Friends [Tk.35000]', value: 6, type:'Fixed', price: 35000}
                ],
                selectedServices: [

                ],
                eventThemes:[
                    {text:'Wedding',value:0,cost:5500},
                    {text:'Party/Anniversary',value:1,cost:1000},
                    {text:'Seminar',value:1,cost:7500},
                    {text:'Conference/Inaguration Ceremony',value:1,cost:1000},
                    {text:'Business Meeting',value:1,cost:6600},
                    {text:'Tradeshow',value:1,cost:10000},
                ],
                selectedVenue:0,
                selectedHall:0,
                startTime:'',
                endTime:'',
                eventName:'',
                eventDate:'',
                eventTheme:'',
                eventDetails:'',
                confirmed: false,
                totalHours:0,
                venueCost:0,
                themeCost:0,
                serviceCost:0
            }
        },
        methods: {
            next() {
                this.err = [];
                if(this.progress==100) {
                    this.msg = []
                    this.confirmed = true;
                    this.populateDatabase();
                    this.placeEvent();
                }
                if(this.progress==75) {
                    for(var i = 0; i<this.selectedServices.length; i++) {
                        if(this.services[this.selectedServices[i]].type=='hourly') {
                            this.serviceCost += this.services[this.selectedServices[i]].price * this.totalHours;
                            this.msg.push('Hourly Service: '+this.services[this.selectedServices[i]].text+ ', Fee: ' + this.services[this.selectedServices[i]].price);
                        } else {
                            this.serviceCost += this.services[this.selectedServices[i]].price;
                            this.msg.push('Fixed Service: '+this.services[this.selectedServices[i]].text+ ', Fee: ' + this.services[this.selectedServices[i]].price);
                        }
                    }
                    if(this.err.length==0) {
                        this.progress += 25;
                    }
                    console.log("Service Cost: "+this.serviceCost)
                }
                if(this.progress==50) {
                    this.themeCost = this.eventThemes[this.eventTheme].cost;
                    this.msg.push('Theme decoration and other fees: '+ this.eventThemes[this.eventTheme].cost);
                    if(this.err.length==0) {
                        this.progress += 25;
                    }
                    console.log("Theme Cost: "+this.themeCost)
                }
                if(this.progress==25) {
                    this.venueCost = this.venues[this.selectedVenue].halls[this.selectedHall].base + (this.totalHours * this.venues[this.selectedVenue].halls[this.selectedHall].hourly);
                    this.msg.push('Calculated cost from venues: '+this.venueCost);
                    if(this.err.length==0) {
                        this.progress += 25;
                    }
                    console.log("Venue Cost: "+this.venueCost)
                }
                if(this.progress==0) {
                    if(this.eventName=='') {
                        this.err.push('Type in event name')
                    }
                    if(this.eventDate=='') {
                        this.err.push('Select a date for your event')
                    }
                    if(this.eventDate!='') {
                        let dnow = new Date()
                        let devt = new Date(this.eventDate)
                        if(devt<dnow)
                            this.err.push('You must place an event prior to today')
                    }
                    if(this.startTime.split(":")[0]>this.endTime.split(":")[0]) {
                        this.err.push('Start time cannot be less than End time')
                    }
                    if(this.endTime.split(":")[0]-this.startTime.split(":")[0]<2) {
                        this.err.push('Duration of event should be at least 2 hours')
                    }
                    if(this.err.length==0) {
                        this.progress += 25;
                        this.calcTime();
                    }
//
                }

            },
            prev() {
                if(this.progress>0)
                    this.progress -= this.perSlideProgress;
            },
            calcTotal() {

            },
            calcTime() {
                let start = this.startTime.split(":");
                let end = this.endTime.split(":");
                let startDate = new Date(0, 0, 0, start[0], start[1], 0);
                let endDate = new Date(0, 0, 0, end[0], end[1], 0);
                let diff = endDate.getTime() - startDate.getTime();
                let hours = Math.floor(diff / 1000 / 60 / 60);
                this.totalHours = hours;
            },
            populateDatabase() {
//                Firebase.database().ref().child('venues').set(JSON.stringify(this.venues)).then(res=>{console.log(res)})
//                Firebase.database().ref().child('services').set(JSON.stringify(this.services)).then(res=>{console.log(res)})
//                Firebase.database().ref().child('themes').set(JSON.stringify(this.eventThemes)).then(res=>{console.log(res)})
            },
            placeEvent() {
                console.log("Placing event...")
                Firebase.database().ref('events').child(Firebase.auth().currentUser.uid).push(
                    {
                        eventName:this.eventName,
                        eventDate: this.eventDate,
                        startTime: this.startTime,
                        endTime: this.endTime,
                        venueCost: this.venueCost,
                        themeCost: this.themeCost,
                        serviceCost: this.serviceCost,
                        eventDetails: this.eventDetails,
                        status: 'Pending',
                        selectedVenue: this.selectedVenue,
                        selectedHall: this.selectedHall,
                        selectedServices: this.selectedServices
                    }
                ).then(data=>console.log(data))
                    .catch(data=>console.log(data))
            }
        },
        computed: {

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
    .hide {
        visibility: hidden;
    }
</style>
