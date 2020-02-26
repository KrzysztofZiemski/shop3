import Config from './config.js';
import Cookies from './cookies';

class Api {
    constructor() {
        this.urlProducts = `${Config.url}/api`;
        this.urlUsers = `${Config.url}/users`;
        this.urlTransactions = `${Config.url}/transactions`;
        this.urlAuth = `${Config.url}/auth/token`;
    }

    getAll() {
        return fetch(this.urlProducts)
            .then(res => {
                if (res.status !== 200) throw res.status
                return res.json()
            })
    }
    getCategory(queries) {
        const url = this.urlProducts + "/filter?" + queries
        return fetch(url)
            .then(res => {
                if (res.status !== 200) throw res.status
                return res.json()
            })
    }

    get(id) {
        return fetch(`${this.urlProducts}/${id}`)
            .then(res => {
                if (res.status !== 200) throw res.status
                return res.json()
            })
    }
    async add(data) {
        const cookies = Cookies.get();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;
        const formData = new FormData();
        for (let prop in data) {
            formData.append(prop, data[prop])
        }
        const response = await fetch(this.urlProducts, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = Cookies.get();
                const accessToken = cookies.accessToken;
                response = await fetch(`/${this.urlProducts}`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }
        }
        return response
    }

    async change(id, data) {
        const cookies = Cookies.get();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;


        const formData = new FormData();
        for (let prop in data) {
            formData.append(prop, data[prop])
        }
        let response = await fetch(`${this.urlProducts}/${id}`, {
            method: "PUT",
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = Cookies.get();
                const accessToken = cookies.accessToken;
                response = await fetch(`/${this.urlProducts}/${id}`, {
                    method: "PUT",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }
        }
    }
    async getUser() {
        let cookie = Cookies.get();
        if (cookie !== null && !cookie.hasOwnProperty('accessToken') && cookie.hasOwnProperty('refreshToken')) {
            const successRefresh = await this.refreshToken(cookie.refreshToken);
            if (!successRefresh) return;
            cookie = Cookies.get();
        }
        try {
            const user = await cookie.hasOwnProperty('accessToken') ? await this.getUserByToken() : null;
            return user;
        } catch (e) {
            return null
        }

    }

    async remove(id) {
        const cookies = Cookies.get();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;

        let response = fetch(`${this.urlProducts}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = Cookies.get();
                const accessToken = cookies.accessToken;
                response = await fetch(`${this.urlProducts}/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }
            if (response.status !== 200) throw res.status
            return response.json()
        }
    }
    async getUserByToken(token) {
        const cookies = Cookies.get();
        const accessToken = cookies.accessToken;
        const user = await fetch(`${this.urlUsers}/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(res => res.json()).catch(err => console.log(err))
        return user
    }
    //nie działa przy odpalaniu strony na pewno. wyskakuje tez czasami jakiś błąd
    async refreshToken(refreshToken) {
        const data = {
            refreshToken: refreshToken
        }

        const refresh = await fetch(this.urlAuth, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
        })
        if (refresh.status === 200) {
            const tokens = await refresh.json();
            //////////////////////
            Cookies.set("accessToken", tokens.accessToken, 600);
            Cookies.set("refreshToken", tokens.refreshToken, 10800);
            return true
        } else {
            console.log('refreshTokenStatus ', refresh.status)
        }
        return false
    }
    async uploadBasket(data) {
        const cookies = Cookies.get();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;
        let response = await fetch(`${this.urlUsers}basket`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = Cookies.get();
                const accessToken = cookies.accessToken;
                response = await fetch(`${this.urlUsers}basket`, {
                    method: "PUT",
                    body: data,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }
        }
    }

    buy(data) {
        const url = `${this.urlTransactions}/buy`;
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}


export { Api };