import React from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { iNavBarProps } from "../interfaces/components/iNavBarProps";
import { iPageInfo } from "../interfaces/iPageInfo";


export const NavBar: React.FunctionComponent<iNavBarProps> = (props) => {

    const iconGear =  (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>)
    

    const iconInfo =  (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>)


    const publicUrl = process.env.PUBLIC_URL.includes("http") ? `/${process.env.PUBLIC_URL.split("//")[1].split("/")[1]}` : process.env.PUBLIC_URL

    return <Navbar  variant="dark" style={{backgroundColor: "#283044"}}>
        <div className='container-md'>
        <Link to="/" className='text-decoration-none'>
            <Navbar.Brand >
            <img
                alt=""
                src={publicUrl+"/design/favicon/mstile-310x310.png"}
                width="30"
                height="30"
                className="d-inline-block align-top"
                style={{marginRight: "0.5rem"}}
            />
            <span>Education Platform</span>
            </Navbar.Brand>
        </Link>
        <Nav className="me-auto">
            <NavDropdown title="Kapitel" id="collasible-nav-dropdown">
            {props.contentInfo.map((pageInfo: iPageInfo, index: number) => {
            return <NavDropdown.Item key={index} href={publicUrl+"/chapter/"+pageInfo.id}>
                <Link to={"/chapter/"+pageInfo.id} className="text-dark text-decoration-none">{pageInfo.id}. {pageInfo.title}</Link>
                </NavDropdown.Item>
            })}
        </NavDropdown>
        </Nav>
        <Nav>
            <Nav.Link><Link to="/info" className='text-decoration-none text-white-50'>{iconInfo}</Link></Nav.Link>
            <span className="mx-2"/>
            <Nav.Link><Link to="/settings" className='text-decoration-none text-white-50'>{iconGear}</Link></Nav.Link>
        </Nav>
        </div>
    </Navbar>

}

