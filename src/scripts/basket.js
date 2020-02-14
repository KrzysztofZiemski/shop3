import { Api } from './handleapi.js';
let activeProducts = []
class Basket {
    constructor() {
        this.api = new Api();
        this.basketIconCount = document.querySelector("#countBasket");
        this.basketContainer = document.querySelector("#handleBuyContainer");
        this.basketProductsContainer = document.querySelector('#basketProductsContainer');
        this.sumPrice = document.querySelector('#sumPrice');
        this.orderForm = document.querySelector('#orderForm');
        //this.orderForm.addEventListener("submit",)
        this.addListeners();
        this.updateBasketByCookies()
    }
    async buyBtn(e) {
        document.querySelector('#basket').classList.add('hide');
        this.orderForm.classList.remove('hide');
        try {
            this.user = await this.api.getUser();
            // if(this.user) uzupełnij formularz danymi
        } catch (e) {
            console.log(e)
        }

    }
    backToBasket() {
        document.querySelector('#basket').classList.remove('hide');
        this.orderForm.classList.add('hide');
    }
    orderBtn(e) {
        e.preventDefault();
        const orderFirstName = document.querySelector('#orderFirstName');
        const orderLastName = document.querySelector('#orderLastName');
        const orderZIPcode = document.querySelector('#orderZIPcode');
        const orderCity = document.querySelector('#orderCity');
        const orderStreet = document.querySelector('#orderStreet');
        const orderStreetNumber = document.querySelector('#orderStreetNumber');
        const orderMail = document.querySelector('#orderMail');
        const orderSave = document.querySelector('#orderSave');
        const parameterArr = [orderFirstName, orderLastName, orderZIPcode, orderCity, orderStreet, orderStreetNumber, orderMail];
        let isOk = true;
        parameterArr.forEach(item => {
            if (!item.value) {
                isOk = false
                item.setAttribute('placeholder', 'musisz uzupełnic to pole');
                return item.classList.add('incorrect');
            }
            else {
                item.classList.remove('incorrect');
            }
        })
        if (!isOk) return

        this.orderForm.classList.add('hide')
        document.querySelector('#confirmOrder').classList.remove('hide');
        const fullName = `${orderFirstName.value} ${orderLastName.value}`;
        const adress = `${orderStreet.value} ${orderStreetNumber.value}, ${orderZIPcode.value} ${orderCity.value}`;
        const mail = orderMail.value;
        const idUser = this.user ? this.user._id : null;
        this.confirmBuy(fullName, adress, mail, idUser);
    }
    confirmBuy(fulName, adress, mail, id) {
        let totalPrice = 0;
        const buyedProducts = activeProducts.filter(product => {
            if (product.checked === true) {
                totalPrice += product.price * product.count;
                return true
            }
        });
        const totalPriceOrder = document.querySelector("#totalPriceOrder");
        totalPriceOrder.innerText = `Do zapłaty ${totalPrice} PLN`

        const userConfirm = document.querySelector("#userConfirm");
        userConfirm.innerText = `${fulName}`;

        const adressConfirm = document.querySelector("#adressConfirm");
        adressConfirm.innerText = adress;

        const mailConfirm = document.querySelector("#mailConfirm");
        mailConfirm.innerText = mail;

        const productsOrder = document.querySelector("#productsOrder");
        buyedProducts.forEach(item => {
            const div = document.createElement('div');
            div.className = "confirmProducts";
            const name = document.createElement('span');
            name.innerText = item.name;
            const count = document.createElement('span');
            count.innerText = `x ${item.count}`;
            const total = document.createElement('span');
            total.innerText = `${item.price * item.count} PLN`;

            div.appendChild(name);
            div.appendChild(count);
            div.appendChild(total);
            productsOrder.appendChild(div);
        })
        //teraz przygotować dane do fetch
        const products = buyedProducts.map(item => { return { id: item._id, count: item.count } });
        const userId = this.user ? this.user._id : "";
        const data = {
            fulName, adress, mail, products, userId
        }

        const confirmOrderBtn = document.querySelector('#confirmOrderBtn');
        confirmOrderBtn.addEventListener('click', (e) => this.handleConfirmOrderBtn(e, data))

    }
    handleConfirmOrderBtn(e, data) {
        this.api.buy(data)
            .then(response => {
                if (response.status === 200) {
                    const div = document.createElement('div');
                    div.className = "confirmOrderMessage";
                    div.innerText = 'Zamówienie zostało przyjęte do realizacji. Na podany adres mailowy otrzymasz potwierdzenie zakupu';
                    document.querySelector('#confirmOrder').appendChild(div);
                    e.target.setAttribute('disabled', true);
                    activeProducts = [];
                    this.refreshIconBasket();
                    this.updateBasketCookies();
                    this.uploadBasket();
                    this.refreshTotalPrice();

                    //docelowo przekierowanie
                    setTimeout(function () { window.location.replace("/"); }, 5000);
                } else if (response.status === 404) {
                    const div = document.createElement('div');
                    div.innerText = 'Niewystarczająca ilość jednego z produktów';

                    document.querySelector('#confirmOrder').appendChild(div);
                } else {
                    const div = document.createElement('div');
                    div.innerText = 'Błąd zamówienia, prosimy o kontakt';
                    document.querySelector('#confirmOrder').appendChild(div);
                    e.target.setAttribute('disabled', true);
                }
            })

    }
    addListeners() {
        const basketIcon = document.querySelector("#basketIcon");
        if (basketIcon) basketIcon.addEventListener('click', this.showBasket.bind(this));
        const closeBasketBtn = document.querySelector('#closeBasketBtn');
        if (closeBasketBtn) closeBasketBtn.addEventListener('click', this.hideBasket.bind(this));
        const buyBtn = document.querySelector('#buyBtn');
        if (buyBtn) buyBtn.addEventListener('click', this.buyBtn.bind(this));
        if (this.orderForm) this.orderForm.addEventListener('submit', (e) => this.orderBtn(e));
        const orderFormBack = document.querySelector('#orderFormBack');
        if (orderFormBack) orderFormBack.addEventListener('click', () => this.backToBasket());
    }
    updateBasketByCookies() {
        const cookies = this.api.getCookies();
        if (!cookies) return
        activeProducts = cookies.hasOwnProperty("basket") ? JSON.parse(cookies.basket) : [];
        this.refreshIconBasket();
        this.refreshBasket(activeProducts);
    }
    uploadBasket() {
        const cookies = this.api.getCookies();
        if (cookies && cookies.refreshToken) this.api.uploadBasket(activeProducts);
    }

