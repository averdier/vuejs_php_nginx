<template>
    <v-layout fill-height align-center justify-center style="width: 100%;">
        <v-flex xs11 sm8 md4 lg3>

            <v-form ref="loginForm" @submit="loginClient">
                <v-text-field
                    prepend-icon="person"
                    name="username"
                    label="Identifiant"
                    type="text"
                    v-model="loginForm.username"
                    :rules="[loginForm.rules.required]"
                    :disabled="status === 'loading'"
                    required>
                </v-text-field>

                <v-text-field
                    prepend-icon="lock"
                    name="password"
                    label="Mot de passe"
                    type="password"
                    v-model="loginForm.password"
                    :rules="[loginForm.rules.required]"
                    :disabled="status === 'loading'"
                    required>
                </v-text-field>

                <div class="text-xs-center">
                    <v-btn type="submit" :loading="status === 'loading'">Connexion</v-btn>
                </div>

            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data: () => ({
        loginForm: {
            username: null,
            password: null,
            rules: {
                required: value => !!value || 'Requis'
            },
            error: null
        }
    }),
    computed: mapState({
        status: state => state.auth.status
    }),

    methods: {
        loginClient (e) {
            e.preventDefault()

            if (this.$refs.loginForm.validate()) {
                this.$store.dispatch('auth/login', this.loginForm)
                .then(() => {
                    this.$router.push('/')
                })
                .catch(error => {
                    this.loginForm.error = 'Une erreur est survenue, veuillez réessayer plus tard.'
                })
            }
        }
    }
}
</script>
