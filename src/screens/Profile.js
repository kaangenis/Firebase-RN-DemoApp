import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GoBackButton from '../components/GoBackButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ButtonComponent from '../components/ButtonComponent'
import firebaseConfig from '../components/firebaseConfig'
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'
import DeviceInfo from '../components/DeviceInfo'
import { doc, getDoc, getFirestore } from "firebase/firestore";
import PersonCard from '../components/PersonCard'



const Profile = () => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app);
  const db = getFirestore(app)
  const navigation = useNavigation()
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {

    const mailStorage = await AsyncStorage.getItem("email")
    const passwordStorage = await AsyncStorage.getItem("password")
    const uidStorage = await AsyncStorage.getItem("uid")

    if (mailStorage != null && passwordStorage != null && uidStorage != null) {

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          console.log("UID Here:", uid)

        } else {
          console.log("User logged out.")
        }
      });
    } else {
      navigation.replace("LoginScreen")
    }

  }


  const logOut = async () => {

    try {

      await AsyncStorage.removeItem('email')
      await AsyncStorage.removeItem('password')
      await AsyncStorage.removeItem('uid')

      checkLogin()

    } catch (err) {

      console.log(err)
    }

  }


  const getAllPersonalData = () => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log("UID Here:", uid)


        const docRef = doc(db, "UserInfo", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setAllData(docSnap.data())
          setLoading(false)

        } else {
          console.log("No such document!");
        }

      } else {
        console.log("User logged out.")
      }
    })

  }


  useEffect(() => { getAllPersonalData() }, [])

  const renderHobbies = ({ item }) => {

    return (
      <View>

        <Text>Hobby</Text>

        <Text style={styles.hobbiesText}>{item}</Text>

      </View>
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

      <View style={{ alignSelf: 'flex-start' }}>

        <GoBackButton navigationRoute={"HomeScreen"} />

      </View>

      <View style={styles.headerView}>

        <Text style={styles.headerTitle}>Profile</Text>

      </View>


      <View style={styles.middleView}>


        <PersonCard
          propUsername={allData.username}
          propName={allData.fullName.firstName}
          propSurname={allData.fullName.lastName}
          propCity={allData.location.city}
          propCountry={allData.location.country}
          propAge={allData.age}
          propMarriage={allData.status.isMarried}
          propDriver={allData.status.isDriver}
          propBackground="#059BE5"
        />

        <FlatList
          renderItem={renderHobbies}
          data={allData.hobbies}

        />

        <ButtonComponent
          propColor="#FF8964"
          propTitle="Log Out"
          propFunction={logOut}
        />

      </View>

    </SafeAreaView>

  )
}

export default Profile

const styles = StyleSheet.create({
  mainView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFCB2B'
  },
  headerView: {
    flex: 0.5
  },
  headerTitle: {
    fontSize: DeviceInfo.screenWidth * 0.1,
    fontWeight: '200'

  },
  middleView: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hobbiesView: {
    width: DeviceInfo.screenWidth * 0.8,
    height: DeviceInfo.screenHeight * 0.2,
    backgroundColor: '#059BE5',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10
  },
  hobbiesText: {
    fontSize: DeviceInfo.screenWidth * 0.075,
    fontWeight: '200'
  }
})