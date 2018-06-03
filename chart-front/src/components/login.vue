<template>
    <div>
        <v-app>
            <v-content>
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <v-flex xs12 sm8 md4>
                            <v-card class="elevation-12">
                                <v-toolbar dark color="primary">
                                    <v-toolbar-title>Войти</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <v-btn
                                                icon
                                                large
                                                slot="activator"
                                                to="registration"
                                        >
                                            <v-icon large>assignment</v-icon>
                                        </v-btn>
                                        <span>Регистрация</span>
                                    </v-tooltip>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field :disabled="disabledForm" v-model="email" prepend-icon="person" name="email" label="Email" type="email"></v-text-field>
                                        <v-text-field :disabled="disabledForm" v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-progress-circular class="login__preload" :class="cssPreloader" indeterminate
                                                         color="primary"></v-progress-circular>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="disabledForm" @click="onLogin" color="primary">Login</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
        <v-snackbar
                :timeout="4000"
                :top="false"
                :bottom="true"
                :right="true"
                :left="false"
                :multi-line="false"
                :vertical="false"
                :color="snackbarColor"
                v-model="snackbar"
        >
            <span v-html="snackbarMessage"></span>

            <v-btn flat color="white" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    export default {
        name: "login",
        data: () => ({
            disabledForm: false,
            drawer: null,
            email: '',
            password: '',
            snackbar: false,
            snackbarMessage: '',
            snackbarColor: 'deep-orange darken-3'
        }),
        computed: {
            cssPreloader() {
                return {
                    active: this.disabledForm
                }
            },
        },
        methods: {
            async onLogin() {
                this.disabledForm = true;
                let results = await this.$store.dispatch('userStore/login', {
                    email: this.email,
                    password: this.password
                });
                if (results) {
                    this.snackbarMessage = '';
                    this.disabledForm = false;
                    for(let key in results.messages){
                        this.snackbarMessage += `${results.messages[key]} `;
                    }
                    if(results.ok){
                        this.snackbarColor = 'green';
                        // setTimeout(()=>{
                        //     this.$router.push('login');
                        // }, 2000);
                    }else{
                        this.snackbarColor = 'deep-orange darken-3';
                    }
                    if(this.snackbarMessage.length > 5){
                        this.snackbar = true;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .login__preload {
        opacity: 0;
        transition: opacity .2s ease-in;
    }

    .login__preload.active {
        opacity: 1;
    }
</style>