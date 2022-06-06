import React, { useContext, useState } from "react";
import { ComponentProps } from "../../interfaces/models";
import { ReactLocaleContext } from "../../contexts/locale-context";
import {
	ChatBubbleIcon,
	CheckIcon,
	EnvelopeClosedIcon,
	ExclamationTriangleIcon,
	GlobeIcon,
	PaperPlaneIcon,
	PersonIcon,
} from "@radix-ui/react-icons";
import LoadingIndicator from "../loading-indicator";
import { st, classes } from "./contact-form.st.css";

export enum FormFieldState {
	INITIAL = "initial",
	EMPTY = "empty",
	VALID = "valid",
	INVALID = "invalid",
}

const RegExpEmail =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const ContactForm = ({ className }: ComponentProps): JSX.Element => {
	const { translate } = useContext(ReactLocaleContext);

	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [fieldStateName, setFieldStateName] = useState<FormFieldState>(
		FormFieldState.INITIAL
	);
	const [fieldStateEmail, setFieldStateEmail] = useState<FormFieldState>(
		FormFieldState.INITIAL
	);
	const [fieldStateMessage, setFieldStateMessage] = useState<FormFieldState>(
		FormFieldState.INITIAL
	);
	const [loadingIndicator, toggleloadingIndicator] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showFailureMessage, setShowFailureMessage] = useState(false);

	const handleValidation = () => {
		let isValid = true;
		if (!fullname.length) {
			isValid = false;
			setFieldStateName(FormFieldState.INVALID);
		}
		if (!email.length || !email.match(RegExpEmail)) {
			isValid = false;
			setFieldStateEmail(FormFieldState.INVALID);
		}
		if (!message.length) {
			isValid = false;
			setFieldStateMessage(FormFieldState.INVALID);
		}
		return isValid;
	};

	const onFetchError = () => {
		setShowSuccessMessage(false);
		setShowFailureMessage(true);
		toggleloadingIndicator(false);
	};

	const onFetchSuccess = () => {
		setShowSuccessMessage(true);
		setShowFailureMessage(false);
		toggleloadingIndicator(false);
	};

	const sendMail = () =>
		fetch("/api/sendgrid", {
			body: JSON.stringify({ email, fullname, message }),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (handleValidation()) {
			toggleloadingIndicator(true);
			const res = await sendMail();
			const { error } = await res.json();
			if (error) onFetchError();
			else onFetchSuccess();
		}
	};

	const validateName = (value: string) => {
		if (!value) setFieldStateName(FormFieldState.EMPTY);
		else setFieldStateName(FormFieldState.VALID);
	};

	const validateEmail = (value: string) => {
		if (!value) setFieldStateEmail(FormFieldState.EMPTY);
		else if (!email.match(RegExpEmail))
			setFieldStateEmail(FormFieldState.INVALID);
		else setFieldStateEmail(FormFieldState.VALID);
	};

	const validateMessage = (value: string) => {
		if (!value) setFieldStateMessage(FormFieldState.EMPTY);
		else setFieldStateMessage(FormFieldState.VALID);
	};

	const invalidateField = (state: FormFieldState, message: string) => {
		return (
			state === FormFieldState.INVALID && (
				<p className={classes.error}>{translate(message)}</p>
			)
		);
	};

	return (
		<div className={st(classes.root, className)}>
			{showSuccessMessage && (
				<div className={classes.info}>
					<CheckIcon />
					<p>{translate("CONTACT_FORM_SUCCESS_MESSAGE")}</p>
					<button>send another?</button>
					<button>back to home</button>
				</div>
			)}
			{showFailureMessage && (
				<div className={classes.info}>
					<ExclamationTriangleIcon />
					<p>{translate("CONTACT_FORM_SUCCESS_FAIL")}</p>
					<button>try again</button>
					<div>report problem or use email</div>
				</div>
			)}
			{!showSuccessMessage && !showFailureMessage && (
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				<form onSubmit={handleSubmit} className={classes.form}>
					<h2 className={classes.formTitle}>
						<EnvelopeClosedIcon />
						{translate("CONTACT_FORM_TITLE")}
					</h2>
					<div className={classes.field}>
						<label htmlFor="fullname" className={classes.label}>
							<span className={st(classes.caption, { required: true })}>
								<span className={classes.text}>
									<PersonIcon />
									{translate("CONTACT_FORM_LABEL_FULLNAME")}
									{fieldStateName === FormFieldState.VALID && (
										<CheckIcon className={classes.checkMark} />
									)}
								</span>
							</span>
							<input
								type="text"
								value={fullname}
								id="fullname"
								onChange={(e) => setFullname(e.target.value)}
								onBlur={(e) => validateName(e.target.value)}
								name="fullname"
								placeholder={translate(
									"CONTACT_FORM_LABEL_FULLNAME_PLACEHOLDER"
								)}
								className={st(classes.input, {
									type: "name",
									validation: fieldStateName,
								})}
							/>
							{invalidateField(fieldStateName, "CONTACT_FORM_INVALID_NAME")}
						</label>
					</div>
					<div className={classes.field}>
						<label htmlFor="email" className={classes.label}>
							<span className={st(classes.caption, { required: true })}>
								<span className={classes.text}>
									<GlobeIcon />
									{translate("CONTACT_FORM_LABEL_EMAIL")}
									{fieldStateEmail === FormFieldState.VALID && (
										<CheckIcon className={classes.checkMark} />
									)}
								</span>
							</span>
							<input
								type="email"
								name="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={(e) => validateEmail(e.target.value)}
								placeholder={translate("CONTACT_FORM_LABEL_EMAIL_PLACEHOLDER")}
								className={st(classes.input, {
									type: "email",
									validation: fieldStateEmail,
								})}
							/>
							{invalidateField(fieldStateEmail, "CONTACT_FORM_INVALID_EMAIL")}
						</label>
					</div>
					<div className={classes.field}>
						<label htmlFor="message" className={classes.label}>
							<span className={st(classes.caption, { required: true })}>
								<span className={classes.text}>
									<ChatBubbleIcon />
									{translate("CONTACT_FORM_LABEL_MESSAGE")}
									{fieldStateMessage === FormFieldState.VALID && (
										<CheckIcon className={classes.checkMark} />
									)}
								</span>
							</span>
							<textarea
								name="message"
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onBlur={(e) => validateMessage(e.target.value)}
								placeholder={translate(
									"CONTACT_FORM_LABEL_MESSAGE_PLACEHOLDER"
								)}
								className={st(classes.input, {
									type: "textarea",
									validation: fieldStateMessage,
								})}
							></textarea>
							{invalidateField(
								fieldStateMessage,
								"CONTACT_FORM_INVALID_MESSAGE"
							)}
						</label>
					</div>
					<div className={classes.submit}>
						{loadingIndicator ? (
							<LoadingIndicator
								label="CONTACT_FORM_LABEL_SEND_ACTIVE"
								delay={0}
								className={classes.loadingIndicator}
							/>
						) : (
							<button className={classes.button} type="submit">
								<PaperPlaneIcon />
								{translate("CONTACT_FORM_LABEL_SEND")}
							</button>
						)}
					</div>
				</form>
			)}
		</div>
	);
};

export default ContactForm;
