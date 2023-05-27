export const throttle = (fn, delay = 100) => {
	let timer = true;
	return function(args) {
		let that = this;
		let _args = arguments;
		if(!timer){
		   return false;
		}
		timer = false;
		setTimeout(() => {
			fn.apply(that, _args)
			timer = true;
		}, delay)
	}
}

export const debounce = (fn, delay = 100) => {
	return function(args) {
		let that = this;
		let _args = args;
		clearTimeout(fn.id);
		fn.id = setTimeout(() => {
			fn.call(that, _args)
		}, delay)
	}
}