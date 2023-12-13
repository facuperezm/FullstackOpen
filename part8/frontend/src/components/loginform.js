import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useField } from "../hooks/hooks";
import { LOGIN } from "../services/queries";

const LoginForm = ({ setError, setToken }) => {
    const username = useField({ name: 'username' })
    const password = useField({ name: 'password', type: 'password' })

    const [ login, result ] = useMutation(LOGIN, {
        onError: err => {
            setError(err.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('user-token', token)
        }
    }, [result.data])

    const submit = async (event) => {
        event.preventDefault()

        await login({ variables: { username: username.value, password: password.value } })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>Username: <input {...username}/></div>
                <div>Password: <input {...password}/></div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm