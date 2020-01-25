import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Image } from 'react-native';
import Logo from '../assets/logo.png';

import AddBook from '../screens/AddBook';
import Collection from '../screens/Collection';

const Navigator = createStackNavigator({
    Collection,
    AddBook
}, {
    defaultNavigationOptions: {
        title: <Image style={{width: 125, height: 25}} source={Logo}/>,
        headerStyle: {height: 100}
    }
});

export default createAppContainer(Navigator);