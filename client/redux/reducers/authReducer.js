import { AUTHENTICATE, DIDTRYAUTH, LOGIN, LOGOUT, UPDATEUSER } from "../actions/authActions";

const initialState = {
    user: null,
    didTryAuth: false
};



const AuthReducer = (state = initialState, action) => {
    switch( action.type ) {

        case AUTHENTICATE: {
            return {
                ...state,
                user: action.user
            }
        }

        case DIDTRYAUTH: {
            return {
                ...state, 
                didTryAuth: true
            }
        }

        case LOGIN: {
            return {
                ...state,
                user: action.user
            }
        }

        case UPDATEUSER: {
            return {
                ...state,
                user: action.user
            }
        }

        case LOGOUT: {
            return {
                ...state,
                user: null,
                didTryAuth: false
            }
        }

        default: {
            return state;
        }
    }
};

export default AuthReducer;