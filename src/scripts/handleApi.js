import { Config } from './config.js';

class Api {
    constructor() {
        this.config = new Config();
        this.urlProducts = this.config.url + '/api/';
        this.urlUsers = this.config.url + '/users/';
    }

    getCookies() {
        const decoded = decodeURIComponent(document.cookie);
        const decodedArr = decoded.split(';');
        if (!decodedArr[0]) return null
        const objCookies = {};
        decodedArr.forEach(cookie => {
            const cookieParts = cookie.split("=");
            const name = cookieParts[0].trim();
            const value = cookieParts[1].trim();
            objCookies[name] = value;
        })
        return objCookies;
    }
    setCookie(name, value, maxAge = 2592000) {
        let checkedValue = value;
        if (typeof value === 'object') checkedValue = JSON.stringify(value);
        document.cookie = `${name}=${checkedValue};Max-Age=${maxAge};path=/`
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
        const cookies = this.getCookies();
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
                const cookies = this.getCookies();
                const accessToken = cookies.accessToken;
                response = await fetch(`${this.urlProducts}`, {
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
        const cookies = this.getCookies();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;
        const formData = new FormData();
        for (let prop in data) {
            formData.append(prop, data[prop])
        }

        let response = await fetch(`${this.urlProducts}${id}`, {
            method: "put",
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = this.getCookies();
                const accessToken = cookies.accessToken;
                response = await fetch(`${this.urlProducts}${id}`, {
                    method: "put",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }
        }
    }
    async getUser() {
        let cookie = this.getCookies();
        if (cookie !== null && !cookie.hasOwnProperty('accessToken') && cookie.hasOwnProperty('refreshToken')) {
            const successRefresh = await this.refreshToken(cookie.refreshToken);
            if (!successRefresh) return;
            cookie = this.api.getCookies();
        }
        try {
            const user = await cookie.hasOwnProperty('accessToken') ? await this.getUserByToken() : null;
            return user;
        } catch (e) {
            return null
        }

    }

    async remove(id) {
        const cookies = this.getCookies();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;

        let response = fetch(`${this.urlProducts}${id}`, {
            method: "delete",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = this.getCookies();
                const accessToken = cookies.accessToken;
                response = await fetch(`${this.urlProducts}${id}`, {
                    method: "delete",
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
        const cookies = this.getCookies();
        const accessToken = cookies.accessToken;
        const user = await fetch(`${this.urlUsers}user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(res => res.json()).catch(err => console.log(err))
        return user
    }
    //nie działa przy odpalaniu strony na pewno. wyskakuje tez czasami jakiś błąd
    async refreshToken(refreshToken) {
        const refreshUrl = this.config.url + '/auth/token';
        const data = {
            refreshToken: refreshToken
        }
        const refresh = await fetch(refreshUrl, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
        })
        if (refresh.status === 200) {
            const tokens = await refresh.json();
            //////////////////////
            this.setCookie("accessToken", tokens.accessToken, 600);
            this.setCookie("refreshToken", tokens.refreshToken, 10800);
            return true
        } else {
            console.log('refreshTokenStatus ', refresh.status)
        }
        return false
    }
    async uploadBasket(data) {
        const cookies = this.getCookies();
        const accessToken = cookies.accessToken;
        const refreshToken = cookies.refreshToken;
        let response = await fetch(`${this.urlUsers}basket`, {
            method: "put",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (response.status === 401) {
            const successRefresh = await this.refreshToken(refreshToken);
            if (successRefresh) {
                const cookies = this.getCookies();
                const accessToken = cookies.accessToken;
                response = await fetch(`${this.urlUsers}basket`, {
                    method: "put",
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
        const url = 'http://localhost:3000/server/transactions/buy';
        return fetch(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}

export { Api };