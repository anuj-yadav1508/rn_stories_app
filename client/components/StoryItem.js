import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform, Alert, ActivityIndicator } from 'react-native';
import moment from 'moment';
import app from '../firebase';
import 'firebase/compat/storage';

import Color from '../constants/Color';
import { useDispatch } from 'react-redux';
import { deleteStory } from '../redux/actions/storiesActions';

const StoryItem = props => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isError, setIsError] = useState();
    const dispatch = useDispatch();

    let Touchable = TouchableOpacity;
    if(Platform.OS === 'android') {
        Touchable = TouchableNativeFeedback;
    };

    const storage = app.storage();

    const { storyId, imageUrl } = props;
    
    const path1 = imageUrl.split('2F')[1];
    const path2 = path1?.split('?')[0];
    
    

    // story delete handler
    const storyDeleteHandler = async () => {
        setIsError();
        try {
            setIsDeleting(true);
            const ref = await storage.ref().child(`/images/${path2}`);
            await ref.delete();

            await dispatch(deleteStory(storyId));
            
        } catch (err) {
            
            setIsError(err.message);
            
        }
        setIsDeleting(false);
    };

    // error alert
    useEffect(() => {
        if(isError) {
            Alert.alert('Ooops!', isError, [{ text: 'Okay' }]);
            return ;
        }
    }, [isError]);

    return (
        <TouchableOpacity onPress={props.onPress} >
        <ScrollView style={styles.screen}>
            
            
            <View style={styles.userInfo}>
                <Image source={{uri: props.profilePictureUrl}}  style={styles.profilePicture} />
                <Text style={styles.userName}>{props.userName}</Text>
            </View>

            <View style={styles.storyInfo}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.date}>{moment(new Date(props.date)).format('MMMM Do YYYY')}</Text>
            </View>

            <View style={styles.storyContainer}>
                <Image source={{uri: props.imageUrl}} style={styles.storyImage} resizeMode='cover' />

                <Text style={styles.description}>{`${props.description.slice(0, 100)}...`}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button title='Show Details' color={Color.primary} onPress={props.onPress} />
            </View>

            { props.userStoryItem && (
                <View style={styles.userButtonContainer}>
                    <View style={styles.userButtons}>
                        <Button title='Edit' color={Color.primary} onPress={props.onEditPress} />
                    </View>
                    <View style={styles.userButtons}>
                        { isDeleting ? (<ActivityIndicator size='small' color={Color.primary} />) : <Button title='Delete' color={Color.primary} onPress={storyDeleteHandler} /> }
                        
                    </View>
                </View>
            )}
           
           
        </ScrollView>
         </TouchableOpacity>
        
    )
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.26,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        // maxHeight: 420
    },
    userInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBF6F7',
        borderRadius: 6,
        marginBottom: 10
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
    },
    userName: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: Color.primary,
        
    },
    storyInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        fontFamily: 'open-sans-bold',
        marginLeft: 10,
        fontSize: 15,
        maxWidth: '60%'
    },
    date: {
        fontFamily: 'open-sans',
        color: '#444'
    },
    storyContainer: {
        height: 250
    },
    storyImage: {
        width: '100%',
        height: '75%',
        borderRadius: 5
    },
    description: {
        fontFamily: 'open-sans',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        marginBottom: 20
    },
    userButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userButtons: {
        width: '30%'
    }
});

export default StoryItem;