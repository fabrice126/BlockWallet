import React, { Component } from 'react';
//Local
import './ProductList.css'
//Components
import Product from '../../components/Product/Product';

export default class ProductList extends Component {
    render() {
        var { products } = this.props;
        return (
            <section id="ProductList">
                {products.map((product, index) => <Product product={product} key={product.id} index={index} />)}
            </section>
        )
    }
}
