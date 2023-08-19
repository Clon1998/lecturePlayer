import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { PlayerController } from './player.controller';
import { I18nLitElement, t } from '../i18n-mixin';
import { State } from '../../utils/state';
import { uiStateStore } from '../../store/ui-state.store';
import { Component } from '../component';
import playerStyles from './player.scss';

@customElement('lecture-player')
export class LecturePlayer extends Component {

	static styles = [
		I18nLitElement.styles,
		playerStyles,
	];

	private readonly controller = new PlayerController(this);

	@property({ type: Number })
	courseId: number;

	@property({ type: Boolean })
	isClassroom: boolean;


	protected render() {
		return html`
			${choose(uiStateStore.state, [
				[State.CONNECTING,			() => html`<player-loading .text="${t("course.loading")}"></player-loading>`],
				[State.CONNECTED,			() => html`<player-view .playerController="${this.controller}" .messageService="${this.controller.messageService}"></player-view>`],
				[State.CONNECTED_FEATURES,	() => html`<player-feature-view .messageService="${this.controller.messageService}"></player-feature-view>`],
				[State.DISCONNECTED,		() => html`<player-offline></player-offline>`]
			],
			() => html`<h1>Error</h1>`)}
		`;
	}
}
