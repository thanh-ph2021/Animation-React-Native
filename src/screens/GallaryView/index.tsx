import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PEXELS_API_KEY } from './config'
import { useEffect, useRef, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { height, width } from '../../Utils'

const API_URL = `https://api.pexels.com/v1/search?query=nature&per_page=20`

const fetchImageImageFromPexels = async () => {
    const data = await fetch(API_URL, {
        headers: {
            'Authorization': PEXELS_API_KEY
        }
    })

    const results = await data.json()

    return results
}

type PhotoType = {
    id: number
    width: number
    height: number
    url: string
    photographer: string
    photographer_url: string
    photographer_id: number
    avg_color: string
    src: {
        original: string
        large2x: string
        large: string
        medium: string
        small: string
        portrait: string
        landscape: string
        tiny: string
    }
    liked: boolean
    alt: string
}

type ResponseType = {
    page: number
    per_page: number
    photos: PhotoType[]
    total_results: number
    next_page: string
}

const IMAGE_SIZE = 80
const SPACING = 10

const GallaryView = () => {

    const [images, setImages] = useState<PhotoType[] | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const topRef = useRef<any>()
    const thumbRef = useRef<any>()

    const scrollToIndex = (index: number) => {
        setActiveIndex(index)
        topRef?.current?.scrollToOffset({
            offset: index * width,
            animated: true
        })
        if (index * (IMAGE_SIZE + SPACING) > width / 2) {
            thumbRef?.current?.scrollToOffset({
                offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
                animated: true
            })
        } else {
            thumbRef?.current?.scrollToOffset({
                offset: 0,
                animated: true
            })
        }
    }

    useEffect(() => {
        const fetchImages = async () => {
            const response: ResponseType = await fetchImageImageFromPexels()

            setImages(response.photos)
        }

        fetchImages()
    }, [])

    if (!images) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={'blue'} size={50} />
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor={'transparent'}
            />
            <FlatList
                ref={topRef}
                horizontal
                pagingEnabled
                data={images}
                keyExtractor={(item, _) => item.id.toString()}
                onMomentumScrollEnd={(ev) => {
                    scrollToIndex(Math.floor(ev.nativeEvent.contentOffset.x / width))
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ width, height }}>
                            <FastImage
                                source={{ uri: item.src.portrait }}
                                style={[StyleSheet.absoluteFillObject]}
                                resizeMode='cover'
                            />
                        </View>

                    )
                }}
            />
            <FlatList
                ref={thumbRef}
                horizontal
                data={images}
                keyExtractor={(item, _) => item.id.toString()}
                style={{ position: 'absolute', bottom: 12 }}
                contentContainerStyle={{ paddingHorizontal: SPACING, gap: SPACING }}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => scrollToIndex(index)}>
                            <FastImage
                                source={{ uri: item.src.portrait }}
                                style={{
                                    width: IMAGE_SIZE,
                                    height: IMAGE_SIZE,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: activeIndex === index ? 'white' : 'transparent'
                                }}
                                resizeMode='cover'
                            />
                        </TouchableOpacity>

                    )
                }}
            />
        </View>
    )
}

export default GallaryView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})