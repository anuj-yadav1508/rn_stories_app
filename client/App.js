import React, { useState } from 'react';
import * as Fonts from 'expo-font';
import AppLoading from 'expo-app-loading';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AppNavigator from './navigation/NavigationContainer';
import StoriesReducer from './redux/reducers/storiesReducer';
import AuthReducer from './redux/reducers/authReducer';


 
const rootReducer = combineReducers({
  stories: StoriesReducer,
  auth: AuthReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));



const fetchFonts = () => {
  return (
  Fonts.loadAsync({
  'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
  'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf')
  })
)};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  if(!isLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setIsLoaded(true)} onError={() => console.log('Font Error Occured!')} />
  }

  return <Provider store={store} ><AppNavigator /></Provider>
}