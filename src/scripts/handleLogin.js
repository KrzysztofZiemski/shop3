import { Config } from './config.js';
import { Api } from './handleApi.js';

class Login {
    constructor() {
        this.config = new Config();
        this.url = this.config.url + '/auth/';
        this.form = document.querySelector('#loginForm');
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.message = document.querySelector('#message');
        this.form.addEventListener('submit', this.handleLogin.bind(this))
        this.api = new Api();
    }

    handleLogin(e) {
        e.preventDefault();
        const login = this.login.value;
        const password = this.password.value;
        const data = { login, password }
        fetch(this.url + 'login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
        })
            .then(response => {
                if (response.status === 200) return response.json();
                if (response.status === 400) {
                    window.location.replace("./?message=brak dostępu");
                    this.message.innerText = "błędny login lub hasło";

                };
                throw Error(response.status);
            })
            .then(response => {
                const { accessToken, refreshToken } = response;
                if (accessToken === undefined && refreshToken === undefined) return window.location.replace("./?message=brak dostępu");
                this.api.setCookie("accessToken", accessToken, 600);
                this.api.setCookie("refreshToken", refreshToken, 10800);
                window.location.replace("/?message=zalogowano");
            })
            .catch(e => {
                this.message.innerText = `błąd serwera ${e} spróbuj ponownie`
            })
    }
}


const x = new Login()