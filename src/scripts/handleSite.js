import { Api } from './handleApi.js';
import CreateItems from './createItems.js';
import config from './config.js';
import { basket } from './basket.js';
import Cookies from './cookies';
import '../sass/shop.scss';
class HandleSite {
    constructor() {
        this.basket = basket;;
        this.user = null;
        this.api = new Api();
        this.productContainer = document.getElementById('products');
        this.products = [];
        this.basket = basket;
        this.filters = {
            color: "",
            price: {
                min: "",
                max: ""
            }
        }
        this.root = document.querySelector("#root");
        this.StartSite()
        this.putColorsListToFilterOption();

        this.closeNavBtn = document.querySelector('#closeNavBtn');
        this.closeNavBtn.addEventListener('click', this.toggleNav);

        this.showNavBtn = document.querySelector('#showNavBtn');
        this.showNavBtn.addEventListener('click', this.toggleNav);

        this.colorFilter = document.getElementById('colorFilter');
        this.colorFilter.addEventListener('change', this.runFilter.bind(this));
        this.maxPriceFilter = document.getElementById('maxPriceFilter')
        this.maxPriceFilter.addEventListener('change', this.runFilter.bind(this));
        this.minPriceFilter = document.getElementById('minPriceFilter');
        this.minPriceFilter.addEventListener('change', this.runFilter.bind(this));
    }
    async StartSite() {
        let cookie = Cookies.get();
        if (cookie !== null && !cookie.hasOwnProperty('accessToken') && cookie.hasOwnProperty('refreshToken')) {
            const successRefresh = await this.api.refreshToken(cookie.refreshToken);
            if (!successRefresh) return;
            cookie = Cookies.get();
        }
        this.user = await this.api.getUser();
        if (this.user && this.user.activeBasket.length > 0) {
            this.basket.setBasket(this.user.activeBasket);
            this.basket.updateBasketCookies();
        } else {
            this.basket.updateBasketByCookies();
        }
        if (this.user) {
            const helloBanner = document.querySelector('#welcome');
            const spanBannerText = document.createElement('span');
            spanBannerText.innerText = 'Witaj';
            helloBanner.appendChild(spanBannerText);

            const spanBannerUser = document.createElement('span');
            spanBannerUser.innerText = this.user.login;
            helloBanner.appendChild(spanBannerUser);
        }

        const loginLink = document.querySelector('#login');
        loginLink.innerText = this.user ? 'Wyloguj' : 'Zaloguj';
        loginLink.href = this.user ? '/logout' : '/login';
        this.root.append(CreateItems.createLoader());
        this.showAll().then(data => CreateItems.removeLoader())
    }
    toggleNav() {
        document.querySelector('#categoryNav').classList.toggle('show');
        document.querySelector('#showNavBtn').classList.toggle('hide');
    }
    closeNav() {

    }
    runFilter() {
        const max = this.maxPriceFilter.value;
        this.filters.price.max = max;
        const min = this.minPriceFilter.value;
        this.filters.price.min = min;
        this.filters.color = this.colorFilter.value;
        let filterList = [...this.products];
        filterList = this.getFilterPrice(filterList);
        //todo color filter
        filterList = this.getFilterColor(filterList);
        this._refreshSite(filterList);
    }
    getFilterColor(filterList) {
        if (this.filters.color === "") return filterList
        return filterList.filter(product => {
            let isOk = false;
            if (product.tags !== "") {
                product.tags.forEach(tag => {
                    if (tag === this.filters.color) isOk = true
                })
            }
            if (isOk) return product
        });
    }
    getFilterPrice(filterList) {
        const { min, max } = this.filters.price;
        console.log(min, max)
        console.log(filterList)
        return filterList.filter(product => {
            if (min !== "" && Number(product.price) >= Number(min)) {
                if (max !== "" && Number(product.price) <= Number(max)) return product
                if (max === "") return product
            } else if (min === "") {
                if (max !== "" && Number(product.price) <= Number(max)) return product
                if (max === "") return product
            }
        })
    }
    getParamsPath(arrayPath) {

        const categories = {};
        for (let i = 0; i < arrayPath.length; i = i + 2) {
            categories[arrayPath[i]] = arrayPath[i + 1];
        }
        return categories
    }

    async showAll() {
        const path = window.location.href.split('?');
        const checkQueriesName = path.length === 1 ? [] : path[1].split('=');

        if (path.length > 1 && checkQueriesName[0] === 'category') {
            const query = path[1];
            await this.api.getCategory(query)
                .then(products => {
                    if (products.docs.length === 0) return
                    products.docs.forEach(product => this.products.push(product))
                })
        } else if (path.length > 1 && checkQueriesName[0] === 'message') {
            const message = decodeURIComponent(checkQueriesName[1]);
            const messageElement = CreateItems.createMessageElement(message);
            try {
                await this.api.getAll().then(products => products.rows.forEach(product => this.products.push(product.doc)))
            } catch {
                console.log('błąd przy próbie pobrania produktów do sklepu')
            }
        }
        else {
            try {
                await this.api.getAll().then(products => products.rows.forEach(product => this.products.push(product.doc))).then()
            } catch {
                console.log('błąd przy próbie pobrania produktów do sklepu')
            }
        }
        this._refreshSite(this.products);
    }

    putColorsListToFilterOption() {
        const selectFilter = document.getElementById('colorFilter');
        const nullFirstOption = document.createElement('option');
        selectFilter.append(nullFirstOption);
        config.tags.forEach(tag => {
            const option = document.createElement('option');
            option.setAttribute('value', tag);
            option.text = tag;
            selectFilter.append(option);

        })
    }
    //TODO
    //element.addEventListener('click', this.showSingle.bind(this)) //pokazanie pojedyńczego elementu jeszcze nie wdrożone
    _refreshSite(products) {
        this.productContainer.innerHTML = "";
        const articlesProducts = CreateItems.productsShop(products);
        articlesProducts.forEach(element => {
            this.productContainer.append(element);
        })
    }

}
const site = new HandleSite()
