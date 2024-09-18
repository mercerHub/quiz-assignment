import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function RedirectComponent() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/dashboard", { replace: true });
    })

    return (
        null
    )
}

export default RedirectComponent
