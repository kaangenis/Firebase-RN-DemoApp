import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const GoBackButton = ({ navigationRoute }) => {
    const navigation = useNavigation()

    return (
        <TouchableOpacity hitSlop={{right: 50, bottom:30, top:30, left: 30}} onPress={() => navigation.replace(navigationRoute)}>

            <View style={styles.mainView}>

                <Image
                    source={require('../images/backicon.png')}
                    style={{ width: 35, height: 35 }} />

                <Text style={{ fontSize: 18, fontWeight: '200', right: 5 }}>Back</Text>

            </View>

        </TouchableOpacity>
    )
}

export default GoBackButton

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})