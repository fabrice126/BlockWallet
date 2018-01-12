import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import List, { ListItem, ListItemText } from 'material-ui/List';
import './MenuConnect.css';

export default class MenuConnect extends Component {
    render() {
        var { isVisible, closeMenuConnect } = this.props;
        return (
            <div id="MenuConnect" hidden={!isVisible}>
                <ul>
                    <li onClick={closeMenuConnect}>
                        <Link className="navLink" to='/profil/edit'>Modifier le profil</Link>
                    </li>
                    <li onClick={closeMenuConnect}>
                        <Link className="navLink" to='/profil/notification'>Paramètres du compte</Link>
                    </li>
                    <li onClick={closeMenuConnect}>
                        <Link className="navLink" to='/guide'>Bien débuter</Link>
                    </li>
                    <li onClick={closeMenuConnect}>
                        <Link className="navLink" to='/for-companies'>Pour les entreprises</Link>
                    </li>
                    <li onClick={closeMenuConnect}>
                        <Link className="navLink" to='/logout'>Déconnexion</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

// <List>
//     <ListItem button>
//         <Link className="navLink" to='/profil/edit'><ListItemText primary="Modifier le profil" /></Link>
//     </ListItem>
//     <ListItem button>
//         <Link className="navLink" to='/profil/notification'><ListItemText primary="Paramètres du compte" /></Link>
//     </ListItem>
//     <ListItem button>
//         <Link className="navLink" to='/guide'><ListItemText primary="Bien débuter" /></Link>
//     </ListItem>
//     <ListItem button>
//         <Link className="navLink" to='/for-companies'><ListItemText primary="Pour les entreprises" /></Link>
//     </ListItem>
//     <ListItem button>
//         <Link className="navLink" to='/logout'><ListItemText primary="Déconnexion" /></Link>
//     </ListItem>
// </List>