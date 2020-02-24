import { Config } from './config.js';
import { Api } from './handleApi.js';
import { CreateItems } from './createItems'
import '../sass/login.scss';
class Login {
    constructor() {
        this.config = new Config();
        this.url = this.config.url + '/auth/';
        this.form = document.querySelector('#loginForm');
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.form.addEventListener('submit', this.handleLogin.bind(this))
        this.api = new Api();
        this.createItems = new CreateItems();
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
                //console.log(response)
                if (response.status === 200) return response.json();
                if (response.status === 401) {
                    this.createItems.createMessage('nepoprawny login lub hasło');
                };
            })
            .then(response => {
                const { accessToken, refreshToken } = response.token;
                if (accessToken === undefined && refreshToken === undefined) return this.createItems.createMessage('nepoprawny login lub hasło');
                this.api.setCookie("accessToken", accessToken, 600);
                this.api.setCookie("refreshToken", refreshToken, 10800);
                if (response.permission === 'admin') return window.location.replace("/admin");
                window.location.replace("/?message=zalogowano");
            })
            .catch(e => {
                this.createItems.createMessage();
            })
    }
}


const x = new Login()