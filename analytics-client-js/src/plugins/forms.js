/**
 * Returns an identifier for a form element.
 * @param {object} form The form DOM element
 * @return {object} Either form id, name or action.
 */
function getFormKey(form) {
	return form.id || form.getAttribute('name') || form.action;
}

/**
 * Returns analytics payload with field information.
 * @param {object} form The field DOM element
 * @return {object} The payload with field information
 */
function getFieldPayload(field) {
	return {
		formId: getFormKey(field.form),
		name: field.name,
		value: field.value
	};
}

/**
 * Returns analytics payload with form information.
 * @param {object} form The form DOM element
 * @return {object} The payload with form information
 */
function getFormPayload(form) {
	return {
		formId: getFormKey(form),
		action: form.action
	};
}

/**
 * Adds an event listener for a form field and sends analytics
 * information when that event happens.
 * @param {object} form The form DOM element
 */
function trackFormFieldEvent(analytics, eventName) {
	document.addEventListener(
		eventName,
		(event) => {
			const field = event.target;
			if (!field.form) return;
			analytics.send(
				eventName,
				'forms',
				getFieldPayload(field)
			);
		},
		true
	);
}

/**
 * Plugin function that registers listener against form events
 * @param {object} analytics The Analytics client
 */
function forms(analytics) {
	trackFormFieldEvent(analytics, 'focus');
	trackFormFieldEvent(analytics, 'blur');
	
	document.addEventListener(
		'submit',
		(event) => {
			const form = event.target;
			analytics.send(
				'submit',
				'forms',
				getFormPayload(form)
			);
		},
		true
	);

	window.addEventListener('load', () => {
		Array.prototype.slice.call(document.querySelectorAll('form'))
		.forEach((form) => {
			analytics.send(
				'view',
				'forms',
				getFormPayload(form)
			);
		});
	});
}

export {forms};
export default forms;