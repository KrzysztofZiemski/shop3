import { Api } from './handleApi.js';
import { CreateItems } from './createItems.js';
import { Config } from './config.js';
import '../sass/admin.scss';

class Admin {
    constructor() {
        this.api = new Api();
        this.config = new Config();
        this.createItems = new CreateItems();
        this.root = document.querySelector('#root');
        this.checkToken();
        this.productsTable = this.createItems.createTableAdmin();
        document.getElementById('productsContainer').append(this.productsTable);
        this.productList = this.productsTable.querySelector('tbody');
        this.formGetItem = document.getElementById('formGetItem');
        this.idGetProduct = document.getElementById('idGetProduct');
        this.formAddItem = document.getElementById('formAddItem');
        this.formAddItem.addEventListener('submit', this._addProduct.bind(this))

        this.addItemPanel = document.querySelector('.addItemContainer');
        this.showPanelNewItem = document.getElementById('showPanelNewItem');
        this.showPanelNewItem.addEventListener('click', () => this.addItemPanel.classList.add('show'));
        this.closeAddPanel = document.getElementById('closeAddContainer');
        this.closeAddPanel.addEventListener('click', (e) => {
            e.preventDefault();
            this.addItemPanel.classList.remove('show');
        });

        this.addItemTagcontainerTr = document.getElementById('addItemTags');
        this.addTagsToPanelItem();

        this.formGetItem.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = this.idGetProduct.value;
            if (id.length !== 0) this.getSingleProduct(id)
            else this.getAllProducts();
        })

    }

    async checkToken() {
        try {

            let cookie = this.api.getCookies();
            if (cookie !== null && !cookie.hasOwnProperty('accessToken') && cookie.hasOwnProperty('refreshToken')) {
                const successRefresh = await this.api.refreshToken(cookie.refreshToken);
                if (!successRefresh) return;
                cookie = await this.api.getCookies();
            }
            let response
            const url = `${this.config.url}/auth/check`;
            const accessToken = cookie ? cookie.accessToken : null;
            const refreshToken = cookie ? cookie.refreshToken : null;
            if (cookie !== null) {
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }

            if (!response || response.status !== 200) {
                window.location.replace("/login?auth=denied");
            }
        }
        catch{
            // window.location.replace("/login?auth=błąd servera");
        }
    }

    addTagsToPanelItem() {
        const tags = this.createItems.addTagsToAddPanel();
        tags.forEach(tag => {
            this.addItemTagcontainerTr.appendChild(tag)
        });
    }
    _addProduct(e) {
        // jakąś validację trzeba zrobić i idzie poprostu przez formularz
        e.preventDefault();
        const name = e.target.querySelector('#nameAddProduct');
        const count = e.target.querySelector('#countAddProduct');
        const description = e.target.querySelector('#descAddProduct');
        const price = e.target.querySelector('#priceAddProduct');
        const category = e.target.querySelector('#categoryAddProduct');
        const image = e.target.querySelector('input[type="file"]');

        const tagsListChecked = e.target.querySelectorAll('input[type="checkbox"]:checked');
        const tags = Array.prototype.map.call(tagsListChecked, (tag) => tag.value);
        const data = { name: name.value, count: count.value, description: description.value, price: price.value, category: category.value, image: image.files[0], tags };


        this.root.append(this.createItems.createLoader());
        this.api.add(data)
            .then(data => {
                console.log('data', data)
                if (data.ok) {
                    this.createItems.createMessage('dodano produkt')
                    name.value = ""; count.value = ""; description.value = ""; price.value = ""; category.value = ""; image.value = "";
                    tagsListChecked.forEach(element => element.checked = false);
                    this.createItems.removeLoader();
                } else {
                    this.createItems.createMessage('błąd podczas dodawania produktu. Sprawdź wszystkie dane');
                    this.createItems.removeLoader();
                }
            })
            .catch(err => {
                this.createItems.removeLoader();
                this.createItems.createMessage('Nie udało się dodać produktu - pracujemy nad rozwiązaniem problemu');
            })
        // .then(data => {

        //     if (data === succes) {
        //         message.className = "success";
        //         message.innerText = `Dodano produkt: ${name.value}`;
        //         name.value = ""; count.value = ""; description.value = ""; price.value = ""; category.value = ""; image.value = "";
        //         tagsListChecked.forEach(element => element.checked = false);
        //     } else {
        //         message.className = "error";
        //         message.innerText = `Błąd dodawania produktu: ${name.value}`;
        //     }
        //     this.createItems.removeLoader();
        // })
        //     .catch(err => {
        //         console.log('eee', data)
        //         this.createItems.removeLoader();
        //         this.createItems.createMessage();
        //     })

        //     const message = document.querySelector('#addMessage');
        //     if (response.ok) {
        //         message.className = "success";
        //         message.innerText = `Dodano produkt: ${name.value}`;
        //         name.value = ""; count.value = ""; description.value = ""; price.value = ""; category.value = ""; image.value = "";
        //         tagsListChecked.forEach(element => element.checked = false);
        //     } else {
        //         alert('sdsd')
        //     }


    }
    //////////////////////////////////////////////
    getAllProducts() {
        this.root.appendChild(this.createItems.createLoader());
        this.productList.innerText = "";
        this.api.getAll()
            .then(products => {
                this.createItems.removeLoader()
                this.productList.innerText = "";
                Array.prototype.forEach.call(products.rows, function (product) {
                    const productHTML = this.createItems.adminProduct(product.doc);
                    this.productList.append(productHTML);
                    this.createItems.removeLoader()
                }.bind(this))
            }).catch(e => {
                this.createItems.removeLoader();
                this.createItems.createMessage();
            })

    }
    getSingleProduct(id) {
        try {
            this.api.get(id)
                .then(product => {
                    this.productList.innerText = "";
                    const productHTML = this.createItems.adminProduct(product);
                    this.productList.append(productHTML);
                })
        } catch (e) {
            console.log('błąd przy próbie pobrania produktu')
        }
    }

}

const admin = new Admin();
window.onload = () => admin.checkToken();
export { admin }

