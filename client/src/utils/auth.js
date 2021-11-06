import decode from 'jwt-decode';

class AuthService {
    // retrieve data saved in token
    getProfile() {
        return decode(this.getToken());
    }

    // check if the user is still logged in
    loggedIn() {
        // checks if there is a saved token and it's still valid
        const token = this.getToken();
        // use type coersion to check if token is not undefined and the token is not expired
        // We are checking to see whether or not !token is true or false, we want !token to return false, thus we use an additional '!' initialliy
        // Potentially because token will exist regardless of if the token is present or not, but !token will return false if the token does exist?
        // Upon this prompt returning false && false, we return 'true' as in the user is loggedin
        return !!token && !this.isTokenExpired(token);
    }

    // check if token has expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now()/1000) {
                return true; 
            } else {
                return false;
            }
        } catch (err) {
            return false; 
        }
    }

    // retrieve token from localStorage
    getToken() {
        return localStorage.getItem('id_token');
    }

    // set token to localStorage and reload page to homepage
    login(idToken) {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }

    // clear token from localStorage and force logout with reload
    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
} 

export default new AuthService();