import {
    View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, Image
} from 'react-native'

import logo from '../assets/logo.png'
import Button from '../components/Button'
import Padder from '../components/Padder'

const actions = [
    {title: 'Add Block', link: 'Add'},
    {title: 'Remove Block', link: 'Remove'},
    {title: 'Search Block', link: 'Search'}
]

export default function Home({navigation}) {
    const goLink = link => navigation.navigate(link)

    const renderItem = ({item}) => {
        return (
            <View style={{ marginBottom: 10 }}>
                <Button title={item.title} onPress={()=>goLink(item.link)} textStyle={{ textTransform: 'uppercase' }} />
            </View>
        )
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <View style={styles.titleview}>
                <Text style={styles.title}>MFP Inventory Management</Text>
            </View>
            <View style={styles.logoview}>
                <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.name}>Inventory Management</Text>

            <Padder height={30} />

            <FlatList data={actions} renderItem={renderItem} keyExtractor={item=>item.title} />
        </View>
        <StatusBar backgroundColor="dodgerblue" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    logoview: {
        width: 120,
        height: 120,
        alignSelf: 'center'
    },
    logo: {
        width: 120,
        height: 120
    },
    name: {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'rgb(100, 100, 100)'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff',
        marginLeft: 5
    },
    titleview:{
        backgroundColor: 'dodgerblue',
        padding: 10
    }
})