import { useEffect, useState } from 'react'
import { snapPoint } from 'react-native-redash'
import {Image, ImageRequireSource, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { FlatList, Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import FastImage, { Source } from 'react-native-fast-image'
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from 'react-native-reanimated'
import Icon from '@react-native-vector-icons/ionicons'

import { height, width } from '../../Utils'

const getHitSlop = (padding: number) => ({
    top: padding,
    bottom: padding,
    left: padding,
    right: padding,
})

const SNAP_POINTS = [-height, 0, height]

type ImageType = {
    source: Source | ImageRequireSource,
    width?: number,
    height?: number
}

interface LightBoxProps {
    visible: boolean,
    onRequestClose: () => void,
    sources: ImageType[]
}

const getImageSize = (source: Source | ImageRequireSource): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        if (typeof source === 'number') {
            const { width, height } = Image.resolveAssetSource(source)
            resolve({ width, height })
        } else if (typeof source === 'object' && 'uri' in source && source.uri) {
            Image.getSize(source.uri, (width, height) => {
                resolve({ width, height })
            })
        } else {
            reject(console.log('Invalid image source'))
        }
    })
}

const LightBox = ({ visible, onRequestClose, sources }: LightBoxProps) => {
    const scale = useSharedValue(1)
    const translateY = useSharedValue(0)
    const focalX = useSharedValue(0)
    const focalY = useSharedValue(0)

    const [images, setImages] = useState<ImageType[]>(sources)

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const updateImages = await Promise.all(
                    sources.map(async (item) => {
                        const { width: imgWidth, height: imgHeight } = await getImageSize(item.source)
                        const ratio = width / imgWidth
                        return {
                            ...item,
                            width,
                            height: ratio * imgHeight
                        }
                    })

                )
                setImages(updateImages)
            } catch (error) {
                console.log("🚀 ~ fetchSizes ~ error:", error)
            }
        }

        fetchSizes()

    }, [sources])

    const onClose = () => {
        translateY.value = withTiming(0)
        scale.value = withTiming(1)
        onRequestClose()
    }

    const pinGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = e.scale
            focalX.value = e.focalX
            focalY.value = e.focalY
        })
        .onEnd(() => {
            scale.value = withTiming(1)
        })

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateY.value = e.translationY
        })
        .onEnd((e) => {
            const dest = snapPoint(translateY.value, e.velocityY, SNAP_POINTS)
            translateY.value = withTiming(dest, {}, () => {
                if (dest !== 0) {
                    runOnJS(onClose)()
                }
            })
        })
        .maxPointers(1)

    const composed = Gesture.Simultaneous(panGesture, pinGesture)

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [-height, 0, height],
            [1 + translateY.value / height, 1, 1 - translateY.value / height],
            Extrapolation.CLAMP,
        ),
    }))

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { translateX: focalX.value },
                { translateY: focalY.value },
                { translateX: -width / 2 },
                { translateY: -height / 2 },
                { scale: scale.value },
                { translateX: -focalX.value },
                { translateY: -focalY.value },
                { translateX: width / 2 },
                { translateY: height / 2 },
                {
                    scale: interpolate(
                        translateY.value,
                        [-height, 0, height],
                        [0, 1, 0],
                        Extrapolation.CLAMP,
                    ),
                },
            ],
            opacity: interpolate(
                translateY.value,
                [-height, 0, height],
                [0, 1, 0],
                Extrapolation.CLAMP,
            ),
        }
    })

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Modal
                statusBarTranslucent
                transparent
                animationType='none'
                visible={visible}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Animated.View style={[styles.backdrop, backdropStyle]}>
                        <Animated.View entering={ZoomIn} style={{ position: 'absolute', top: 40, right: 15, zIndex: 3 }}>
                            <TouchableOpacity hitSlop={getHitSlop(20)} onPress={() => onClose()}>
                                <Icon name='close' size={30} color={'white'} />
                            </TouchableOpacity>
                        </Animated.View>
                        <GestureDetector gesture={composed}>
                            <FlatList
                                horizontal
                                pagingEnabled
                                data={images}
                                // contentContainerStyle={{ gap: SPACING }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]} key={index}>
                                            <Animated.View entering={ZoomIn}>
                                                <FastImage
                                                    style={{ width: item.width, height: item.height }}
                                                    source={item.source}
                                                    resizeMode='contain'
                                                />
                                            </Animated.View>
                                        </Animated.View>
                                    )
                                }}
                            />
                        </GestureDetector>
                    </Animated.View>
                </GestureHandlerRootView>
            </Modal>
        </View>
    )
}

export default LightBox

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        backgroundColor: 'black',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    }
})