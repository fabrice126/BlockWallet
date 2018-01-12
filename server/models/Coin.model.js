import mongoose from 'mongoose';
var stringSchema = {
    type: String,
    trim: true,
    default: ""
};
var arrayOfStringSchema = {
    type: [String],
    default: []
};
var stringSchemaIndex = {
    type: String,
    trim: true,
    default: "",
    index: true
};
var CoinSchema = new mongoose.Schema({
    "Id": {
        ...stringSchemaIndex,
        unique: true,
        required: [true, 'You must type an Id'],
    },
    "Url": stringSchema,
    "ImageUrl": stringSchema,
    "Name": {
        ...stringSchemaIndex,
        required: [true, 'You must type a Name']
    },
    "CoinName": {
        ...stringSchemaIndex,
        required: [true, 'You must type a CoinName']
    },
    "FullName": stringSchema,
    "SortOrder": {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    }
}, {
        collection: 'coin',
        toObject: {
            retainKeyOrder: true,
        },
        toJSON: {
            retainKeyOrder: true,
        }
    });
export default mongoose.model('Coin', CoinSchema);