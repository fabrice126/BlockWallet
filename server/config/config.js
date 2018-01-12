module.exports = {
    // "https": {
    //     "wasabi_key": "cert_https/wasabi_i3s_unice_fr.key",
    //     "wasabi_csr": "cert_https/wasabi_i3s_unice_fr.csr",
    //     "wasabi_crt": "cert_https/wasabi_i3s_unice_fr.crt",
    //     "digi_crt": "cert_https/DigiCertCA.crt"
    // },
    "database": {
        "mongodb_connect": "mongodb://localhost:27017/blockwallet",
        "collection_artist": "coins",
        "elasticsearch_connect": "localhost:9200",
        "elasticsearch_url": "http://127.0.0.1:9200/",
        "index_coins": "idx_coins",
    },
    "launch": {
        "env": {
            "prod": "production",
            "dev": "development",
            "dev_mode": true
        }
    }
};