import useAuth from '../../hooks/useAuth'
import UnderConstruction from '../underConstruction'



const Prtotector = ({ children }) => {
    const auth = useAuth()
    const user = auth.userData
    if (user.userId && user.employeeId) {
        return (
            <>
                {children}
            </>
        )
    } else {
        return (
            <UnderConstruction
                text="Seems like Your Not Authorized...."
            />
        )
    }
}

export default Prtotector