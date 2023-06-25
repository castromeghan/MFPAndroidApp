import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import {initializeApp} from 'firebase/app'
import {getDatabase, ref, onValue} from 'firebase/database'
import firebaseConfig from '../config/firebase';

export default function Scanner({navigation, route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [add, setAdd] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [densityList, setDensityList] = useState([]);
  const [materialList, setMaterialList] = useState([]);

  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)
  const densRef = ref(db, 'density')
  const custRef = ref(db, 'customer')
  const matRef = ref(db, 'material')

  useEffect(() => {
    onValue(densRef, snapshot=>{
      if(snapshot.exists()){
        const data = snapshot.val()
        const key = Object.keys(data)[0]
        const dataObj = data[key]
        dataObj ? setDensityList(dataObj) : null
      }
    })

    onValue(custRef, snapshot=>{
      if(snapshot.exists()){
        const data = snapshot.val()
        const key = Object.keys(data)[0]
        const dataObj = data[key]
        dataObj ? setCustomerList(dataObj) : null
      }
    })

    onValue(matRef, snapshot=>{
      if(snapshot.exists()){
        const data = snapshot.val()
        const key = Object.keys(data)[0]
        const dataObj = data[key]
        dataObj ? setMaterialList(dataObj) : null
      }
    })

    if(route.params?.add){
      setAdd(true)
    }
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const splitData = data.split(' ')
    let d = splitData[0].toString()
    d = d.split('')
    let yy = `20${d[0]}${d[1]}`
    let mm = `${d[2]}${d[3]}`
    let dd = `${d[4]}${d[5]}`
    let date = `${mm}/${dd}/${yy}`
    let id = splitData[1]
    let density = splitData[2]
    let customer = splitData[3]
    let material = splitData[4]

    console.log({density, material})

    const findDens = densityList.find(dens=>dens.id === Number(density))
    const findCust = customerList.find(cust=>cust.id === Number(customer))
    const findMat = materialList.find(mat=>mat.id === Number(material))

    console.log({findDens, findMat})

    const obj = {id, date, density: findDens?.code ?? '', customer: findCust?.code ?? '', material: findMat?.code ?? ''}
    if(add){
      navigation.navigate('Add', {scan: obj})
    }else{
      navigation.navigate('Remove', {scan: obj})
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})