const { Transform } = require("stream");
const _ = require("lodash");

class Filter extends Transform {
  constructor({ fragmentType, value }) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    });

    this._fragmentType = fragmentType;
    this._value = value;
  }

  _transform(chunk, encoding, next) {
    if (this.passFilter(chunk)) {
      return next(null, chunk);
    }
    next();
  }

  passFilter(value) {
    if (!this._fragmentType) return true;
    return this.franmentTypeAndValueMatch(value);
  }

  franmentTypeAndValueMatch(fragment) {
    const fragmentValue = _.get(fragment, this._fragmentType);
    if (!fragmentValue) return;

    if (this._value && fragmentValue != this._value) return;

    return fragmentValue;
  }
}

module.exports = Filter;
