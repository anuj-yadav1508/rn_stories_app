import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";

import CustomHeaderButton from "../../components/CustomHeaderButton";
import { deFavouritigStory, favouriteToggle, favouritingStory } from "../../redux/actions/storiesActions";


const StoryDetailScreen = props => {
    const dispatch = useDispatch();
    const [isStoryFavourited, setIsStoryFavourited] = useState()
    const storyId = props.route.params.storyId;
    
    const selectedStory = useSelector(state => state.stories.stories).find(story => story.storyId === storyId);

    const favouriteStories = useSelector(state => state.stories.favouriteStories);
    const favourited = !!favouriteStories.find(story => story.storyId === storyId);
    
    
    useEffect(() => {
        if(favourited) {
            setIsStoryFavourited(true)
        }else {
            setIsStoryFavourited(false)
        }
    }, [ favourited]);

    // favouriting story
    const favouriteHandler = async  () => {
        try {
           if(!favourited) {
               await dispatch(favouritingStory(storyId));
                dispatch(favouriteToggle(storyId));
           } else {
               await dispatch(deFavouritigStory(storyId));
               dispatch(favouriteToggle(storyId));
           }
        } catch (err) {
            console.log(err.message);
        }
       
    };

    const { navigation } = props;

    // setting options
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title='Fav' iconName={isStoryFavourited ? 'ios-star' : 'ios-star-outline'} onPress={favouriteHandler} />
            </HeaderButtons>
        )
        })
    },[favouriteHandler]);
    
    return (
        
        <ScrollView>
            <View style={styles.screen}>
            <View style={styles.userInfoContainer}>
                <Image source={{ uri: selectedStory.userProfilePicture }} resizeMode='cover' style={styles.profilePicture} />
                <Text style={styles.userName}>{selectedStory.userName}</Text>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>{selectedStory.title}</Text>
            </View>

            <View style={styles.dateContainer}> 
                <Text style={styles.date}>Posted on: {moment(new Date(selectedStory.createdAt)).format('MMMM Do YYYY')}</Text>
            </View>

            <View style={styles.storyContainer}>
                <Image source={{ uri: selectedStory.imageUrl }} style={styles.storyImage} resizeMode='cover' />
                <Text>{selectedStory.description}</Text>
            </View>
            </View>
        </ScrollView>
    )
};

export const screenOptions = navData => {
    const userName = navData.route.params.userName;
    return {
        headerTitle: `${userName}'s Story`,
        
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin: 20
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBF6F7',
        marginBottom: 20,
        paddingVertical: 10,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.26,
        shadowRadius: 6,
        borderRadius: 6,
        elevation: 6
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 15
    },
    userName: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginLeft: 20,
        
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    dateContainer: {
        alignItems: 'flex-end',
        marginBottom: 15
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#444'
    },
    storyContainer: {
        width: '100%',
        height: 'auto'
    },
    storyImage: {
        width: '100%',
        height: 300,
        borderRadius: 6,
        marginBottom: 20
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 18,
        lineHeight: 1.3
    }
});

export default StoryDetailScreen;