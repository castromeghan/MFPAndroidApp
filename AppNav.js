import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screen/Home';
import Add from './screen/Add';
import Remove from './screen/Remove';
import Scanner from './screen/Scanner';
import Search from './screen/Search';

const Tab = createNativeStackNavigator()

export default function AppNav(){
    return(
        <NavigationContainer>
            <Tab.Navigator initialRouteName='Home'>
                <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Tab.Screen name="Scanner" component={Scanner} options={{ headerShown: false }} />
                <Tab.Screen 
                    name="Add"  
                    component={Add}
                    options={{
                        title: 'Add Block',
                        headerStyle: {
                            backgroundColor: 'dodgerblue',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }} 
                />
                <Tab.Screen 
                    name="Remove"
                    component={Remove}  
                    options={{
                        title: 'Remove Block',
                        headerStyle: {
                            backgroundColor: 'dodgerblue',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }} 
                />
                <Tab.Screen 
                    name="Search" 
                    component={Search}
                    options={{
                        title: 'Search for a Block',
                        headerStyle: {
                            backgroundColor: 'dodgerblue',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }} 
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}