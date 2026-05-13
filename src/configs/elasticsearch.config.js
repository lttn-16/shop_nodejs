'use strict';

const { Client } = require('@elastic/elasticsearch'); // 277.4k (gzipped: 37.8k)

let clients = {} // multiple connections

const instanceEventListeners = async (elasticClient) => {
    try {
        await elasticClient.ping()
        console.log(`Successfully connected elasticsearch`);
    } catch (error) {
        console.error(`Error connecting to elasticsearch`, error);
    }
}

const init = ({
    ELASTICSEARCH_IS_ENABLED,
    ELASTICSEARCH_HOSTS = 'http://localhost:9200'
}) => {
    if(ELASTICSEARCH_IS_ENABLED){
        const elasticClient = new Client({ node: ELASTICSEARCH_HOSTS })
        clients.elasticClient = elasticClient
        // handler connect
        instanceEventListeners(elasticClient)
    }
}

const getClients = () => clients

module.exports = {
    getClients,
    init,
}