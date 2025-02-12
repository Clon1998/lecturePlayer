import { css } from 'lit';

export const textLayerStyles = css`
	:root {
		--highlight-bg-color: rgba(180, 0, 170, 1);
		--highlight-selected-bg-color: rgba(0, 100, 0, 1);
	}

	@media screen and (forced-colors: active) {
		:root {
			--highlight-bg-color: Highlight;
			--highlight-selected-bg-color: ButtonText;
		}
	}

	.text-layer {
		position: absolute;
		text-align: initial;
		inset: 0;
		overflow: hidden;
		opacity: 0.25;
		line-height: 1;
		text-size-adjust: none;
		forced-color-adjust: none;
		transform-origin: 0 0;
		z-index: 2;
	}

	.text-layer :is(span, br) {
		color: transparent;
		position: absolute;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
	}

	/* Only necessary in Google Chrome, see issue 14205, and most unfortunately
	* the problem doesn't show up in "text" reference tests. */
	/*#if !MOZCENTRAL*/
	.text-layer span.markedContent {
		top: 0;
		height: 0;
	}

	/*#endif*/

	.text-layer .highlight {
		margin: -1px;
		padding: 1px;
		background-color: var(--highlight-bg-color);
		border-radius: 4px;
	}

	.text-layer .highlight.appended {
		position: initial;
	}

	.text-layer .highlight.begin {
		border-radius: 4px 0 0 4px;
	}

	.text-layer .highlight.end {
		border-radius: 0 4px 4px 0;
	}

	.text-layer .highlight.middle {
		border-radius: 0;
	}

	.text-layer .highlight.selected {
		background-color: var(--highlight-selected-bg-color);
	}

	.text-layer ::selection {
		/*#if !MOZCENTRAL*/
		background: blue;
		/*#endif*/
		background: AccentColor;
	}

	/* Avoids https://github.com/mozilla/pdf.js/issues/13840 in Chrome */
	/*#if !MOZCENTRAL*/
	.text-layer br::selection {
		background: transparent;
	}

	/*#endif*/

	.text-layer .endOfContent {
		display: block;
		position: absolute;
		inset: 100% 0 0;
		z-index: -1;
		cursor: default;
		user-select: none;
	}

	.text-layer .endOfContent.active {
		top: 0;
	}
`;