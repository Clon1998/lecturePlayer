import { css } from 'lit';

export const slideViewStyles = css`
	:host {
		width: 100%;
		height: 100%;
		min-height: 1px;
		padding: 0;
		margin: 0;
		overflow: hidden;
		position: relative;
		text-align: center;
		box-sizing: border-box;
		display: flex;
		align-items: center !important;
		justify-content: center !important;

		--scale-factor: 1;
	}
	:host .slide-canvas {
		display: none;
		z-index: 0;
	}
	:host .action-canvas {
		z-index: 1;
	}
	:host .volatile-canvas {
		z-index: 2;
	}

	.slide-container {
		background-clip: content-box;
		background-color: rgba(255, 255, 255, 1);
		box-sizing: border-box;
		border: 1px solid #94A3B8;
		border-radius: 0.25em;
		overflow-clip-margin: content-box;
		overflow: clip;
		position: absolute;
	}
	.slide-container > canvas {
		position: absolute;
		transform: translate(-50%, 0);
		left: 50%;
		box-sizing: border-box;
		margin: 0;
		display: block;
	}

	[data-main-rotation="90"] {
		transform: rotate(90deg) translateY(-100%);
	}
	[data-main-rotation="180"] {
		transform: rotate(180deg) translate(-100%, -100%);
	}
	[data-main-rotation="270"] {
		transform: rotate(270deg) translateX(-100%);
	}
`;