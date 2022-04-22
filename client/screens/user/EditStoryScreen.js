import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Image, TextInput, Button, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as ImagePicker from 'expo-image-picker';
import app from '../../firebase';
import 'firebase/compat/storage';

import CustomHeaderButton from '../../components/CustomHeaderButton';
import { useSelector, useDispatch } from "react-redux";
import Color from "../../constants/Color";
import { createStory, updateStory } from "../../redux/actions/storiesActions";

const EditStoryScreen = props => {
    const dispatch = useDispatch()
    const storyId = props.route.params?.storyId;
    const story = useSelector(state => state.stories.stories).find(story => story.storyId === storyId);
    const [isError, setIsError] = useState();
    const [selectedImage, setSelectedImage] = useState(storyId ? story.imageUrl : null );
    const [uploading, setUploading] = useState(false);

    const [title, setTitle] = useState(storyId ? story.title : '');
    const [description, setDescription] = useState(storyId ? story.description : '');
    const [titleIsValid, setTitleIsValid] = useState(storyId ? true : false);
    const [descriptionIsValid, setDescriptionIsValid] = useState(storyId ? true : false);
    const [titleIsTouched, setTitleIsTouched] = useState(false);
    const [descIsTouched, setDescIsTouched] = useState(false);
    

    const storage = app.storage();

    // uploading to firebase
    const uploadImage = async () => {
        setUploading(true);
        try {
            
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError("Network request failed!"));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', selectedImage, true);
                xhr.send(null);
            });

            const uploadUrl = selectedImage.split('/ImagePicker')[1];

            const ref = await storage.ref().child(`/images/${uploadUrl}`);
            const snapshot = await ref.put(blob);
            const url = await snapshot.ref.getDownloadURL();
            setUploading(false);
            await dispatch(createStory(title, url, description));
            props.navigation.goBack();

            console.log('downloaded: ', url);
        } catch (err) {
            setIsError(err.message);
            setUploading(false);
        }
    };

    const chooseImageHandler = async () => {
        
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if(status !== 'granted') {
                Alert.alert('sorry!', 'We need camera roll permissions to make this work!', [{ text: 'Okay', style: 'destructive'}]);
                return ;
            }

            if( status === 'granted') {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.3
                });

                if(!result.cancelled) {
                    
                    setSelectedImage(result.uri);
                }
            }
    };



    // title
    const titleChangeHandler = text => {
        if( text.trim().length === 0) {
            setTitleIsValid(false);
            setTitle('');
        }else {
            setTitle(text);
            setTitleIsValid(true);
        }
    };

    // description
    const descriptionChangeHandler = text => {
        if( text.trim().length === 0) {
            setDescriptionIsValid(false);
            setDescription('');
        }else {
            setDescription(text);
            setDescriptionIsValid(true);
        }
    };

    // submit handler 
    const submitHandler =  async () => {
        setIsError();
        if(titleIsValid === false || descriptionIsValid === false) {
            Alert.alert("Can't submit!", 'Please, check your inputs!', [{ text: 'Okay' }]);
            return ;
        }

        

        try {
            if(storyId) {
               
              await dispatch(updateStory(storyId, title, selectedImage, description));
            //   await uploadImage();
               props.navigation.navigate('UserStoriesScreen');
        }else {
                uploadImage();
        }
        } catch (err) {
           setIsError(err.message);
        }
       
    };

    // error alert
    useEffect(() => {
        if(isError) {
            Alert.alert('Ooops!', isError, [{ text: 'Okay' }]);
            return ;
        }
    }, [isError]);


    // setting title header conditionally 
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: storyId ? 'Edit Story' : 'Add Story',
            headerRight: () => (
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title='Save' iconName={Platform.OS === 'android' ? 'md-save-sharp' : 'ios-save-sharp'} onPress={submitHandler}  />
            </HeaderButtons>
        )
        })
    }, [storyId]);

    return (
         <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={50}>
       
        <ScrollView>
            <View style={styles.screen}>
                
           <View style={styles.userInfoContainer}>
               <Image source={{uri: 'https://images.unsplash.com/photo-1502613374390-8da7aa532177?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'}} style={styles.profilePicture} resizeMode='cover' />
               <Text style={styles.userName}>Anuj Yaduvanshi</Text>
           </View> 

           <View style={styles.titleContainer}>
               <Text style={styles.heading}>{storyId ? 'Edit' : 'Add'} Your Title: </Text>
               <TextInput style={styles.titleTextInput} placeholder='Title' value={title} onChangeText={titleChangeHandler} onBlur={() => setTitleIsTouched(true)} />
               {(!titleIsValid && titleIsTouched) && <View style={styles.errorContainer}><Text style={styles.errorText}>Error Occured!</Text></View> }
           </View>

           <View style={styles.imagePreviewContainer}>
               <View style={styles.imageContainer}>
                   <Text style={styles.heading}>{storyId ? 'Edit' : 'Add'} Your Image: </Text>
                   <View style={styles.imagePreviewWrapper}>
                   {
                       selectedImage ? <Image source={{uri: selectedImage}} style={styles.imagePreview} /> : <View style={styles.imagePreview}><Text>No image selected to show preview!</Text></View>
                   }
                   </View>
               </View>

               <View style={styles.chooseImageButton}>
                <Button title='Choose Image' onPress={chooseImageHandler} color={Color.primary} />
               </View>
           </View>

           <View style={styles.descriptionContainer}>
               <Text style={styles.heading}>{storyId ? 'Edit' : 'Add'} your story description: </Text>
               <TextInput placeholder='Description' style={styles.storyDescription} multiline value={description} onChangeText={descriptionChangeHandler} onBlur={() => setDescIsTouched(true)} />
               {(!descriptionIsValid && descIsTouched) && <View style={styles.errorContainer}><Text style={styles.errorText}>Error Occured!</Text></View> }
           </View>
        
            <View style={styles.saveButton}>
                { uploading ? <ActivityIndicator size='small' color={Color.primary} /> : <Button title={`Save ${storyId ? 'Edited' : 'Added'} Story`} color={Color.primary} onPress={submitHandler} /> }   
           </View>
            
           </View>
        </ScrollView>
        
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
};

