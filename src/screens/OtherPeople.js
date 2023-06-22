import { ActivityIndicator, Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebaseConfig from '../components/firebaseConfig'
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import DeviceInfo from '../components/DeviceInfo';
import GoBackButton from '../components/GoBackButton';
import PersonCard from '../components/PersonCard';




const OtherPeople = () => {
    const [resData, setResData] = useState([])
    const [loading, setLoading] = useState(true);

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app);

    const getAllUsers = async () => {

        const fetchedDocs = []

        const querySnapshot = await getDocs(collection(db, "UserInfo"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            fetchedDocs.push(doc.data())

        });

        setResData(fetchedDocs)
        setLoading(false)

    }

    useEffect(() => { getAllUsers() }, [])



    console.log("RES HERE:", resData)

    const renderCardComponent = ({ item }) => {
        return (
            <PersonCard
                propBackground="#69cafb"
                propTextColor="black"
                propUsername={item.username}
                propName={item.fullName.firstName}
                propSurname={item.fullName.lastName}
                propCity={item.location.city}
                propCountry={item.location.country}
                propAge={item.age}
                propMarriage={item.status.isMarried}
                propDriver={item.status.isDriver}
            />
        )
    }

    if (loading === true) {
        return (

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ActivityIndicator
                    size='large' />

                <Text>Loading</Text>

            </View>

        );
    }

    return (
        <SafeAreaView style={styles.mainView}>

            <View style={styles.headerView}>

                <View style={{ alignSelf: 'flex-start' }}>

                    <GoBackButton
                        navigationRoute={"HomeScreen"} />

                </View>

                <Text style={styles.headerTitle}>Other People</Text>

            </View>

            <View style={styles.middleView}>

                <FlatList
                    data={resData}
                    renderItem={renderCardComponent}
                />

            </View>


        </SafeAreaView>
    )
}

export default OtherPeople

const styles = StyleSheet.create({
    mainView: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFCB2B'
    },
    headerView: {
        flex: 0.5,
        width: DeviceInfo.screenWidth,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerTitle: {
        fontSize: DeviceInfo.screenWidth * 0.125,
        fontWeight: '200',
        fontStyle: 'italic'
    },
    middleView: {
        flex: 2
    }
})