const { Readable } = require("stream");
const JSONStream = require("JSONStream");
const {
  getCumulocityFilterQuery,
  getInitialRequest,
  sendToStream,
  getAllPages
} = require("./../utils/commonUtils");
const Filter = require("../utils/FilterTransformer");

function createInitialStreams(fragmentType, value) {
  const transformerStream = new Filter({ fragmentType, value });
  const readableStream = new Readable({
    objectMode: true,
    read() {}
  });
  return { readableStream, transformerStream };
}

function processParams({ query, httpInstance }, onError) {
  const { fragmentType, value } = query;

  query = getCumulocityFilterQuery(query);
  const { readableStream, transformerStream } = createInitialStreams(
    fragmentType,
    value
  );
  
  console.log('request URL: ', `${httpInstance.defaults.baseURL}/event/events`)

  const config = {
    promise: getInitialRequest({ httpInstance, query }, "/event/events"),
    instance: httpInstance,
    key: "events"
  };

  getAllPages(config, (error, data, isLast) => {
    if (error) return onError(error);
    sendToStream(readableStream, { data, isLast });
  });

  return readableStream
    .pipe(transformerStream)
    .pipe(JSONStream.stringify())
}

module.exports = processParams;
