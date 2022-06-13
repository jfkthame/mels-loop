import React, { useEffect, useRef, useState } from "react";
import { FormFieldState, IFormProps } from "./types";
import { useFormField as createField } from "./useFormField";
import { Captcha } from "./captcha";
import LoadingIndicator from "../loading-indicator";
import { st, classes } from "./form.st.css";

export const Form = ({
	entries,
	onSuccessMessage,
	onFailMessage,
	submitButtonLabel,
	// submitButtonLabelActive,
	locale,
	theme,
	onSubmit,
	className,
}: IFormProps): JSX.Element => {
	const { VALID, INVALID } = FormFieldState;

	const [loadingIndicator, setLoadingIndicator] = useState(false);
	const [successMessage, setSuccessMessage] = useState(false);
	const [failureMessage, setFailureMessage] = useState(false);
	const [sendButtonState, setSendButtonState] = useState(false);
	const [highlightCaptcha, setHighlightCaptcha] = useState(false);

	const fields = Object.keys(entries).map(
		(key) => createField(entries[key])[0]
	);

	const captchaRef = useRef(null);
	const captchaTabIndex = Object.keys(entries).length + 1;

	const onFetchError = () => {
		setSuccessMessage(false);
		setFailureMessage(true);
		setLoadingIndicator(false);
	};

	const onFetchSuccess = () => {
		setSuccessMessage(true);
		setFailureMessage(false);
		setLoadingIndicator(false);
	};

	const onCaptchaChange = () => {
		setSendButtonState(true);
		setHighlightCaptcha(false);
	};

	const onCaptchaExpired = () => {
		setSendButtonState(false);
		setHighlightCaptcha(false);
	};

	const validateField = (field) => {
		const { setValidation, validateRules, value } = field.props;
		if (!validateRules(value)) {
			setValidation(INVALID);
			return INVALID;
		} else {
			setValidation(VALID);
			return VALID;
		}
	};

	const validateAllFields = () =>
		fields.map((field) => validateField(field)).indexOf(INVALID) === -1;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateAllFields()) {
			if (!sendButtonState) {
				setHighlightCaptcha(true);
				captchaRef.current.focus();
				return;
			}
			await submitForm();
			// const res = await onSubmit(fields.map((field) => field.props.value));
			// const { error } = await res.json();
			// if (error) onFetchError();
			// else onFetchSuccess();
		} else {
			fields[
				fields.map((field) => validateField(field)).indexOf(INVALID)
			].props.setFocus();
		}
	};

	async function submitForm() {
		setLoadingIndicator(true);
		const res = await onSubmit(fields.map((field) => field.props.value));
		const { error } = await res.json();
		if (error) onFetchError();
		else onFetchSuccess();
	}

	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			const focusedFields = fields.map((field) => field.props.focus);
			if (focusedFields.indexOf(true) === -1) return;

			const field = fields[focusedFields.indexOf(true)];
			const enterWithoutMeta =
				e.key === "Enter" &&
				!e.metaKey &&
				!e.ctrlKey &&
				field.props.tag !== "textarea";

			const enterWithMeta =
				(e.key === "Enter" && e.metaKey) || (e.key === "Enter" && e.ctrlKey);

			if (enterWithoutMeta) {
				e.preventDefault();
				validateField(field);
			} else if (enterWithMeta) {
				e.preventDefault();
				return handleSubmit(e);
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		document.addEventListener("keydown", keyDownHandler);
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return () => document.removeEventListener("keydown", keyDownHandler);
	});

	return (
		<div className={st(classes.root, className)}>
			{successMessage && onSuccessMessage}
			{failureMessage && onFailMessage}
			{!successMessage && !failureMessage && (
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				<form className={classes.form} noValidate>
					{fields}
					<Captcha
						onChange={onCaptchaChange}
						onExpired={onCaptchaExpired}
						tabIndex={captchaTabIndex}
						locale={locale}
						theme={theme}
						highlight={highlightCaptcha}
						className={classes.captcha}
					/>
				</form>
			)}
			<div className={classes.submitButton}>
				<button
					className={classes.button}
					tabIndex={captchaTabIndex + 1}
					ref={captchaRef}
					onClick={(e) => handleSubmit(e)}
				>
					{loadingIndicator ? (
						<LoadingIndicator
							// label="CONTACT_FORM_LABEL_SEND_ACTIVE"
							delay={0}
							className={classes.loadingIndicator}
						/>
					) : (
						submitButtonLabel
					)}
				</button>
			</div>
		</div>
	);
};

export default Form;
