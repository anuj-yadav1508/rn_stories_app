import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StoriesMainNavigator, AuthNavigator } from './StoriesNavigation';
import StartUpScreen from '../screens/auth/StartUpScreen';
import { useSelector } from 'react-redux';

const AppNavigator = () => {
    const isAuth = useSelector(state => state.auth.user);
    const didTryAuth = useSelector(state => state.auth.didTryAuth);
    console.log(didTryAuth);

    return (
        <NavigationContainer>
            { (!isAuth && didTryAuth) && <AuthNavigator />}
            { isAuth && <StoriesMainNavigator />}
            { (!isAuth && !didTryAuth) && <StartUpScreen />}
        </NavigationContainer>
    )
};


export default AppNavigator;