export const screenOptions = navData => {
    return {
        // headerRight: () => (
        //     <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
        //         <Item title='Save' iconName={Platform.OS === 'android' ? 'md-save-sharp' : 'ios-save-sharp'}  />
        //     </HeaderButtons>
        // )
    }
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    userInfoContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#EBF6F7',
        alignItems: 'center',
        marginBottom: 20
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userName: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginLeft: 15
    },
    titleContainer: {},
    heading: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: '#444',
        marginBottom: 6
    },
    titleTextInput: {
        fontFamily: 'open-sans',
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderBottomColor: '#888',
        borderBottomWidth: 2
    },
    imagePreviewContainer: {
        marginVertical: 15
    },
    imageContainer: {
        marginVertical: 20
    },
    imagePreviewWrapper: {
        marginVertical: 10,
        width: '100%',
        height: 300,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.26,
        shadowRadius: 6,
        borderRadius: 6,
        backgroundColor: 'white' ,
        elevation: 6,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chooseImageButton: {
        marginVertical: 20
    },
    descriptionContainer: {},
    storyDescription: {
        minHeight: 100,
        borderBottomColor: '#888',
        borderBottomWidth: 2,
        fontFamily: 'open-sans',
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 16
    },
    saveButton: {
        marginBottom: 25,
        marginHorizontal: 40,
        marginTop: 25
    },
    errorContainer: {
        marginTop: 6
    },
    errorText: {
        color: 'red',
        fontFamily: 'open-sans',
        fontSize: 15
    }
});

export default EditStoryScreen;