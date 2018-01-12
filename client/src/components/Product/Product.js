import React, { Component } from 'react';
import RoomIcon from 'material-ui-icons/Room';
import AlarmIcon from 'material-ui-icons/Alarm';
// import PropTypes from 'prop-types';
// import ButtonBase from 'material-ui/ButtonBase';

//Local
import './Product.css'
//Components
export default class Product extends Component {

    render() {
        var { product, onClick } = this.props;
        return (
            // <ButtonBase focusRipple>
            <article className='Product' onClick={onClick}>
                <img src={product.images[0] ? "/uploads" + product.images[0].src : "/uploads/no_image.jpg"} alt="Produit" />
                <div className='products_infos'>
                    <div className='product_title'>
                        {product.title}
                    </div>
                    <div className="products_infos_more">
                        <span>
                            <RoomIcon className="map_icon" />1.2km
                        </span>
                        <span>
                            <AlarmIcon className="alarm_icon" />3h
                        </span>
                    </div>
                </div>
            </article>
            // </ButtonBase>
        )
    }
}
// Product.propTypes = {
//     product: PropTypes.object.isRequired
// }