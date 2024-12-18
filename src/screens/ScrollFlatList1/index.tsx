import { useRef } from 'react'
import { View, Image, Text, StyleSheet, StatusBar, Animated } from 'react-native'

import { AVATAR_SIZE, BG_IMAGE, DATA_USERS, SPACING } from '../../Utils'

const ITEM_HEIGHT = AVATAR_SIZE + SPACING * 3

const ScrollFlatList1 = () => {
    const scrollY = useRef(new Animated.Value(0)).current
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
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        useNativeDriver: true, listener: () => {
                            console.log("🚀 ~ ScrollFlatList1 ~ scrollY:", scrollY)
                        }
                    }
                )}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ padding: SPACING, gap: SPACING, paddingTop: (StatusBar.currentHeight || 42) }}
                renderItem={({ item, index }) => {
                    const inputRange = [
                        -1,
                        0,
                        ITEM_HEIGHT * index,
                        ITEM_HEIGHT * (index + 2)
                    ]
                    const scale = scrollY.interpolate({
                        inputRange,
                        outputRange: [1, 1, 1, 0],
                        extrapolate: 'clamp'
                    })

                    return (
                        <Animated.View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: SPACING,
                                elevation: 6,
                                gap: 8,
                                backgroundColor: 'white',
                                borderRadius: 8,
                                transform: [{ scale }]
                            }}
                        >
                            <Image source={{ uri: item.image }} style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {item.name}</Text>
                                <Text style={{ fontSize: 14, opacity: .7, flexShrink: 1 }}>{item.jobTitle}</Text>
                                <Text style={{ fontSize: 13, opacity: .7, color: 'blue' }}>{item.email}</Text>
                            </View>
                        </Animated.View>
                    )
                }}
            />
        </View>
    )
}

export default ScrollFlatList1