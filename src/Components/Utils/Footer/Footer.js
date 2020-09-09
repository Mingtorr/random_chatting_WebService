import React, { Component } from 'react'
import './Footer.css';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';


export default class Footer extends Component {
    render() {
        return (
            <div >
                <Link to = "/">
                    <HomeIcon className ="Home_footer" style = {{fontSize : 50 }}/>
                </Link>
            </div>
        )
    }
}
