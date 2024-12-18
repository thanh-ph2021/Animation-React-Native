import { memo } from 'react'
import { View, Image, Text, ViewToken } from 'react-native'
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { AVATAR_SIZE, SPACING } from '../../Utils'

type ListItemProps = {
    item: { key: string, image: string, name: string, jobTitle: string, email: string }
    viewableItems: SharedValue<ViewToken[]>
}

const ListItem = ({ item, viewableItems }: ListItemProps) => {

    const rStyle = useAnimatedStyle(() => {
        const isVisible = Boolean(viewableItems.value
            .filter(item => item.isViewable)
            .find(viewableItem => viewableItem.item.key === item.key))
        return {
            // opacity: withTiming(isVisible ? 1 : 0),
            transform: [
                { scale: withTiming(isVisible ? 1 : .8) }]
        }
    })
    return (
        <Animated.View
            style={[{
                flexDirection: 'row',
                alignItems: 'center',
                padding: SPACING,
                elevation: 6,
                gap: 8,
                backgroundColor: 'white',
                borderRadius: 8,
            }, rStyle]}
        >
            <Image source={{ uri: item.image }} style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE }} />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 14, opacity: .7, flexShrink: 1 }}>{item.jobTitle}</Text>
                <Text style={{ fontSize: 13, opacity: .7, color: 'blue' }}>{item.email}</Text>
            </View>
        </Animated.View>
    )
}

export default memo(ListItem)