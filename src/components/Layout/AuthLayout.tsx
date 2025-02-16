import { Outlet } from "react-router-dom"
import AuthBackground from "@/assets/images/auth-background.jpg";

const AuthLayout = () => {
    return (
        <>
            <img src={AuthBackground} alt="auth-background" loading="lazy" className="w-full h-screen fixed top-0 left-0" />
            <section className="flex items-center justify-center relative w-full h-screen">
                <div className="md:h-[85vh] h-[90vh] md:w-[72%] w-[90%] bg-primary overflow-hidden rounded-2xl">
                    <Outlet />
                </div>
            </section>
        </>
    )
}

export default AuthLayout;