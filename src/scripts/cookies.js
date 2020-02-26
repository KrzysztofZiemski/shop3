class Cookies {

    get() {
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
    set(name, value, maxAge = 2592000) {
        let checkedValue = value;
        if (typeof value === 'object') checkedValue = JSON.stringify(value);
        document.cookie = `${name}=${checkedValue};Max-Age=${maxAge};path=/`
    }
}
export default new Cookies();