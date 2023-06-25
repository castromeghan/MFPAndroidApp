import AppNav from "./AppNav";
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App(){
  return (
    <RootSiblingParent>
      <AppNav />
    </RootSiblingParent>
  )
}