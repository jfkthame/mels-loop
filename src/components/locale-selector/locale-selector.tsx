import React, { useContext } from "react";
import { ReactLocaleContext } from "../../contexts/locale-context";
import { ComponentProps } from "../../interfaces/models";
import { Button } from "../ui";
import { ToggleGroupRoot, ToggleGroupItem } from "../radix-primitives";
import { st, classes } from "./locale-selector.st.css";

export interface LocaleSelectorProps extends ComponentProps {
	onLocaleChange: (localeId: string) => Promise<boolean>;
}

export const LocaleSelector = ({
	onLocaleChange,
	className,
}: LocaleSelectorProps): JSX.Element => {
	const { locale, locales, getLocaleSymbol } = useContext(ReactLocaleContext);
	return (
		<div
			className={st(classes.root, className)}
			title={"Select Language"}
			aria-label={"Select Language"}
		>
			<ToggleGroupRoot
				type="single"
				onValueChange={(localeId) => {
					onLocaleChange(localeId as string).catch(() =>
						// TODO replace with logger call
						console.error("onLocaleChange Error")
					);
				}}
			>
				<ul className={classes.list}>
					{locales.map((id) => {
						const localeLabel = getLocaleSymbol(id);
						return (
							<ToggleGroupItem
								key={id}
								tabIndex={1}
								asChild
								title={localeLabel}
								value={id}
							>
								<li
									className={st(classes.item, {
										locale: id,
										selected: locale === id,
									})}
								>
									<Button label={localeLabel} />
								</li>
							</ToggleGroupItem>
						);
					})}
				</ul>
			</ToggleGroupRoot>
		</div>
	);
};

export default LocaleSelector;
