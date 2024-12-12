import { Dimensions } from "react-native"

export const PADDING = 10
export const MARGIN = 5
export const RADIUS = 5
export const TEXT_SIZE = 18

export const {height, width } = Dimensions.get("window")

export type RootStackParamList = {
    Home: undefined
    GestureHandler: undefined
    GestureHandler1: undefined
    GallaryView: undefined
}