    showBasket() {
        this.basketContainer.classList.remove('hide');
    }
    hideBasket() {
        this.basketContainer.classList.add('hide');
        document.querySelector('#basket').classList.remove('hide')
        this.orderForm.classList.add('hide');
        document.querySelector('#confirmOrder').classList.add('hide');
    }
    getBasket() {
        return activeProducts;
    }
    setBasket(activeProducts) {
        this.refreshIconBasket();
        this.refreshBasket(activeProducts);
    }
    async addToBasket(id) {
        const index = activeProducts.findIndex(item => item._id == id)
        if (index !== -1) {
            activeProducts[index].count++
        } else {
            const product = await this.api.get(id);
            const { name, price, _id, image } = product;
            const data = {
                name, price, _id, image, count: 1, checked: true
            }
            activeProducts.push(data);
        }
        this.refreshBasket(activeProducts);
        this.updateBasketCookies();
        this.uploadBasket();
        this.refreshTotalPrice();
    }
    async removeFromBasket(id) {
        const index = activeProducts.findIndex(item => item._id == id)
        activeProducts.splice(index, 1);
        this.refreshIconBasket();
        this.updateBasketCookies();
        this.uploadBasket();
        this.refreshTotalPrice();
    }
    refreshIconBasket() {
        if (this.basketIconCount) this.basketIconCount.innerHTML = `(${activeProducts.length})`;
    }
    changeBasketCount(e) {
        const index = activeProducts.findIndex(item => item._id == id);
        activeProducts[index].count = e.target.value;
        totalSpan.innerText = activeProducts[index].count * activeProducts[index].price + " PLN";
        this.updateBasketCookies();
        this.uploadBasket();
        this.refreshTotalPrice();
    }
    increaseBasketCount(id, input, totalSpan) {
        const index = activeProducts.findIndex(item => item._id == id);
        activeProducts[index].count++;
        input.value = activeProducts[index].count;
        totalSpan.innerText = activeProducts[index].count * activeProducts[index].price + " PLN";
        this.updateBasketCookies();
        this.uploadBasket();
        this.refreshTotalPrice();
    }
    decreaseBasketCount(id, input, totalSpan) {
        const index = activeProducts.findIndex(item => item._id == id);
        activeProducts[index].count = activeProducts[index].count > 1 ? --activeProducts[index].count : activeProducts[index].count;
        input.value = activeProducts[index].count;
        totalSpan.innerText = activeProducts[index].count * activeProducts[index].price + " PLN";
        this.updateBasketCookies();
        this.uploadBasket();
        this.refreshTotalPrice();
    }
    checkBasketItems(e, id) {
        const index = activeProducts.findIndex(item => item._id == id)
        activeProducts[index].checked = !activeProducts[index].checked
        this.updateBasketCookies();
        this.uploadBasket();
        this.refreshTotalPrice()
    }
    updateBasketCookies() {
        this.api.setCookie('basket', activeProducts);
    }

