import config from './config.js';
import { Api } from './handleApi.js';
import CreateItems from './createItems';
import Cookies from './cookies'
import '../sass/login.scss';


class Login {
    constructor() {
        this.form = document.querySelector('#loginForm');
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.form.addEventListener('submit', this.handleLogin.bind(this))
        this.api = new Api();
    }

    handleLogin(e) {
        e.preventDefault();
        const login = this.login.value;
        const password = this.password.value;
        const data = { login, password }
        fetch(`${config.url}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
        })
            .then(response => {
                if (response.status === 200) return response.json();
                if (response.status === 401) {
                    CreateItems.createMessage('nepoprawny login lub hasło');
                };
            })
            .then(response => {
                const { accessToken, refreshToken } = response.token;
                if (accessToken === undefined && refreshToken === undefined) return CreateItems.createMessage('nepoprawny login lub hasło');
                Cookies.set("accessToken", accessToken, 600);
                Cookies.set("refreshToken", refreshToken, 10800);
                if (response.permission === 'admin') return window.location.replace("/admin");
                window.location.replace("/?message=zalogowano");
            })
            .catch(e => {
                CreateItems.createMessage();
            })
    }
}


const x = new Login()