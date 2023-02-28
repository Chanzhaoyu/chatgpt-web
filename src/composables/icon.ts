import { h } from "vue";
import { SvgIcon } from "@/components/common";

export const useIconRender = () => {
	interface IconConfig {
		icon?: string;
		localIcon?: string;
		color?: string;
		fontSize?: number;
	}

	interface IconStyle {
		color?: string;
		fontSize?: string;
	}

	const iconRender = (config: IconConfig) => {
		const { color, fontSize, icon, localIcon } = config;

		const style: IconStyle = {};

		if (color) {
			style.color = color;
		}
		if (fontSize) {
			style.fontSize = `${fontSize}px`;
		}

		if (!icon && !localIcon) {
			window.console.warn("iconRender: icon or localIcon is required");
		}

		return () => h(SvgIcon, { icon, localIcon, style });
	};

	return {
		iconRender,
	};
};
