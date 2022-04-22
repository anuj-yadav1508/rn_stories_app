import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContent, DrawerItemList } from '@react-navigation/drawer';
import { Platform, View, Text, SafeAreaView, Button } from 'react-native';

import StoriesOverviewScreen, { screenOptions as StoriesOverviewScreenOptions} from '../screens/stories/StoriesOverviewScreen';
import StoryDetailScreen, { screenOptions as StoryDetailScreenOptions } from '../screens/stories/StoryDetailScreen';
import NewStoryScreen from '../screens/stories/NewStoryScreen';
import UserStoriesScreen, { screenOptions as UserStoriesScreenOptions } from '../screens/user/UserStoriesScreen';
import EditStoryScreen, { screenOptions as EditStoryScreenOptions } from '../screens/user/EditStoryScreen';
import FavouritesStoriesScreen, { screenOptions as FavouritesStoriesScreenOptions } from '../screens/stories/FavouritesStoriesScreen';
import AuthScreen, { screenOptions as AuthScreenScreenOptions } from '../screens/auth/AuthScreen';
import Colors from '../constants/Color';
import Color from '../constants/Color';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import ProfileScreen, { screenOptions as ProfileScreenOptions } from '../screens/user/ProfileScreen';

// default stack navigation options
const defaultNavigationOptions = {
    headerStyle : {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
    },
    headerTintColor : Platform.OS === 'ios' ? Colors.primary : 'white',
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    }
}

const storiesStcackNavigator = createStackNavigator();

export const StoriesNavigator = () => {
    return (
        <storiesStcackNavigator.Navigator screenOptions={defaultNavigationOptions}>
            <storiesStcackNavigator.Screen name='StoriesOverviewScreen' component={StoriesOverviewScreen} options={StoriesOverviewScreenOptions} />

            <storiesStcackNavigator.Screen name='StoryDetailScreen' component={StoryDetailScreen} options={StoryDetailScreenOptions} />

            <storiesStcackNavigator.Screen name='NewStoryScreen' component={NewStoryScreen} />

        </storiesStcackNavigator.Navigator>
    )
};

// making user stack navigator
const userStackNavigator = createStackNavigator();

export const UserStack = () => {
    return (
        <userStackNavigator.Navigator screenOptions={defaultNavigationOptions} >
            <userStackNavigator.Screen name='UserStoriesScreen' component={UserStoriesScreen} options={UserStoriesScreenOptions} />

            <userStackNavigator.Screen name='EditStoryScreen' component={EditStoryScreen} options={EditStoryScreenOptions} />
        </userStackNavigator.Navigator>
    )
};

// making favourites stack navigator
const favouriteStackNavigator = createStackNavigator();

export const FavouritesStack = () => {
    return (
        <favouriteStackNavigator.Navigator screenOptions={defaultNavigationOptions}>
            <favouriteStackNavigator.Screen name='FavouritesStoriesScreen' component={FavouritesStoriesScreen} options={FavouritesStoriesScreenOptions} />
        </favouriteStackNavigator.Navigator>
    )
};

// Auth Navigator
const storiesAuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (
    <storiesAuthStackNavigator.Navigator screenOptions={defaultNavigationOptions}>
        <storiesAuthStackNavigator.Screen name='AuthScreen' component={AuthScreen} options={AuthScreenScreenOptions} />
    </storiesAuthStackNavigator.Navigator>
    )
};

// stack navigator for profile screen
const profileStackNavigator = createStackNavigator();

export const ProfileNavigator = () => {
    return (
        <profileStackNavigator.Navigator screenOptions={defaultNavigationOptions} >
            <profileStackNavigator.Screen name='ProfileScreen' component={ProfileScreen} options={ProfileScreenOptions} />
        </profileStackNavigator.Navigator>
    )
};

const storiesDrawerNavigator = createDrawerNavigator();

export const StoriesMainNavigator = () => {
    const dispatch = useDispatch();
    return (
        <storiesDrawerNavigator.Navigator drawerContentOptions={
            {
                activeBackgroundColor: Color.primary,
                activeTintColor: 'white'
            }
        }
        drawerContent={ props => {
            
            return (
                <View style={{ flex: 1 }}>
                    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
                    <DrawerItemList {...props} />
                    <Button title='Logout' color={Color.primary} onPress={() => dispatch(logout())} />
                    </SafeAreaView>
                </View>
            )
        }}
        >
            <storiesDrawerNavigator.Screen name='Stories' component={StoriesNavigator} options={{
                drawerIcon: props => (
                    <Ionicons name={Platform.OS === 'android' ? 'md-bonfire-sharp' : 'ios-bonfire-sharp'} color={props.focused ? 'white' : Color.primary } size={props.size} />
                )
            }} />

            <storiesDrawerNavigator.Screen name='User' component={UserStack} options={{
                drawerIcon: props => (
                    <Ionicons name={Platform.OS === 'android' ? 'md-person' : 'ios-person'} color={props.focused ? 'white' : Color.primary } size={props.size} />
                ),
                drawerLabel: 'User Stories'
            }} />

            <storiesDrawerNavigator.Screen name='Favourites' component={FavouritesStack} options={{
                drawerIcon: props => (
                    <Ionicons name={Platform.OS === 'android' ? 'md-star' : 'ios-star'} color={props.focused ? 'white' : Color.primary } size={props.size} />
                )
            }} />

            <storiesDrawerNavigator.Screen name='Profile' component={ProfileNavigator} options={{
                drawerIcon: props => (
                    <Ionicons name={Platform.OS === 'android' ? 'md-person-circle-outline' : 'ios-person-circle-outline'} color={props.focused ? 'white' : Color.primary} size={props.size} />
                )
            }} />
        </storiesDrawerNavigator.Navigator>
    )
};