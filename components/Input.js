import {TextInput, View, Text, StyleSheet} from 'react-native'

export default function Input({label, value, placeholder, onChange, name, margin, onBlur}) {
  return (
    <View style={{ marginBottom: margin ?? 8 }}>
        {label ? <Text style={styles.label}>{label ?? ''}</Text> : <View />}
        <TextInput 
            onBlur={()=>onBlur ? onBlur() : null}
            onChangeText={text=>onChange ? onChange({[name]: text}) : console.log(text)}
            placeholder={placeholder ?? ''}
            value={value ?? ''} 
            style={styles.input} 
        />
    </View>
  )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 3,
        backgroundColor: '#fff'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12
    }
})