import localStore from "store";
import CryptoJS from "crypto-js";
import UAParser from "ua-parser-js";
import pick from "lodash/pick";
const parser = new UAParser();

const genSecretKey = () => {
    let secretKey = '';
    let parsedUser = parser.getResult();
    if(parsedUser){
        let ua = pick(parsedUser, ['ua', 'browser', 'cpu', 'engine', 'os']);
        secretKey = JSON.stringify(ua);
    }else{
        secretKey = false;
    }
    return secretKey;
};

export const saveLocalStringCrypt = (key, str) => {
    let secretKey = genSecretKey();
    if(secretKey){
        let ciphertext = CryptoJS.AES.encrypt(str, secretKey);
        localStore.set(key, ciphertext.toString());
    }else{
        localStore.set(key, str);
    }
};
export const getLocalStringCrypt = (key) => {
    let secretKey = genSecretKey();
    if(secretKey){
        let text = localStore.get(key);
        if(text){
            let bytes = CryptoJS.AES.decrypt(text, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }else{
            return false;
        }
    }else{
        let text = localStore.get(key);
        if(text){
            return text;
        }else{
            return false;
        }
    }
};

