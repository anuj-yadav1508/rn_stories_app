import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Platform, View, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import StoryItem from '../../components/StoryItem';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import { loadingFavourites } from '../../redux/actions/storiesActions';
import Color from '../../constants/Color';

const FavouritesStoriesScreen = props => {
    const dispatch = useDispatch();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchingFavourites = async () => {
        setIsRefreshing(true);
            try {
                await dispatch(loadingFavourites());
                setIsRefreshing(false);
            } catch (err) {
                console.log(err.message);
                setIsRefreshing(false);
            }
        };

    useEffect(() => {
        fetchingFavourites();
    }, [dispatch]);
    
        const favouriteStories = useSelector(state => state.stories.favouriteStories);
        console.log(favouriteStories);

        const RenderStoryItem = (itemData) => {
            return <StoryItem profilePictureUrl={itemData.item.userProfilePicture} title={itemData.item.title} userName={itemData.item.userName} date={itemData.item.createdAt} imageUrl={itemData.item.imageUrl} description={itemData.item.description} onPress={() => props.navigation.navigate('StoryDetailScreen', {
                storyId: itemData.item.storyId,
                userName: itemData.item.userName
            })}  />
        };

        if(favouriteStories === undefined) {
            return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color={Color.primary} />
            </View>
        }

        if(favouriteStories) {
            return <FlatList onRefresh={fetchingFavourites} refreshing={isRefreshing} data={favouriteStories} keyExtractor={item => item.storyId} renderItem={RenderStoryItem} />
        }
};

export const screenOptions = navData => {
    return {
        headerTitle: 'Favourite Stories',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title='menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => navData.navigation.toggleDrawer()} />
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({});

export default FavouritesStoriesScreen;