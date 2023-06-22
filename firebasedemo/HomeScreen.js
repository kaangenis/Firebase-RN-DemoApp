import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import firebaseConfig from '../components/firebaseConfig'
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import DeviceInfo from '../components/DeviceInfo'
import PersonCard from '../components/PersonCard'
import IconComponent from '../components/IconComponent'


const HomeScreen = () => {
    const [userInfo, setUserInfo] = useState([])
    const [loading, setLoading] = useState(true);
    const profileIcon = "https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
    const addDataIcon = "https://cdn-icons-png.flaticon.com/512/114/114903.png"
    const otherPeople = "https://cdn-icons-png.flaticon.com/512/4132/4132666.png"

    //React Navigation Native kütüphanesinin import edilip kullanılması:

    const navigation = useNavigation()

    const navigateOtherPeople = () => {
        navigation.replace("OtherPeople")
    }

    const navigateProfile = () => {
        navigation.replace("Profile")
    }

    const navigateAddHobbies = () => {
        navigation.replace("AddHobbies")
    }


    /*

        Kullanıcının AsyncStorage kütüphanesi ile hafızaya kaydettiği giriş bilgilerinin kontrol edilmesi
        ve bilgilerden herhangi birisinin "null" olduğu takdirde kullanıcının "LoginScreen" sayfasına
        yönlendirilmesini sağlayan fonksiyon:

    */


    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app);
    const db = getFirestore(app);

    const checkLogin = async () => {

        //AsyncStorage kütüphanesinin "getItem" fonksiyonu ile "uid", "email", "password" bilgilerinin hafızadan çekme işlemi:

        const mailStorage = await AsyncStorage.getItem("email")
        const passwordStorage = await AsyncStorage.getItem("password")
        const uidStorage = await AsyncStorage.getItem("uid")

        //Gelen bilgilerin kontrolü ve gelen bilgilerin eksik olduğu senaryoda kullanıcının "LoginScreen" sayfasına yönlendirilme işlemi.

        if (mailStorage != null && passwordStorage != null && uidStorage != null) {

            //İkinci authentication kontrolü:

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const uid = user.uid;
                    console.log("UID Here:", uid)

                    //Authentication başarılı şekilde gerçekleştiği koşulda kullanıcı bilgilerini içeren Firestore Document'ından kullanıcı verilerinin çekilmesi:

                    const docRef = doc(db, "UserInfo", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());

                        //"userInfo" state'inin "docSnap.data()" result'u ile set edilme işlemi:

                        setUserInfo(docSnap.data())
                        setLoading(false);

                    } else {
                        console.log("No such document!");
                    }

                } else {
                    console.log("User logged out.")
                }
            });
        } else {
            navigation.replace("LoginScreen")
        }

    }

    /*
 
        React hooklarından birisi olan "useEffect" ile "HomeScreen.js" dosyası her çalıştığında
        "checkLogin()" isimli fonksiyon çalıştırılacak. Bu fonksiyon her çalıştığında 
        kullanıcının Authentication işlemi esnasında bir problem olup olmadığını denetleyecek
        ve bir problem olduğu takdirde "LoginScreen" sayfasına yönlendirecek.
 
    */

    useEffect(() => { checkLogin() }, [])

    if (loading === true) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ActivityIndicator
                    size='large' />

                <Text>Loading</Text>

            </View>
        );
    }

    console.log(userInfo)

    return (
        <SafeAreaView style={styles.mainView}>

            <View style={styles.headerView}>

                <Text style={styles.titleStyle} >Welcome Back {userInfo.username}</Text>

            </View>

            <View style={styles.middleView}>

                <PersonCard
                    propUsername={userInfo.username}
                    propName={userInfo.fullName.firstName}
                    propSurname={userInfo.fullName.lastName}
                    propCity={userInfo.location.city}
                    propCountry={userInfo.location.country}
                    propAge={userInfo.age}
                    propMarriage={userInfo.status.isMarried}
                    propDriver={userInfo.status.isDriver}
                    propBackground="#FFCB2B"
                />

            </View>


            <View style={styles.navbarView}>

                <IconComponent
                    propIcon={addDataIcon}
                    propNavigate={navigateAddHobbies}
                />

                <IconComponent
                    propIcon={otherPeople}
                    propNavigate={navigateOtherPeople}
                />

                <IconComponent
                    propIcon={profileIcon}
                    propNavigate={navigateProfile}
                />

            </View>

        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#059BE5'
    },
    headerView: {
        flex: 0.5,
        flexDirection: 'row',
        width: DeviceInfo.screenWidth,
        paddingHorizontal: DeviceInfo.screenWidth * 0.05,
        paddingVertical: DeviceInfo.screenHeight * 0.025,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    middleView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: DeviceInfo.screenWidth * 0.1,
        fontWeight: '200',
        fontStyle: 'italic',
        alignSelf: 'flex-start'
    },
    navbarView: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#FFCB2B',
        width: DeviceInfo.screenWidth,
        height: DeviceInfo.screenHeight * 0.06,
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 5
    }
})