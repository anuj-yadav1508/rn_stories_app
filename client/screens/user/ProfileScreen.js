import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, Button, Alert, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import app from '../../firebase';
import 'firebase/compat/storage';

import Color from '../../constants/Color';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import { updateUser } from '../../redux/actions/authActions';

const ProfileScreen = props => {

    const storage = app.storage();

    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    console.log(user.profilePicture)
    const [selectedUsername, setSelectedUsername] = useState(user.userName);
    const [usernameIsValid, setUsernameIsValid] = useState(true);
    const [touched, setTouched] = useState(false);
    const [selectedImage, setSelectedImage] = useState(user.profilePicture);
    const [changing, setChanging] = useState(false);
    const [isError, setIsError] = useState();
    const [noProfileUrl, setNoProfileUrl] = useState();

    

    // getting no profile url
    useEffect(() => {
        const fetchingNoProfile = async () => {
            try {
                const ref = await storage.ref().child('noprofilepicture.png');
                const url = await ref.getDownloadURL()
                
                setNoProfileUrl(url);
            } catch (err) {
                console.log(err.message);
            }
        }

        fetchingNoProfile();
    }, []);

    const inputTextHanler = text => {
        if(text.length === 0) {
            setUsernameIsValid(false);
            setSelectedUsername('');
            return ;
        }else {
            setSelectedUsername(text);
        }
    };

    const chooseProfileHandler = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status !== 'granted') {
            Alert.alert('Sorry', 'We need camera roll permissions to make this work!', [{ text: 'Okay' }]);
            return ;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3
        });
        console.log(result);
        

        setSelectedImage(result.uri);
        console.log(selectedImage);
    };

    // uploading image on firebase
    const changleProfilePicture = async () => {
        setChanging(true);
        setIsError();
        try {
            
            const response = await fetch(selectedImage);
            const blob = await response.blob();

            const uploadUrl = selectedImage.split('/ImagePicker')[1];

            const ref = await storage.ref().child(`/profiles/${uploadUrl}`);
            const snapshot = await ref.put(blob);
            const profilePictureUrl = await snapshot.ref.getDownloadURL();
            console.log(profilePictureUrl);
            await dispatch(updateUser(selectedUsername, profilePictureUrl));
            props.navigation.navigate('StoriesOverviewScreen');
            setChanging(false)
        } catch (err) {
            setIsError(err.message);
            setChanging(false);
        }
    };

    // const changleProfilePicture = async () => {
    //     await dispatch(updateUser(selectedUsername, selectedImage));
    // };

    // error alerting
    useEffect(() => {
        if(isError) {
            Alert.alert('Sorry', isError, [{ text: 'Okay' }]);
            return ;
        }
    }, [isError]);

    return (
        <ScrollView contentContainerStyle={{flex: 1}} >
        <LinearGradient style={{ flex: 1 }} colors={['#DECBA4','#3E5151']} >
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.heading}>{`${user.userName}`} Your Profile: </Text>
            </View>

            <View style={styles.userNameContainer}> 
                <Text style={styles.userName}>Username:</Text>
                <TextInput placeholder='Your Username' style={styles.userNameTextInput} value={selectedUsername} onChangeText={inputTextHanler} onBlur={() => {setTouched(true)}} />
                {( !usernameIsValid && touched ) && <View style={styles.errorContainer}><Text style={styles.errorText}>Username can't be empty!</Text></View>}
            </View>

            <View style={styles.imageContainer}>
                <View style={styles.iconImageContainer} >
                    { selectedImage ? <Image source={{uri: selectedImage}} resizeMode='cover' style={styles.image} /> : <Image source={{uri: noProfileUrl}} style={styles.image} resizeMode='cover' />}
                

                <Ionicons name='md-pencil-sharp' color='green' style={styles.addIcon} />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title='Choose Profile Picture' color={Color.primary} onPress={chooseProfileHandler} />
                </View>

                <View style={styles.buttonContainer}>
                    { changing ? <ActivityIndicator size='small' color='white' /> : <Button title='Save Profile' color={Color.primary} onPress={changleProfilePicture} /> }
                    
                </View>

            </View>
        </View>
        </LinearGradient>
        </ScrollView>
    )
};

export const screenOptions = navData => {
    return {
        headerTitle: 'Profile',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} title='menu' iconSize={23} onPress={() => navData.navigation.toggleDrawer()} />
            </HeaderButtons>
        )
    }
};


const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    header: {
        margin: 20,
        alignItems: 'center'
    },
    heading: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    userNameContainer: {
        margin: 20,
        alignItems: 'center',
    },
    userName: {
        fontFamily:'open-sans-bold',
        fontSize: 16,
        marginBottom: 15
    },
    userNameTextInput: {
        borderBottomColor: '#888',
        borderBottomWidth: 2,
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        paddingVertical: 8,
        paddingHorizontal: 8,
        color: '#444',
        width: '80%'
    },
    imageContainer: {
        margin: 20,
        alignItems: 'center',
    },
    iconImageContainer: {
        position: 'relative',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginVertical: 20,
        borderColor: 'white',
        borderWidth: 2,
        position: 'relative'
    },
    addIcon: {
        fontSize: 40,
        fontWeight: '800',
        position: 'absolute',
        bottom: 30,
        right: 20
    },
    buttonContainer: {
        width: '80%',
        marginVertical: 20
    },
    errorContainer: {
        margin: 10
    },
    errorText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: 'red',
    }
});


export default ProfileScreen;