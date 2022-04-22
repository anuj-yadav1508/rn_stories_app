import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Color from "../../constants/Color";
import { useDispatch } from "react-redux";
import { authenticate, didTryAuth } from "../../redux/actions/authActions";

const StartUpScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryAuthenticating = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                
                if(userData) {
                    const user = JSON.parse(userData);

                    dispatch(authenticate(user));
                }else {
                    dispatch(didTryAuth());
                }
            } catch (err) {
                console.log(err)
            }
        };


        tryAuthenticating();
    }, []);

    return (
        <View style={styles.screen} >
            <ActivityIndicator size='large' color={Color.primary} />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default StartUpScreen;