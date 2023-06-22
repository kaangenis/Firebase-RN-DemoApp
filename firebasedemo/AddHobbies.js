import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GoBackButton from '../components/GoBackButton'
import DeviceInfo from '../components/DeviceInfo'
import firebaseConfig from '../components/firebaseConfig'
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, addDoc, collection, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native'

const AddHobbies = () => {
    const applyIcon = "https://cdn-icons-png.flaticon.com/512/7518/7518748.png"
    const removeIcon = "https://cdn-icons-png.flaticon.com/256/248/248953.png"
    const [hobbyText, setHobbyText] = useState("")
    const [dataHobbies, setDataHobbies] = useState([])


    const navigation = useNavigation()
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app);
    const db = getFirestore(app);


    const getHobbies = () => {

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                console.log("UID Here:", uid)

                const docRef = doc(db, "UserInfo", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());

                    setDataHobbies(docSnap.data())

                } else {
                    console.log("No such document!");
                }

            } else {
                navigation.replace("LoginScreen")
            }
        });
    }

    const addHobbies = async () => {

        if (hobbyText != "" && hobbyText != " ") {

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const uid = user.uid;
                    console.log("UID Here:", uid)

                    await updateDoc(doc(db, "UserInfo", user.uid), {
                        hobbies: arrayUnion(hobbyText)
                    });

                    getHobbies()
                }
            });

        } else {
            Alert.alert("Please enter a text.")
        }

    }

    const removeHobbies = () => {

        if (hobbyText != "" && hobbyText != " ") {

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const uid = user.uid;
                    console.log("UID Here:", uid)

                    await updateDoc(doc(db, "UserInfo", user.uid), {
                        hobbies: arrayRemove(hobbyText)
                    });

                    getHobbies()
                }
            });

        } else {
            Alert.alert("Please enter a text.")
        }


    }


    useEffect(() => { getHobbies() }, [])

    console.log("HERE:", dataHobbies)

    const renderItems = ({ item }) => {
        return (

            <View style={{ alignSelf: 'center' }}>

                <Text style={styles.itemTitle}> - {item}</Text>

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

                <Text style={styles.headerTitle}>Add your hobbies</Text>

            </View>

            <View style={styles.renderView}>

                <View style={{ padding: 15 }}>

                    <Text style={styles.headerTitle}>Hobbies:</Text>

                </View>

                <FlatList
                    data={dataHobbies.hobbies}
                    renderItem={renderItems}
                />

            </View>

            <View style={styles.middleView}>

                <View style={styles.inputField}>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Add your hobbies'
                        placeholderTextColor="gray"
                        textAlign='center'
                        value={hobbyText}
                        onChangeText={(val) => setHobbyText(val)}
                    />

                </View>

                <View style={styles.buttonView}>

                    <TouchableOpacity onPress={() => addHobbies()}>

                        <View style={{ left: 10 }}>

                            <Image
                                source={{ uri: applyIcon }}
                                style={{ width: 50, height: 50 }}
                                resizeMode='contain'
                            />

                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeHobbies()}>

                        <View style={{ left: 10 }}>

                            <Image
                                source={{ uri: removeIcon }}
                                style={{ width: 50, height: 50 }}
                                resizeMode='contain'
                            />

                        </View>

                    </TouchableOpacity>


                </View>

            </View>

        </SafeAreaView>
    )
}

export default AddHobbies

const styles = StyleSheet.create({
    mainView: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFA611'
    },
    headerView: {
        flex: 0.5,
        width: DeviceInfo.screenWidth,
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: DeviceInfo.screenWidth * 0.125,
        fontWeight: '200'
    },
    middleView: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        top: DeviceInfo.screenHeight * 0.05
    },
    inputField: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputView: {
        width: DeviceInfo.screenWidth * 0.8,
        height: DeviceInfo.screenHeight * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
    },
    renderView: {
        width: DeviceInfo.screenWidth * 0.925,
        height: DeviceInfo.screenHeight * 0.5,
        flex: 1,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        backgroundColor: '#69cafb',
        justifyContent: 'center',
    },
    renderTitle: {
        fontSize: DeviceInfo.screenWidth * 0.07,
        fontWeight: '200',
        alignSelf: 'flex-start'
    },
    itemTitle: {
        fontSize: DeviceInfo.screenWidth * 0.065,
        fontWeight: '200'
    },
    buttonView: {
        flex: 0.75,
        flexDirection: 'row',
        width: DeviceInfo.screenWidth * 0.8,
        padding: 10,
        justifyContent: 'space-evenly',
    }
})