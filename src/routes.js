import { 
  Home,
  Profile,
} from 'components'
  
const routes =  [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: '/@:username',
    exact: true,
    component: Profile, 
  }
]
 
export default routes