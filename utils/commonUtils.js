const _ = require("lodash");

const getFirstLevelKey = text => text.replace(/\..*/, "");

function getCumulocityFilterQuery(query) {
  delete query.value;

  if (typeof query.fragmentType === 'string') {
    query.fragmentType = getFirstLevelKey(query.fragmentType);
  }

  if (query.source) {
    query.withSourceAssets = true;
    query.withSourceDevices = true;
  }

  query.pageSize = 2000;
  return query;
}

function getInitialRequest({ httpInstance, query }, url) {
  return httpInstance.get(url, {
    params: query
  });

}

function sendToStream(readableStream, { data, isLast }) {
  data.forEach(event => {
    readableStream.push(event);
  });

  if (isLast) readableStream.push(null);
}

const isLastPage = elements => elements.length < 2000;

const replaceBaseURL = (URL, newBaseURL) => URL.replace(/https?:\/\/.+?(?=\/)/, newBaseURL);

function getAllPages({ promise, instance, key }, onData) {
  const getNext = async request => {
    let timeStart = new Date();
    try {
      const { data } = await request;
      if (!data.next) {
        return onData(null, _.get(data, key), true);
      }

      const next = replaceBaseURL(data.next, instance.defaults.baseURL)
      
      console.log(`DB request time: ${new Date() - timeStart}, ${next}`);
      const elements = _.get(data, key);
  
      if (isLastPage(elements)) {
        onData(null, elements, true);
      } else {
        onData(null, elements, false);
        getNext(instance.get(next));
      }
    } catch (error) {
      return onData(error);
    }
  };

  getNext(promise);
}

exports.getCumulocityFilterQuery = getCumulocityFilterQuery;
exports.getFirstLevelKey = getFirstLevelKey;
exports.getInitialRequest = getInitialRequest;
exports.sendToStream = sendToStream;
exports.getAllPages = getAllPages;
