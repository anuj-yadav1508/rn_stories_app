import React, { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import StoryItem from '../../components/StoryItem';
import CustomHeaderButton from "../../components/CustomHeaderButton";
import { loadStories, loadingFavourites } from "../../redux/actions/storiesActions";
import Color from "../../constants/Color";

const StoriesOverviewScreen = props => {
    const stories = useSelector(state => state.stories.stories);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // fetchStories function
    const fetchStories = async () => {
            try {
                setIsRefreshing(true);
                setIsLoading(true);
                await dispatch(loadStories());
                setIsLoading(false);
                setIsRefreshing(false);
            } catch (err) {
                setIsError(err.message);
                setIsLoading(false);
                setIsRefreshing(false);
            }
        };
          
        // for fetching all stories
        useEffect(() => {
            fetchStories();
        }, [dispatch, loadStories]);

    // error alert 
    useEffect(() => {
        if(isError) {
            Alert.alert('Ooops!', isError, [{ text: 'Okay' }]);
            return;
        }
    }, [isError]);

    const RenderStoryItem = (itemData) => {
        return <StoryItem profilePictureUrl={itemData.item.userProfilePicture} title={itemData.item.title} userName={itemData.item.userName} date={itemData.item.createdAt} imageUrl={itemData.item.imageUrl} description={itemData.item.description} onPress={() => props.navigation.navigate('StoryDetailScreen', {
            storyId: itemData.item.storyId,
            userName: itemData.item.userName
        })}  />
    };

    if(isLoading) {
        return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size='large' color={Color.primary} />
        </View>
        )
    };

    return <FlatList onRefresh={fetchStories} refreshing={isRefreshing} data={stories} keyExtractor={item => item.storyId} renderItem={RenderStoryItem} />
};

export const screenOptions = navData => {

    return {
    headerTitle : 'Stories',
    headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={ CustomHeaderButton } >
            <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => navData.navigation.toggleDrawer()} />
        </HeaderButtons>
    )
 };
};

const styles = StyleSheet.create({

});

export default StoriesOverviewScreen;