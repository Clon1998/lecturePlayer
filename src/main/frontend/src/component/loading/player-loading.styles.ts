import { css } from 'lit';

export const playerLoadingStyles = css`
	:host {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: inherit;
		justify-content: center;
	}
	.lds-ellipsis {
		display: flex;
		align-content: center;
		align-items: center;
		position: relative;
		width: 80px;
		height: 20px;
	}
	.lds-ellipsis div {
		position: absolute;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #0d6efd;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
`;