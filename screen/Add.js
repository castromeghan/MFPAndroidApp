import {useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import Input from '../components/Input';
import Padder from '../components/Padder';

import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-root-toast';

import {initializeApp} from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import firebaseConfig from '../config/firebase';

const defaultState = {
    id: '',
    density: '',
    material: '',
    customer: '',
    date: '',
    row: ''
}
export default function Add({navigation, route}) {
    const [content, setContent] = useState([])
    const [custDb, setCustDb] = useState([])
    const [matDb, setMatDb] = useState([])
    const [densDb, setDensDb] = useState([])
    const [rowsDb, setRowsDb] = useState([])
    const [rows, setRows] = useState([])
    const [state, setState] = useState(defaultState)
    const onChange = obj => setState({...state, ...obj})
    const [loading, setLoading] = useState(false)

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbref = ref(db, 'MFPData');
    const rowRef = ref(db, 'MFPRow');
    const custRef = ref(db, 'customer');
    const matRef = ref(db, 'material');
    const densRef = ref(db, 'density');
    const rowsRef = ref(db, 'rows');

    const scan = () => navigation.navigate('Scanner', {add: 'add'})

    useEffect(()=>{
        navigation.setOptions({
            headerRight: ()=>(
                <TouchableOpacity onPress={scan}>
                    <MaterialIcons name="qr-code-scanner" size={30} color="#fff" />
                </TouchableOpacity>
            )
        })
    });

    const guessRow = () => {
        if(state.density){
            const findD = rows.find(row=>row.density === state.density)
            if(findD){
                setState({...state, ['row']: findD.row})
            }
        }
    }

    const guessScanRow = (data) => {
        if(data.density){
            const findD = rows.find(row=>row.density === data.density)
            if(findD){
                setState({...data, ['row']: findD.row})
            }else{
                setState({...state, ...data})
            }
        }
    }

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

        onValue(rowRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                setRows(arr)
            }
        })

        onValue(custRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const key = keys[0]
                const dataObj = data[key]
                setCustDb(dataObj)
            }
        })

        onValue(matRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const key = keys[0]
                const dataObj = data[key]
                setMatDb(dataObj)
            }
        })

        onValue(densRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const key = keys[0]
                const dataObj = data[key]
                setDensDb(dataObj)
            }
        })

        onValue(rowsRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const key = keys[0]
                const dataObj = data[key]
                setRowsDb(dataObj)
            }
        })

        if(route.params?.scan){
            const data = {...route.params.scan}
            guessScanRow(data)
        }
    }, [route.params?.scan])

    const addBlock = () => {
        setLoading(true)
        const {id, density, material, customer, date, row} = state
        const findC = content.find(c=>c.id === id && c.date === date)
        if(findC){
            setLoading(false)
            Toast.show('Block with same Block No. and Date already exists', {duration: Toast.durations.LONG})
        }else{
            if(id && density && material && customer && date && row){
                const findD = rows.find(r=>r.density === density && r.row === row)
                const findCust = custDb.find(c=>c.code === customer)
                const findMat = matDb.find(m=>m.code === material)
                const findDens = densDb.find(d=>d.code === density)
                const findRow = rowsDb.find(r=>r.code === row)

                if(findCust){
                    if(findMat){
                        if(findDens){
                            if(findRow){
                                if(findD) {
                                    push(dbref, state)
                                    .then(()=>{
                                        setLoading(false)
                                        setState(defaultState)
                                        Toast.show('Successfully added block to inventory', {duration: Toast.durations.LONG})
                                    })
                                }else{
                                    push(dbref, state)
                                    .then(()=>{
                                        push(rowRef, {density: state.density, row: state.row})
                                        .then(()=>{
                                            setLoading(false)
                                            setState(defaultState)
                                            Toast.show('Successfully added block to inventory', {duration: Toast.durations.LONG})
                                        })
                                    })
                                }
                            }else{
                                setLoading(false)
                                Toast.show('Invalid Row', {duration: Toast.durations.LONG})
                            }
                        }else{
                            setLoading(false)
                            Toast.show('Invalid Density', {duration: Toast.durations.LONG})
                        }
                    }else{
                        setLoading(false)
                        Toast.show('Invalid Material', {duration: Toast.durations.LONG})
                    }
                }else{
                    setLoading(false)
                    Toast.show('Invalid Customer Code', {duration: Toast.durations.LONG})
                }
            }else{
                setLoading(false)
                Toast.show('All fields are required', {duration: Toast.durations.LONG})
            }
        }
    }
  return (
    <KeyboardAwareScrollView>
    <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <Padder height={20} />
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <Input label="Block No." name="id" value={state.id} onChange={onChange} placeholder="Block No." />
                <Input label="Density" name="density" value={state.density} onBlur={guessRow} onChange={onChange} placeholder="Density" />
                <Input label="Material" name="material" value={state.material} onChange={onChange} placeholder="Material" />
                <Input label="Customer" name="customer" value={state.customer} onChange={onChange} placeholder="Customer" />
                <Input label="Date" name="date" value={state.date} onChange={onChange} placeholder="Date" />
                <Input label="Row" name="row" value={state.row} onChange={onChange} placeholder="Row" />
                <Padder height={20} />
                <Button title="ADD BLOCK" loading={loading} onPress={addBlock} />
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