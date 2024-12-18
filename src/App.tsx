import React from 'react'
import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { RootStackParamList } from './Utils'
import { ScrollFlatList, HomeScreen, GestureHandler1, GallaryView, GestureHandler, ScrollFlatList1 } from './screens'

const RootStack = createNativeStackNavigator<RootStackParamList>({
    initialRouteName: 'Home',
    screens: {
        Home: HomeScreen,
        GestureHandler: GestureHandler,
        GestureHandler1: GestureHandler1,
        GallaryView: GallaryView,
        ScrollFlatList: ScrollFlatList,
        ScrollFlatList1: ScrollFlatList1,
    },
    screenOptions: {
        headerShown: false
    }
})

const Navigation = createStaticNavigation(RootStack)

function App(): React.JSX.Element {
    return <GestureHandlerRootView>
        <Navigation />
    </GestureHandlerRootView>
}

export default App