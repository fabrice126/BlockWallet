import React, { Component } from 'react';
//Local
import './Advert.css'
//Components
// import ProductList from '../../components/ProductList/ProductList';
// import MyGoogleMap from '../../components/MyGoogleMap/MyGoogleMap';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
// import RoomIcon from 'material-ui-icons/Room';

export default class Advert extends Component {
    constructor() {
        super();
        this.limit = 36;
        this.state = {
            products: null,
            errorRequest: null,
            offset: 0,
        };
    }
    componentDidMount() {
        // this.getProducts();
    }
    render() {
        var { products, errorRequest } = this.state;
        if (errorRequest !== null) return <div>Erreur de récupération des produits</div>
        if (products === null) return <div>Chargement des produits</div>
        return (
            <div id="Advert">
                {/*<ProductList products={products} />*/}
                <Button id="bt_addProduct" fab color="primary" aria-label="add" >
                    <AddIcon />
                </Button>
            </div>
        )
    }

    // onDeleteProduct = (index) => {
    //     var products = this.state.products.slice(); //copy array
    //     products.splice(index, 1); //remove element
    //     this.setState({
    //         products: products,
    //         lastProductDeleted: index
    //     });
    // }



    // getProducts = () => {
    //     let query = `{
    //         products(limit:${this.limit},offset:${this.state.offset}){
    //             id, title, latitude, longitude, images{id, src}
    //         }
    //       }`;
    //     //REACT_APP_API_HOST_MOBILE or REACT_APP_API_HOST
    //     fetch((`${process.env.REACT_APP_API_HOST_MOBILE}/graphql?query=${encodeURIComponent(query)}`), { method: 'post' }).then((response) => {
    //         return response.json();
    //     }).then(({ data, errors }) => {
    //         if (errors) throw errors[0].message;
    //         this.setState({ products: data.products })
    //     }).catch((err) => {
    //         this.setState({ errorRequest: err });
    //         console.log(`err fetch componentDidMount Advert.js => ${err}`)
    //     });
    // }

}