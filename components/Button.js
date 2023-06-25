import {View, TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native'

export default function Button({loading, title, onPress, bgColor, textStyle}) {
  return (
    <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
        <View style={[styles.button, {backgroundColor: bgColor ?? styles.button.backgroundColor}]}>
            {
                loading
                ?
                <ActivityIndicator size="large" color="#fff" />
                :
                <Text style={[styles.buttonText, textStyle ?? {color: '#fff'}]}>{title ?? 'Button'}</Text>
            }
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: { 
        backgroundColor: 'dodgerblue', 
        padding: 13, 
        alignItems: 'center', 
        borderRadius: 3 
    },
    buttonText: { 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 17 
    }
})
