import { useState } from "react";
import { Field } from "./field";
import { FormFieldState, IFieldDef, FieldType } from "./types";
import { st, classes } from "./form.st.css";

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

export const useFormField = ({
	id,
	type,
	tag,
	required,
	icon,
	locale,
	tabIndex,
	rules,
	className,
}: IFieldDef) => {
	const [value, setValue] = useState(initValue(type));

	const [validation, setValidation] = useState<FormFieldState>(
		FormFieldState.INITIAL
	);

	const field = (
		<Field
			key={`ml-field-${type}-${id}`}
			value={value}
			onChange={setValue}
			validation={validation}
			validateRules={(value: string) =>
				rules.map((rule) => rule(value)).indexOf(false) === -1
			}
			setValidation={setValidation}
			id={id}
			type={type}
			tag={tag}
			required={required}
			icon={icon}
			locale={locale}
			tabIndex={tabIndex}
			className={st(classes.field, className)}
		/>
	);

	return [field];
};
