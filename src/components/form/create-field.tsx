import { useState } from "react";
import { FormFieldState, IFieldDef, FieldType } from "./types";

const initValue = (type: FieldType) => {
	switch (type) {
		case "text":
		case "email":
			return "";
		case "number":
			return 0;
		default:
			return null;
	}
};

export const useFieldState = ({ type, rules }: IFieldDef) => {
	const { INITIAL } = FormFieldState;

	const [value, setValue] = useState(initValue(type));
	const [validation, setValidation] = useState<FormFieldState>(INITIAL);
	const [focus, setFocus] = useState(false);

	const validateRules = (value: string) =>
		rules.map((rule) => rule(value)).indexOf(false) === -1;

	return {
		focus,
		setFocus,
		value,
		setValue,
		validation,
		setValidation,
		validateRules,
	};
};
