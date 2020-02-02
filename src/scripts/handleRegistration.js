import { Config } from './config.js';

class Registration {
    constructor() {
        this.form = document.querySelector('#registration');
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.passwordConfirm = document.querySelector('#passwordConfirm');
        this.mail = document.querySelector('#mail');
        this.message = document.querySelector('#message');
        this.form.addEventListener('submit', this.register.bind(this));
        this.config = new Config();
        this.urlusers = this.config.url + '/users/';

    }
    validate(login, password, passwordConfirm, mail) {
        const regExp = /\S+@\S+\.\S+/;
        let isOk = true;
        const correct = {
            login: login.length >= 5 ? true : false,
            password: password.length >= 7 ? true : false,
            passwordConfirm: password === passwordConfirm ? true : false,
            mail: mail.match(regExp) ? true : false
        }
        let message = "";

        for (let variable in correct) {
            if (correct[variable] === false) {
                message += `popraw pole ${variable}`;
                isOk = false
            };
        }
        this.message.innerText = message;
        return isOk
    }

    register(e) {
        e.preventDefault();

        const login = this.login.value.toLowerCase();
        const password = this.password.value;
        const passwordConfirm = this.passwordConfirm.value;
        const mail = this.mail.value.toLowerCase();

        const correct = this.validate(login, password, passwordConfirm, mail);
        if (!correct) return

        if (password !== passwordConfirm) return this.message.innerText = "hasła nie są takie same";
        if (!login, !password, !mail) return this.message.innerText = "nie wypełniono wszystkich potrzebnych pól";
        const data = { login, password, mail }
        fetch(this.urlusers, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
        }).then(response => {
            if (response.status !== 200) throw error()
            return response.json()
        })
            .then(response => {
                this.message.innerText = response;
            })
            .catch(err => {
                this.message.innerText = "Podczas próby rejestracji wystąpił błąd. Spróbuj ponownie.";
            })
    }
}


const x = new Registration()