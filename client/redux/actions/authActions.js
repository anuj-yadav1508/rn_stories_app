import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';
export const DIDTRYAUTH = 'DIDTRYAUTH';
export const UPDATEUSER = 'UPDATEUSER';

export const didTryAuth = () => {
   return { type: DIDTRYAUTH };
};

export const authenticate = ( user ) => {
    return { type: AUTHENTICATE, user: user };
};

export const login = (email, password) => {
    return async dispatch => {
        try {
            const res = await axios({
                method: 'post',
                url: 'http://172.20.10.2:8800/api/auth/login',
                data: {
                    email,
                    password
                }
            });

            dispatch({ type: LOGIN, user: res.data  });
            saveToStorage(res.data);
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!';

            if(errorMessage === 'Request failed with status code 401') {
                message = 'Password Incorrect!'
            }

            if(errorMessage === 'Request failed with status code 402') {
                message = 'Email not registered!'
            }

            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network error!'
            }

            throw new Error(message);
        }
    }
}; 

export const register = (email, password, userName) => {
    return async dispatch => {
        try {
            const res = await axios({
                method: 'post',
                url: 'http://172.20.10.2:8800/api/auth/register',
                data: {
                    email: email,
                    password: password,
                    userName: userName
                }
            });

            dispatch({ type: REGISTER, email: email, password: password, userName: userName })
            
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 403') {
                message = 'Email already registered!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error!'
            }

            throw new Error(message);
        }
    };
};

// updating the user
export const updateUser = (username, profilePictureUrl) => {
    return async (dispatch, getState) => {
        const user = getState().auth.user;
        try {
            console.log('updating on sever now!');
            const res = await axios({
                method: 'patch',
                url: `http://172.20.10.2:8800/api/users/update/${user._id}`,
                headers: {
                    "authorization": `Bearer ${user.accessToken}`
                },
                data: {
                    userName: username,
                    profilePicture: profilePictureUrl,
                }
            });

            dispatch({ type: UPDATEUSER, user: res.data });
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!';

            if(errorMessage === 'Request failed with status code 401') {
                message = 'Password Incorrect!'
            }

            if(errorMessage === 'Request failed with status code 402') {
                message = 'Email not registered!'
            }

            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network error!'
            }

            throw new Error(message);
        }
    };
};

// logout 
export const logout = () => {
    console.log('logout triggered!');
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
}


// save to storage async = user credentials
const saveToStorage = ( user ) => {
    AsyncStorage.setItem('userData', JSON.stringify(user));
};