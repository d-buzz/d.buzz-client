import { 
  Home,
  Profile,
  Content,
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
  },
  {
    path: '/content/@:username/:permlink',
    exact: true,
    component: Content,
  }
]
 
export default routes