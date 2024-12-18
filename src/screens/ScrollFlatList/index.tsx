import { View, Image, StyleSheet, StatusBar, Animated, ViewToken } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { BG_IMAGE, DATA_USERS, SPACING } from '../../Utils'
import ListItem from './ListItem'


const ScrollFlatList = () => {
    const viewableItems = useSharedValue<ViewToken[]>([])

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar hidden />
            <Image
                source={{ uri: BG_IMAGE }}
                style={{ ...StyleSheet.absoluteFillObject }}
                blurRadius={30}
            />
            <Animated.FlatList
                data={DATA_USERS}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ padding: SPACING, gap: SPACING, paddingTop: (StatusBar.currentHeight || 42) + 5 }}
                onViewableItemsChanged={({ viewableItems: vItems }) => {
                    viewableItems.value = vItems
                }}
                renderItem={({ item }) => {
                    return <ListItem item={item} viewableItems={viewableItems} />
                }}
            />
        </View>
    )
}

export default ScrollFlatList