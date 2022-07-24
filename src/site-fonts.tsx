import { mlUtils } from "./lib/ml-utils";
import { siteFontData } from "./site-fonts-data";

export interface IFontFace {
	id: string;
}

export interface IFontFaceLink extends IFontFace {
	href: string;
	format: string;
}

export interface IFontFaceDecl extends IFontFaceLink {
	name: string;
	weight: number;
}

const fontBasePath = "/assets/fonts"; // e.g. /public/assets/fonts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flatten(arr: any[]) {
	return arr.reduce((flat, toFlatten) => {
		return flat.concat(
			Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
		);
	}, []);
}

const FontFaceDecl = ({ name, id, href, weight, format }: IFontFaceDecl) => {
	const fontFaceProps = [
		["font-family", `"${name}"`],
		["src", `url("${fontBasePath}/${id}/${href}") format("${format}")`],
		["font-weight", weight],
		["font-display", "swap"],
	];
	return `@font-face{${fontFaceProps
		.map((keyVal) => `${keyVal[0]}: ${keyVal[1]};`)
		.join("")}}`;
};

const FontFaceLink = ({ id, href, format }: IFontFaceLink) => {
	return (
		<link
			key={mlUtils.uniqueId()}
			rel="preload"
			href={`${fontBasePath}/${id}/${href}`}
			as="font"
			type={`font/${format}`}
			crossOrigin="anonymous"
		/>
	);
};

export const fontFaceDecls = siteFontData
	.map(({ id, name, family }) => {
		return family
			.map(({ weight, format, href }) => {
				return FontFaceDecl({ name, id, href, weight, format });
			})
			.join("");
	})
	.join("");

export const fontFaceLinks = flatten(
	siteFontData.map(({ id, family }) => {
		return family.map(({ href, format }) => {
			return FontFaceLink({ id, href, format });
		});
	})
);
