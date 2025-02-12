import { css } from 'lit';

export const participantBoxStyles = css`
	:host {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	header {
		font-weight: 600;
		padding: 0.25em;
		line-height: 1.2;
	}
	section {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow-y: hidden;
		align-items: stretch;
	}

	.title {
		display: flex;
		justify-content: center;
	}
	.control-buttons {
		display: flex;
		font-size: 1.15em;
	}

	.participants {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
	.participant-log {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		overflow-y: auto;
		height: 100px;
	}
	.participant-log > * {
		cursor: default;
		padding: 0.15em 0.5em;
	}
	.participant-log > *:hover {
		background-color: var(--sl-color-sky-100);
	}

	sl-menu ::part(base) {
		font-size: var(--sl-font-size-small);
	}
`;