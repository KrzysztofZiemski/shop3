import { Api } from './handleApi.js';



const clearCookie = () => {
    document.cookie = `accessToken =;Max-Age=0; path=/`;
    document.cookie = `refreshToken =;Max-Age=0; path=/`;
    //kod do wykasowania refreshtokena z user??
    window.location.replace("/?message=Poprawnie wylogowano");
}
clearCookie()