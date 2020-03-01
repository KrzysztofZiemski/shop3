import config from './config.js';
import '../sass/registration.scss';
import CreateItems from './createItems.js';
import { Api } from './handleApi';

class Registration {
    constructor() {
        this.form = document.querySelector('#registration');
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.passwordConfirm = document.querySelector('#passwordConfirm');
        this.mail = document.querySelector('#mail');
        this.form.addEventListener('submit', this.register.bind(this));
        this.api = new Api();
    }
    validate(login, password, passwordConfirm, mail) {
        const regExp = /\S+@\S+\.\S+/;
        let isOk = true;
        //warunek pasword wykasowałem
        const correct = {
            login: login.length >= 5 ? true : false,
            password: password.length >= 1 ? true : false,
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

        if (password !== passwordConfirm) return CreateItems.createMessage('podane hasła nie są identyczne');
        if (!login, !password, !mail) return CreateItems.createMessage('nie wypełniono wszystkich potrzebnych pól');
        const data = { login, password, mail }
        CreateItems.createLoader();
        this.api.addUser(data)
            .then(response => {
                CreateItems.createMessage('Dziękujemy za rejestrację. Zapraszamy do zalogowania się');
                setTimeout(() => window.location.replace("/"), 7000);
            })
            .catch(err => {
                CreateItems.createMessage('Podczas próby rejestracji wystąpił błąd. Spróbuj ponownie');
            })
    }
}


const x = new Registration()