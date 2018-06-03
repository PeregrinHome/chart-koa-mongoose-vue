<template>
    <div>
        <v-app>
            <v-content>
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <v-flex xs12 sm8 md4>
                            <v-card class="elevation-12">
                                <v-toolbar dark color="primary">
                                    <v-toolbar-title>Регистрация</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <v-btn
                                                icon
                                                large
                                                slot="activator"
                                                to="login"
                                        >
                                            <v-icon large>input</v-icon>
                                        </v-btn>
                                        <span>Войти</span>
                                    </v-tooltip>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field
                                                :disabled="disabledForm"
                                                :error-messages="usernameErrors"
                                                required
                                                name="username"
                                                label="Имя"
                                                type="text"
                                                v-model="username"
                                        ></v-text-field>
                                        <v-text-field
                                                :disabled="disabledForm"
                                                :error-messages="emailErrors"
                                                required
                                                name="email"
                                                label="Email"
                                                type="email"
                                                v-model="email"
                                        ></v-text-field>
                                        <v-text-field
                                                :disabled="disabledForm"
                                                :error-messages="passwordErrors"
                                                required
                                                name="password"
                                                label="Пароль"
                                                id="password"
                                                type="password"
                                                v-model="password"
                                        ></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-progress-circular class="reg__preload" :class="cssPreloader" indeterminate
                                                         color="primary"></v-progress-circular>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="disabledForm" color="primary" @click="onRegistration">
                                        Registration
                                    </v-btn>
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
    import {config} from "../../config";
    import {validationMixin} from 'vuelidate';
    import {required, minLength, email} from 'vuelidate/lib/validators';


    export default {
        name: "registration",
        mixins: [validationMixin],
        validations: {
            username: { required },
            email: { required, email },
            password: { required, minLength: minLength(6),
            validatePassword: function (value) {
                return config.patterns.password.test(value);
            }
            },
        },
        data: () => {
            return {
                disabledForm: false,
                username: '',
                email: '',
                password: '',
                snackbar: false,
                snackbarMessage: '',
                snackbarColor: 'deep-orange darken-3'
            };
        },
        computed: {
            cssPreloader() {
                return {
                    active: this.disabledForm
                }
            },
            usernameErrors() {
                let errors = [];
                if (!this.$v.username.$dirty) return errors;
                !this.$v.username.required && errors.push('Имя пользователя не должен быть пустым.');
                return errors;
            },
            emailErrors() {
                let errors = [];
                if (!this.$v.email.$dirty) return errors;
                !this.$v.email.email && errors.push('Укажите, пожалуйста, корректный Email.');
                !this.$v.email.required && errors.push('E-mail пользователя не должен быть пустым.');
                return errors;
            },
            passwordErrors() {
                let errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.required && errors.push('Пароль пользователя не должен быть пустым.');
                !this.$v.password.minLength && errors.push('Длинна пароля должна быть 6 и более символов.');
                !this.$v.password.validatePassword && errors.push('Пароль должен состоять из букв в верхнем и нижнем регистре, цифр и специальных знаков.');
                return errors;
            }
        },
        methods: {
            async onRegistration() {
                this.$v.$touch();
                if(!this.$v.$invalid){
                    this.disabledForm = true;
                    let results = await this.$store.dispatch('userStore/registration', {
                        username: this.username,
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
                            setTimeout(()=>{
                                 this.$router.push('login');
                            }, 2000);
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
    }
</script>

<style scoped>
    .reg__preload {
        opacity: 0;
        transition: opacity .2s ease-in;
    }

    .reg__preload.active {
        opacity: 1;
    }
</style>