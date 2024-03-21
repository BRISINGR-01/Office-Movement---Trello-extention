module.exports = class EventDispatcher {
	constructor() {
		this.cb = () => {};
	}

	dispatch(id) {
		this.cb(id);
	}

	subscribe(cb) {
		this.cb = cb;
	}
};
