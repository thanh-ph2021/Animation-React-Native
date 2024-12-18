import { faker } from "@faker-js/faker"
import { Dimensions } from "react-native"

export const PADDING = 10
export const MARGIN = 5
export const RADIUS = 5
export const TEXT_SIZE = 18
export const SPACING = 20
export const AVATAR_SIZE = 50

export const {height, width } = Dimensions.get("window")

export type RootStackParamList = {
    Home: undefined
    GestureHandler: undefined
    GestureHandler1: undefined
    GallaryView: undefined
    ScrollFlatList: undefined
    ScrollFlatList1: undefined
}

export const BG_IMAGE = 'https://images.pexels.com/photos/600114/pexels-photo-600114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'

export const DATA_USERS = [...Array(30).keys()].map((_, i) => {
    return {
        key: faker.string.uuid(),
        image: `https://randomuser.me/api/portraits/${faker.helpers.arrayElement(['women', 'men'])}/${faker.helpers.rangeToNumber({ min: 1, max: 100 })}.jpg`,
        name: faker.person.fullName(),
        jobTitle: faker.person.jobTitle(),
        email: faker.internet.email()
    }
})