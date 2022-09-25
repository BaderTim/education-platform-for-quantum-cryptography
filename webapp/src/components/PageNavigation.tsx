import { Link } from "react-router-dom";
import { iPageNavigation } from "../interfaces/components/iPageNavigation"


export const PageNavigation: React.FunctionComponent<iPageNavigation> = (props) => {

    const iconArrowRight = (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
        </svg>)
    
    const iconArrowLeft = (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>)


    const { contentInfo, currentPage } = props;
    const pageCount = contentInfo.length;

    const linkStyle = {
        textDecoration: "none",
    }

    const LinkElement = (props: {back?: boolean, disabled?: boolean}) => {
        const content = props.back ? (<>{iconArrowLeft} Zurück</>) : (<>Weiter {iconArrowRight}</>)
        if (props.disabled) {
            return <span className="text-muted">{content}</span>
        }
        const page = props.back ? currentPage - 1 : currentPage + 1;
        return <Link 
            to={`/chapter/${page}`} 
            style={linkStyle}
            >{content}
        </Link>
    }

    return <div className="d-flex">
        <div className="me-3">
            <LinkElement back disabled={currentPage === 1}/>
        </div>
        <div>
            <LinkElement disabled={currentPage === pageCount}/>
        </div>
    </div>


}