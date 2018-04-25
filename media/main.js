const obj2Query = (params) => {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}


const tryLogin = (url, params) => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onload = () => {//Call a function when the state changes.
            const response = JSON.parse(xhr.response);
            if (response.loggedin) {
                // Request finished. Do processing here.
                resolve(response);
            } else {
                reject(response);
            }
        }
        xhr.send(obj2Query(params)); 
    });
}

const setLoginError = (form) => {
    const loginStatus = document.querySelector('.Login__status');
    loginStatus.innerHTML = loginStatus.getAttribute('data-content');
    form.classList.add('Form--error', 'shake');
    
}

const login = (form) => {
    form.addEventListener( 'submit', ( function( event ){
        event.preventDefault();
        const params = {js: true};
        const inputs = form.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            params[input.name] = input.value;
        }

        // try to login
        tryLogin(form.action, params)
        .then( (response) => {
            window.location = '/';
        })
        .catch( (err) => {
            setLoginError(form);
        });

    } ) );
};

document.addEventListener( 'DOMContentLoaded', ( function(){
    login( document.querySelector( '#login' ) );
} ), false );