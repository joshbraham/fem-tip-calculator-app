const inputs = { bill: null, tip: null, numPeople: null };
const errors = { bill: null, tip: null, numPeople: null };

const billInput = document.querySelector("#bill");
const tipRadioBtns = document.querySelectorAll('input[type="radio"]');
const customTipInput = document.querySelector("#custom");
const numPeopleInput = document.querySelector("#num-people");
let checkedTip;

const errorSpans = {
	bill: document.querySelector("#bill-error"),
	tip: document.querySelector("#tip-error"),
	numPeople: document.querySelector("#num-people-error"),
};

const tipAmountSpan = document.querySelector(".bill-tip .bill-value");
const totalSpan = document.querySelector(".bill-total .bill-value");
const resetBtn = document.querySelector(".btn-reset");

// Because JavaScript has extremely basic rounding SMH
const round = (number, dp) => {
	const factor = 10 ** dp;
	return Math.round(number * factor) / factor;
};

// Another helper function
const padNumber = (number) => {
	const segments = number.toString().split(".");
	if (segments[1] == null) return segments[0] + ".00";
	return segments[0] + "." + segments[1].padEnd(2, "0");
};

// Makes divs containing inputs focus the inputs when clicked
[billInput, customTipInput, numPeopleInput].forEach((input) => {
	input.parentElement.addEventListener("click", () => {
		input.focus();
	});
});

function setError(id, msg, inputElement) {
	errorSpans[id].textContent = msg;
	if (msg) {
		inputElement?.parentElement.classList.add("invalid");
		errors[id] = true;
	} else {
		inputElement?.parentElement.classList.remove("invalid");
		errors[id] = false;
	}
}

function validateNumber(number) {
	if (!number) return "Enter an amount";
	if (!/^\d*\.?\d+$/.test(number)) return "Must be a number";
	if (parseFloat(number) === 0) return "Can't be zero";
	return "";
}

function validateInteger(number) {
	const msg = validateNumber(number);
	if (msg) return msg;
	if (!/^\d+$/.test(number)) return "Must be an integer";
	return "";
}

function validateAll() {
	if (
		validateNumber(inputs.bill) === "" &&
		validateNumber(inputs.tip) === "" &&
		validateInteger(inputs.numPeople) === ""
	) {
		return true;
	}
	return false;
}

function toggleResetButton() {
	for (const [_, value] of Object.entries(inputs)) {
		if (value) {
			resetBtn.disabled = false;
			return;
		}
	}
	resetBtn.disabled = true;
}

function everyInput() {
	for (const [_, value] of Object.entries(inputs)) {
		if (!value) {
			return false;
		}
	}
	return true;
}

function calculateTip() {
	toggleResetButton();
	if (everyInput() && validateAll()) {
		const bill = parseFloat(inputs.bill);
		const tipFraction = parseFloat(inputs.tip) / 100;
		const numPeople = parseInt(inputs.numPeople);

		const tipAmount = round((bill * tipFraction) / numPeople, 2);
		const total = round((bill * (1 + tipFraction)) / numPeople, 2);

		tipAmountSpan.textContent = padNumber(tipAmount);
		totalSpan.textContent = padNumber(total);
	}
}

resetBtn.addEventListener("click", () => {
	for (const input in inputs) {
		inputs[input] = null;
	}
	console.log(inputs);
	billInput.value = "";
	customTipInput.value = "";
	numPeopleInput.value = "";

	tipAmountSpan.textContent = "0.00";
	totalSpan.textContent = "0.00";

	checkedTip.checked = false;
	resetBtn.disabled = true;
});

billInput.addEventListener("change", () => {
	inputs.bill = billInput.value;
	const errorMsg = validateNumber(billInput.value);
	setError("bill", errorMsg, billInput);
	calculateTip();
});

tipRadioBtns.forEach((button) => {
	button.addEventListener("click", () => {
		inputs.tip = button.value;
		customTipInput.value = "";
		checkedTip = button;
		setError("tip", "", customTipInput);
		calculateTip();
	});
});

customTipInput.addEventListener("click", () => {
	inputs.tip = customTipInput.value;
	if (checkedTip) checkedTip.checked = false;
});

customTipInput.addEventListener("change", () => {
	inputs.tip = customTipInput.value;
	const errorMsg = validateNumber(customTipInput.value);
	setError("tip", errorMsg, customTipInput);
	calculateTip();
});

numPeopleInput.addEventListener("change", () => {
	inputs.numPeople = numPeopleInput.value;
	const errorMsg = validateInteger(numPeopleInput.value);
	setError("numPeople", errorMsg, numPeopleInput);
	calculateTip();
});
