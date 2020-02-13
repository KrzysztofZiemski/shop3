import { basket } from './basket.js';
import { Api } from './handleApi.js';
import { CreateItems } from './createItems.js';
import { Config } from './config.js';
import '../sass/all.scss';

class HandleSite {
    constructor() {
        this.user = null;
        this.createItems = new CreateItems();
        this.api = new Api();
        this.productContainer = document.getElementById('products');
        this.showAll()
        this.products = [];
        this.config = new Config();
        this.basket = basket;
        this.filters = {
            color: "",
            price: {
                min: "",
                max: ""
            }
        }

        this.StartSite()
        this.putColorsListToFilterOption();

        this.colorFilter = document.getElementById('colorFilter');
        this.colorFilter.addEventListener('change', this.runFilter.bind(this));
        this.maxPriceFilter = document.getElementById('maxPriceFilter')
        this.maxPriceFilter.addEventListener('change', this.runFilter.bind(this));
        this.minPriceFilter = document.getElementById('minPriceFilter');
        this.minPriceFilter.addEventListener('change', this.runFilter.bind(this));
    }
    async StartSite() {

        let cookie = this.api.getCookies();
        if (cookie !== null && !cookie.hasOwnProperty('accessToken') && cookie.hasOwnProperty('refreshToken')) {
            const successRefresh = await this.api.refreshToken(cookie.refreshToken);
            if (!successRefresh) return;
            cookie = this.api.getCookies();
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
            helloBanner.innerHTML = this.user ? 'Witaj ' : null;
            const spanBanner = document.createElement('span');
            spanBanner.innerText = this.user.login;
            helloBanner.appendChild(spanBanner);
        }

        const loginLink = document.querySelector('#login');
        loginLink.innerText = this.user ? 'Wyloguj' : 'Zaloguj';
        loginLink.href = this.user ? '/logout' : '/login';
    }
    //////////////////////////////////
    runFilter() {
        const max = this.maxPriceFilter.value;
        this.filters.price.max = max;
        const min = this.minPriceFilter.value;
        this.filters.price.min = min;
        this.filters.color = this.colorFilter.value;
        let filterList = [...this.products];
        console.log(filterList)
        filterList = this.getFilterColor(filterList);
        filterList = this.getFilterPrice(filterList);
        this._refreshSite(filterList);
    }
    getFilterColor(filterList) {
        if (this.filters.color === "") return filterList

        return filterList.filter(product => {
            let isOk = false;
            if (product.tags !== "") {
                product.tags.forEach(tag => {
                    console.log(tag)
                    if (tag === this.filters.color) isOk = true
                })
            }
            if (isOk) return product
        });
    }
    getFilterPrice(filterList) {
        const { min, max } = this.filters.price;
        return filterList.filter(product => {
            if (min !== "" && product.price >= min) {
                if (max !== "" && product.price <= max) return product
                if (max === "") return product
            } else if (min === "") {
                if (max !== "" && product.price <= max) return product
                if (max === "") return product
            }
        })
    }


    ////////////////////////////////////
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
            const messageElement = this.createItems.createMessageElement(message);
            document.querySelector("#root").prepend(messageElement);
            try {
                await this.api.getAll().then(products => products.rows.forEach(product => this.products.push(product.doc)))
            } catch {
                console.log('błąd przy próbie pobrania produktów do sklepu')
            }
        }
        else {
            try {
                await this.api.getAll().then(products => products.rows.forEach(product => this.products.push(product.doc)))
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
        this.config.tags.forEach(tag => {
            const option = document.createElement('option');
            option.setAttribute('value', tag);
            option.text = tag;
            selectFilter.append(option);

        })
    }
    _refreshSite(products) {
        this.productContainer.innerHTML = "";
        const articlesProducts = this.createItems.productsShop(products);
        articlesProducts.forEach(element => {
            //element.addEventListener('click', this.showSingle.bind(this)) //pokazanie pojedyńczego elementu jeszcze nie wdrożone
            this.productContainer.append(element);
        })
    }
    //////////////////////////////////////////////////////
    ////////////////pojedyńczy produkt - jeszzcze nie wdrożyłem
    // showSingle(e) {
    //     const articleId = e.currentTarget.getAttribute('data-id');
    //     try {
    //         this.api.get(articleId)
    //             .then(product => this.createItems.singleProductShop(product))
    //             .then(elementHTML => this.productContainer.append(elementHTML))
    //     } catch{
    //         console.log('błąd przy próbie pobrania produktu do sklepu')
    //     }
    // }

}
const handleSite = new HandleSite();