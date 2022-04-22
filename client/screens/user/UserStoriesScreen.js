import React, { useState } from "react";
import { FlatList, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import StoryItem from '../../components/StoryItem';
import CustomHeaderButton from "../../components/CustomHeaderButton";
import { deleteStory } from "../../redux/actions/storiesActions";

const UserStoryScreen = props => {
    const dispatch = useDispatch();
    
    const stories = useSelector(state => state.stories.stories);   
    const user = useSelector(state => state.auth.user);

    const userStories = stories.filter(story => story.userId === user._id);

    const RenderStoryItem = (itemData) => {
        return <StoryItem profilePictureUrl={itemData.item.userProfilePicture} title={itemData.item.title} userName={itemData.item.userName} date={itemData.item.createdAt} imageUrl={itemData.item.imageUrl} description={itemData.item.description} onPress={() => props.navigation.navigate('StoryDetailScreen', {
            storyId: itemData.item.storyId,
            userName: itemData.item.userName
        })} userStoryItem onEditPress={() => props.navigation.navigate('EditStoryScreen', {
            storyId: itemData.item.storyId
        })} storyId={itemData.item.storyId} />
    };

    return <FlatList data={userStories} keyExtractor={item => item.storyId} renderItem={RenderStoryItem} />
};

export const screenOptions = navData => {
    return {
        headerTitle: 'Your Stories',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title='menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => navData.navigation.toggleDrawer()} />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title='menu' iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'} onPress={() => navData.navigation.navigate('EditStoryScreen')} />
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({});

export default UserStoryScreen;