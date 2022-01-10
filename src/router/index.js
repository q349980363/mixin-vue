import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Register = () => import('../components/Register')
const SessionGlobal = () => import('../components/SessionGlobal')
const SessionList = () => import('../components/SessionList')
const UserSession = () => import('../components/UserSession')
const AddUser = () => import('../components/SearchUser')
const AddGroup = () => import('../components/SearchGroup')
const SystemSession = () => import('../components/SystemSession')
const CreateGroup = () => import('../components/CreateGroup')

const GroupSession = () => import('../components/GroupSession')



Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'SessionList',
        component: SessionList
    },
    // {
    //     path: '',
    //     name: 'login',
    //     component: Login
    // },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'login',
        component: Register
    },
    {
        path: '/session_global',
        name: 'session_global',
        component: SessionGlobal
    },
    {
        path: '/session_list',
        name: 'session_list',
        component: SessionList
    },
    {
        path: '/search_user',
        name: 'search_user',
        component: AddUser
    },
    {
        path: '/search_group',
        name: 'search_user',
        component: AddGroup
    },

    {
        path: '/system_session',
        name: 'system_session',
        component: SystemSession
    },

    {
        path: '/user_session/:username',
        name: 'user_session',
        component: UserSession
    },
    {
        path: '/group_session/:name',
        name: 'group_session',
        component: GroupSession
    },
    

    {
        path: '/create_group',
        name: 'create_group',
        component: CreateGroup
    },


]
const router = new VueRouter({
    routes,
    mode: 'hash'
})

export default router