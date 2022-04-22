import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, Button, Alert, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import Input from '../../components/Input';
import Color from '../../constants/Color';
import { useDispatch } from 'react-redux';
import { login, register } from '../../redux/actions/authActions';
import DefaultButton from '../../components/DefaultButton';

const INPUT_CHANGE_HANDLER = 'INPUT_CHANGE_HANDLER';

const formReducer = (state, action) => {
    switch( action.type ) {
        case INPUT_CHANGE_HANDLER: {
            const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
        
        default: {
            return state;
        }
    }
};


const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isError, setIsError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    console.log(isSignUp);
    
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            userName:'',
            email: '',
            password: '',
            confirmPassword: ''
        },
        inputValidities: {
            userName:!isSignUp ? true :  false,
            email: false,
            password: false,
            confirmPassword:!isSignUp ? true : false
        },
        formIsValid: false
    });

    const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: INPUT_CHANGE_HANDLER,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  ); 

    const submitFormHandler = useCallback(async () => {
        setIsError();
        if(!formState.formIsValid) {
            Alert.alert('Cannot submit!', 'Please, recheck your credentials!', [{ text: 'Okay' }]);
            return;
        }

        try {
            
            if(!isSignUp) {
                setIsLoading(true);
                await dispatch(login(formState.inputValues.email, formState.inputValues.password));
                setIsLoading(false);
            }else {
                setIsLoading(true);
                await dispatch(register(formState.inputValues.email, formState.inputValues.password, formState.inputValues.userName));
                setIsSignUp(false);
                setIsLoading(false);
            }
            
        } catch (err) {
            
            setIsError(err.message);
            setIsLoading(false);   
        }
    }, [formState, dispatch]);

    useEffect(() => {
        if(isError) {
            Alert.alert('Ooops!', isError, [{ text: 'Okay' }])
            return;
        }
    }, [isError]);

    return (
            <View style={styles.screen}>
                <LinearGradient colors={['#3C3B3F', '#605C3C']} style={styles.screen} >
                {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss()} > */}
                <BlurView intensity={30} tint='dark' style={styles.blurContainer}  >
                <View style={styles.formContainer}>
                    <ScrollView>
                        <Text style={styles.logoHeading}>STORIESSHARE</Text>

                        {isSignUp && <Input label='Username: ' id='userName' required onInputChangeHandler={inputChangeHandler} errorText='Please, provide a valid username!'  />}

                        <Input label='Email: ' id='email' required email keyboardType='email-address' autoCapitalize='none' onInputChangeHandler={inputChangeHandler} errorText='Please, provide a valid email!'/>

                        <Input label='Password: ' id='password' required minLength={6} onInputChangeHandler={inputChangeHandler} errorText='Please, provide a valid password!' />

                        {isSignUp && <Input label='Confirm Password: ' id='confirmPassword' required minLength={6} onInputChangeHandler={inputChangeHandler} errorText='Your passwords does not matched!' />}

                        <View style={styles.buttonContainer}>

                            { isLoading && (<View style={{marginVertical: 15}}>
                                <ActivityIndicator size='small' color={Color.primary} />
                            </View>)}


                            { (Platform.OS === 'ios') ? (<DefaultButton title={isSignUp ? 'Sign Up' : 'Login'} onPress={submitFormHandler} >{isSignUp ? 'SIGN UP' : 'LOGIN'}</DefaultButton>) : (
                                <View style={{ width: '100%' }}>
                                    <Button  title={isSignUp ? 'Sign Up' : 'Login'} color={Color.primary} onPress={submitFormHandler} />
                                </View>
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            { Platform.OS === 'ios' ? (<DefaultButton onPress={() => setIsSignUp(prevState => !prevState)} title={isSignUp ? 'SIGN UP' : 'LOGIN'} >{!isSignUp ? 'SWITCH TO SIGN UP' : 'SWITCH TO LOGIN'}</DefaultButton>) : (<View style={{ width: '100%' }}>
                                    <Button title={!isSignUp ? 'Switch to SIGN UP': 'Switch to LOGIN'} color={Color.primary} onPress={() => setIsSignUp(prevState => !prevState)} />
                            </View>)} 
                        </View>
                       
                    </ScrollView>
                </View>
                </BlurView>
                {/* </TouchableWithoutFeedback> */}
                </LinearGradient>
            </View>   
    )
};

export const screenOptions = {
    headerTitle: 'Authentication'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    formContainer: {
        margin: 26,
        
    },
    blurContainer: {
        backgroundColor: 'black',
        margin: 26,
        flex: 1,
        borderRadius: 15,
    },
    logoHeading: {
        color: 'white',
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 16
    },
    buttonContainer: {
        fontFamily: 'open-sans-bold',
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AuthScreen;