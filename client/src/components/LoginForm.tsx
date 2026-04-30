import {useContext, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {store} = useContext(Context);

    return (
        <div>
            <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />

            <button type='submit' onClick={()=> store.login(email, password)}>Sign In</button>
            <button type='submit' onClick={()=> store.registration(email, password)}>Sign Up</button>
        </div>
    );
};

export default observer(LoginForm);