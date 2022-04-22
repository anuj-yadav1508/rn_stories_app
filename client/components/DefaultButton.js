import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Color from '../constants/Color';

const CustomButton = props => {
    return (
        <View style={styles.buttonContainer}>
            <Text style={styles.buttonText} {...props} onPress={props.onPress} >{props.children}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '80%',
        backgroundColor: Color.primary,
        color: 'white',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        textAlign: 'center',
        alignItems: 'center'
    }
});

export default CustomButton;