    refreshBasket(products) {
        if (this.basketProductsContainer) this.basketProductsContainer.innerText = "";
        products.forEach(item => {
            const product = document.createElement('div');
            product.className = 'basketElementMark';

            const spanCheckbox = document.createElement('span');
            spanCheckbox.className = "Product"
            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', "checkbox");
            item.checked ? checkbox.setAttribute('checked', item.checked) : null;
            checkbox.addEventListener('change', (e) => this.checkBasketItems(e, item._id))
            spanCheckbox.appendChild(checkbox);
            product.appendChild(spanCheckbox);

            const spanImage = document.createElement('span');
            spanImage.className = "basketElementImage"
            const image = document.createElement('img');
            image.setAttribute('src', item.image);
            spanImage.appendChild(image);
            product.appendChild(spanImage);

            const spanName = document.createElement('span');
            spanName.className = "basketElementName";
            spanName.innerText = item.name;
            product.appendChild(spanName);

            const spanPrice = document.createElement('span');
            spanPrice.innerText = item.price * item.count + " PLN";
            spanPrice.className = "basketElementPrice";
            const spanCount = document.createElement('span');
            spanCount.className = "basketElementCount"
            const inputCount = document.createElement('input');
            inputCount.setAttribute('type', "number");
            inputCount.setAttribute('min', 1);
            inputCount.value = item.count;
            inputCount.addEventListener('change', (e) => this.changeBasketCount(e, item._id, spanPrice))
            const subtractionBtn = document.createElement('button');
            subtractionBtn.innerHTML = '<i class="fas fa-minus"></i>';
            subtractionBtn.addEventListener('click', () => this.decreaseBasketCount(item._id, inputCount, spanPrice))
            const additionBtn = document.createElement('button');
            additionBtn.innerHTML = '<i class="fas fa-plus"></i>';
            additionBtn.addEventListener('click', () => this.increaseBasketCount(item._id, inputCount, spanPrice))
            spanCount.appendChild(subtractionBtn);
            spanCount.appendChild(inputCount);
            spanCount.appendChild(additionBtn);
            product.appendChild(spanCount);

            const spanRemove = document.createElement('span');
            spanRemove.className = "basketElementSpanRemove";
            const btnRemove = document.createElement('button');
            btnRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';
            btnRemove.addEventListener('click', () => {
                product.remove();
                this.removeFromBasket();
            });
            spanRemove.appendChild(btnRemove);
            product.appendChild(spanRemove);
            product.appendChild(spanPrice);
            if (this.basketProductsContainer) this.basketProductsContainer.appendChild(product);
            this.refreshTotalPrice();
            this.refreshIconBasket();
        })
    }
    refreshTotalPrice() {
        let total = 0;
        activeProducts.forEach(item => {
            if (item.checked) {
                total += item.count * item.price
            }
        });
        const spanSum = document.createElement('span');
        spanSum.innerText = `${total} PLN`;
        if (this.sumPrice) this.sumPrice.innerText = 'Do zapłaty ';
        if (this.sumPrice) this.sumPrice.appendChild(spanSum);
    }
}

const basket = new Basket();
export { basket };