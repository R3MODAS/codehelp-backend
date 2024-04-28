import { Link } from "react-router-dom"

const Button = ({ children, active, linkto }) => {
    return (
        <Link to={linkto}>

        <div className={`font-inter font-semibold text-center text-base px-6 py-3 rounded-lg ctaButton ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"}
        hover:scale-95 transition-all duration-200`}>
                {children}
            </div>

        </Link>
    )
}

export default Button
