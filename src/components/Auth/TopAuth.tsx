import { BiSolidLeftArrowCircle } from "react-icons/bi"
import { ButtonBordered } from "../UI/button"
import { useNavigate } from "react-router-dom"

const TopAuth = ({ content }: {content: string}) => {
    const navigate = useNavigate();
    return (
        <div className="absolute w-full flex items-center justify-between top-0 py-4 px-4">
            <ButtonBordered className="text-primary text-sm border-primary font-bold h-10" content="Back" startContent={<BiSolidLeftArrowCircle className="text-primary sm:text-xl text-base" />} onPress={() => navigate('/auth')} />
            <span className="text-primary sm:text-2xl text-lg font-bold">{content}</span>
        </div>
    )
}

export default TopAuth;