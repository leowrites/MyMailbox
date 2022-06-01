import { useEffect } from "react"

export default function Test() {
    // Testing component for making fetch request to server
    useEffect(
        () => {
            fetch('api/mail/test')
                // .then(res => res.json())
                // .then(data => console.log(data))
        }
    )
    return(
        <><p>Test Page</p></>
    )
}