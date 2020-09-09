import React, { Component } from 'react'
import './After.css'
import Footer from '../../Utils/Footer/Footer';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';


export default class After extends Component {
    render() {
        return (
            <div className="Container_after">
                <div className=" Set_after">
                    <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                        <div>
                            <text className="Text_after">창원대 과팅앱</text>
                        </div>
                        <div>
                            <text className="Text2_after">창남 창녀.</text>
                        </div>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        <Link to="Login">
                            <ChatBubbleOutlineIcon style={{ fontSize: 50, color: 'white', marginTop: 10 }} />
                        </Link>
                        <Link to="Signup">
                            <MenuIcon style={{ fontSize: 50, color: 'white', marginTop: 5 }} />
                        </Link>
                    </div>


                </div>
                <button className="Msg_after">
                    <div>
                    </div>
                </button>
                <button className="Msg_after">
                    <div>
                    </div>
                </button>
                <button className="Msg_after">
                    <div>
                    </div>
                </button>
                <button className="Msg_after">
                    <div>
                    </div>
                </button>
                <Footer className="Footer_after" />
            </div>
        )
    }
}
