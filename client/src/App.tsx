import LoginForm from "./components/LoginForm";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import UserService from "./services/UserService";
import {IUser} from "./models/IUser";

function App() {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if(localStorage.getItem("token")){
            store.checkAuth()
        }
    },[])

    const getUsers =  async () =>{
        try{
            const res = await UserService.fetchUsers();
            setUsers(res.data);

        } catch(e){
            console.log(e)
        }
    }

    if(store.isLoading){
        return <div>Loading...</div>
    }

    if(!store.isAuth){
        return  <>
                    <h1>Please, authorise</h1>
                    <LoginForm />
                </>
    }

  return (
    <div className="App">
        <h1>{`User's authorised ${store.user?.email}`}</h1>
        <div>{store.user.isActivated ? 'Account is activated by email' : 'Activate your account via email'}</div>
        <button onClick={()=>store.logout()}>Log Out</button>
        <button onClick={()=> getUsers()}>Get users</button>
        {users.map(user=> (<div key={user.id}>{user.email}</div>))}
    </div>
  );
}

export default observer(App);
