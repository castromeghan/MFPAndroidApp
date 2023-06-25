import {useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import Input from '../components/Input';
import Padder from '../components/Padder';

import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-root-toast';

import {initializeApp} from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import firebaseConfig from '../config/firebase';

const defaultState = {
    id: '',
    density: '',
    material: '',
    customer: '',
    date: '',
    row: ''
}
export default function Remove({navigation, route}) {
    const [content, setContent] = useState([])
    const [state, setState] = useState(defaultState)
    const onChange = obj => setState({...state, ...obj})
    const [loading, setLoading] = useState(false)

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbref = ref(db, 'MFPData');

    const scan = () => navigation.navigate('Scanner')

    useEffect(()=>{
        navigation.setOptions({
            headerRight: ()=>(
                <TouchableOpacity onPress={scan}>
                    <MaterialIcons name="qr-code-scanner" size={30} color="#fff" />
                </TouchableOpacity>
            )
        })
    });

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
        if(route.params?.scan){
            setState({...state, ...route.params.scan})
        }
    }, [route.params?.scan])

    const removeBlock = () => {
        setLoading(true)
        const findItem = content.find(item=>item.id === state.id && item.customer === state.customer && item.density === state.density && item.material === state.material && item.date === state.date && item.row === state.row)
        if(findItem){
            set(ref(db, `MFPData/${findItem.cid}`), null)
            .then(()=>{
                setState(defaultState)
                setLoading(false)
                Toast.show('Successfully removed block from inventory', {duration: Toast.durations.LONG})
            })
        }else{
            setLoading(false)
            Toast.show('Block was not found within inventory', {duration: Toast.durations.LONG})
        }
    }
  return (
    <KeyboardAwareScrollView>
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Padder height={20} />
                <View style={{ width: '90%', alignSelf: 'center' }}>
                    <Input label="Block No." name="id" value={state.id} onChange={onChange} placeholder="Block No." />
                    <Input label="Density" name="density" value={state.density} onChange={onChange} placeholder="Density" />
                    <Input label="Material" name="material" value={state.material} onChange={onChange} placeholder="Material" />
                    <Input label="Customer" name="customer" value={state.customer} onChange={onChange} placeholder="Customer" />
                    <Input label="Date" name="date" value={state.date} onChange={onChange} placeholder="Date" />
                    <Input label="Row" name="row" value={state.row} onChange={onChange} placeholder="Row" />
                    <Padder height={20} />
                    <Button title="REMOVE BLOCK" loading={loading} onPress={removeBlock} />
                </View>
            </View>
            <StatusBar backgroundColor="dodgerblue" />
        </SafeAreaView>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})