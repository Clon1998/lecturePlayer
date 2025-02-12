import { css } from 'lit';

export const chatBoxStyles = css`
	:host {
		display: flex;
		flex-direction: column;
	}
	header {
		align-self: center;
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
	footer {
		display: flex;
		flex-direction: column;
	}
	footer sl-icon {
		font-size: 16px;
	}

	.chat-history {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
	.chat-history-log {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		overflow-y: auto;
		height: 100px;
		padding: 0 15px 0 5px;
	}
	.chat-history-log > * {
		margin-bottom: 1em;
	}
`;