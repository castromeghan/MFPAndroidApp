import React, {useState, useEffect} from 'react'
import {View, SafeAreaView, FlatList, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native'
import Toast from 'react-native-root-toast'
import Button from '../components/Button'
import Input from '../components/Input'
import Padder from '../components/Padder'

import {initializeApp} from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebaseConfig from '../config/firebase';

export default function Search() {
  const [result, setResult] = useState(null)
  const [state, setState] = useState({customer: '', density: '', result: ''})
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(false)
  const onChange = obj => setState({...state, ...obj})

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const dbref = ref(db, 'MFPData');

  useEffect(()=>{
    onValue(dbref, snapshot=>{
      if(snapshot.exists()){
        const data = snapshot.val()
        const keys = Object.keys(data)
        const arr = []
        keys.forEach(key=>arr.push({...data[key], ['cid']: key}))
        setContent(arr)
      }
    })
  }, [])

  const search = () => {
    setLoading(true)
    const {customer, density} = state
    if(customer && density){
      const findItems = content.filter(item=>item.customer === customer && item.density === density)
      if(findItems.length > 0){
        const timeArr = []
        findItems.forEach(el=>{
          const tsplit = el.date.split('/')
          let t = new Date(`${tsplit[2]}-${tsplit[0]}-${tsplit[1]}`).getTime()
          timeArr.push(t)
        })
        timeArr.sort()
        const findBlock = findItems.find(item=>{
          const ts = item.date.split('/')
          if(new Date(`${ts[2]}-${ts[0]}-${ts[1]}`).getTime() === timeArr[0]){
            return item
          }
        })
        setLoading(false)
        setResult(findBlock)
      }else{
        setLoading(false)
        setResult(null)
        Toast.show(`Could not find any blocks with Customer Code ${customer} and Density ${density}`, {duration: Toast.durations.LONG})
      }
    }else if(customer && !density){
      const findItems = content.filter(item=>item.customer === customer)
      if(findItems.length > 0){
        const timeArr = []
        findItems.forEach(el=>{
          const tsplit = el.date.split('/')
          let t = new Date(`${tsplit[2]}-${tsplit[0]}-${tsplit[1]}`).getTime()
          timeArr.push(t)
        })
        timeArr.sort()
        const findBlock = findItems.find(item=>{
          const ts = item.date.split('/')
          if(new Date(`${ts[2]}-${ts[0]}-${ts[1]}`).getTime() === timeArr[0]){
            return item
          }
        })
        setLoading(false)
        setResult(findBlock)
      }else{
        setLoading(false)
        setResult(null)
        Toast.show(`Could not find any blocks with Customer Code ${customer}`, {duration: Toast.durations.LONG})
      }
    }else if(!customer && density){
      const findItems = content.filter(item=>item.density === density)
      if(findItems.length > 0){
        const timeArr = []
        findItems.forEach(el=>{
          const tsplit = el.date.split('/')
          let t = new Date(`${tsplit[2]}-${tsplit[0]}-${tsplit[1]}`).getTime()
          timeArr.push(t)
        })
        timeArr.sort()
        const findBlock = findItems.find(item=>{
          const ts = item.date.split('/')
          if(new Date(`${ts[2]}-${ts[0]}-${ts[1]}`).getTime() === timeArr[0]){
            return item
          }
        })
        setLoading(false)
        setResult(findBlock)
      }else{
        setLoading(false)
        setResult(null)
        Toast.show(`Could not find any blocks with Density ${density}`, {duration: Toast.durations.LONG})
      }
    }else{
      setLoading(false)
      setResult(null)
      Toast.show('One of the fields must be filled', {duration: Toast.durations.LONG})
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Padder height={20} />
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Input onChange={onChange} name="customer" value={state.customer} label="Customer" placeholder="Customer" />
          <Input onChange={onChange} name="density" value={state.density} label="Density" placeholder="Density" />
          <Padder height={20} />
          <Button title="Search" loading={loading} onPress={search} />

          <Padder height={30} />
          {
            result
            ?
            <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 5 }}>
              <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Search Result</Text>
              <Text style={{ fontSize: 18 }}><Text style={{ fontWeight: 'bold' }}>Row#:</Text> {result?.row}</Text>
              <Text style={{ fontSize: 18 }}><Text style={{ fontWeight: 'bold' }}>Date:</Text> {result?.date}</Text>
              <Text style={{ fontSize: 18 }}><Text style={{ fontWeight: 'bold' }}>Customer:</Text> {result?.customer}</Text>
              <Text style={{ fontSize: 18 }}><Text style={{ fontWeight: 'bold' }}>Density:</Text> {result?.density}</Text>
              <Text style={{ fontSize: 18 }}><Text style={{ fontWeight: 'bold' }}>Material:</Text> {result?.material}</Text>
            </View>
            :
            <View />
          }
        </View>
      </View>
      <StatusBar backgroundColor="dodgerblue" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})