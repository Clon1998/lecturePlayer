import { PropertyValues, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { MessageService } from '../../service/message.service';
import { I18nLitElement, t } from '../i18n-mixin';
import { featureViewStyles } from './feature-view.styles';
import { course } from '../../model/course';
import { SlSplitPanel, SlTab, SlTabGroup, SlTabHideEvent } from '@shoelace-style/shoelace';
import { SwipeObserver } from '../../utils/swipe-observer';
import { Component } from '../component';
import { featureStore } from '../../store/feature.store';
import { autorun } from 'mobx';
import { privilegeStore } from '../../store/privilege.store';
import { chatStore } from '../../store/chat.store';

@customElement('player-feature-view')
export class PlayerFeatureView extends Component {

	static styles = [
		I18nLitElement.styles,
		featureViewStyles,
	];

	private tabSwipeObserver: SwipeObserver;

	private readonly maxWidth600Query: MediaQueryList;

	@property()
	messageService: MessageService;

	@query("#outer-split-panel")
	outerSplitPanel: SlSplitPanel;

	@query("sl-tab-group")
	tabGroup: SlTabGroup;

	@property({ type: Boolean, reflect: true })
	participantsVisible: boolean = true;

	@property({ type: Boolean, reflect: true })
	unreadMessagesVisible: boolean = false;

	unreadMessagesExist: boolean = false;

	section: string = "chat";

	prevSection: string = null;

	isCompactMode: boolean = false;

	isChatVisible: boolean = false;

	hasChat: boolean = false;

	hasQuiz: boolean = false;


	constructor() {
		super();

		this.tabSwipeObserver = new SwipeObserver();

		// Matches with the css query.
		this.maxWidth600Query = window.matchMedia("(max-width: 600px)");
		this.maxWidth600Query.onchange = (event) => {
			this.onCompactLayout(event.matches);
		};

		this.isCompactMode = this.maxWidth600Query.matches;

		autorun(async () => {
			this.hasChat = featureStore.hasChatFeature();

			if (!this.hasChat) {
				// Chat is gone.
				this.section = this.section === "chat" ? this.prevSection : this.section;
			}

			this.refresh();
		});
		autorun(async () => {
			this.hasQuiz = featureStore.hasQuizFeature();

			if (this.hasQuiz) {
				// Quiz has been started, show it automatically.
				this.section = "quiz";
			}
			else {
				// Quiz is gone.
				this.section = this.section === "quiz" ? this.prevSection : this.section;
			}

			this.refresh();
		});
		autorun(() => {
			this.participantsVisible = privilegeStore.canViewParticipants();

			this.requestUpdate();
		});
	}

	override disconnectedCallback() {
		this.tabSwipeObserver.disconnect();

		super.disconnectedCallback();
	}

	protected willUpdate(): void {
		// Check if all received messages have been read or at least visible to the user.
		if (this.unreadMessagesExist && chatStore.unreadMessages === 0) {
			this.unreadMessagesExist = false;
		}

		if (this.isChatVisible) {
			this.unreadMessagesVisible = this.unreadMessagesExist;
		}
		else {
			this.unreadMessagesVisible = chatStore.unreadMessages > 0;
		}
	}

	protected firstUpdated(): void {
		this.tabGroup.addEventListener("sl-tab-show", (e: SlTabHideEvent) => {
			this.section = e.detail.name;
		});
		this.tabGroup.addEventListener("sl-tab-hide", (e: SlTabHideEvent) => {
			this.prevSection = e.detail.name;
		});

		// Register and observe horizontal swipe events.
		this.tabGroup.addEventListener("swiped-left", (e: CustomEvent) => {
			const tabs = this.tabGroup.querySelectorAll("sl-tab");

			this.selectTabSibling(tabs, -1);
		});
		this.tabGroup.addEventListener("swiped-right", (e: CustomEvent) => {
			const tabs = this.tabGroup.querySelectorAll("sl-tab");

			this.selectTabSibling(tabs, 1);
		});

		this.tabSwipeObserver.observe(this.tabGroup);
	}

	protected updated(changedProperties: PropertyValues): void {
		super.updated(changedProperties);

		if (this.tabGroup) {
			let showSection = this.section;
			let tab: SlTab = this.tabGroup.querySelector(`sl-tab[panel=${showSection}]`);

			tab = this.checkOrGetDefaultTab(tab);
			if (tab) {
				showSection = tab.panel;
			}

			this.tabGroup.show(showSection);
		}
	}

	protected render() {
		return html`
			<div>
				<sl-split-panel position="0" id="outer-split-panel">
					<div slot="start" class="left-container">
						<div class="participants-container">
						${when(this.participantsVisible, () => html`
							<participants-box></participants-box>
						`)}
						</div>
					</div>
					<div slot="end" class="center-container">
						<div class="feature-container">
							<sl-tab-group>
								${this.renderParticipants()}
								${this.renderQuiz()}
								${this.renderChat()}
							</sl-tab-group>
						</div>
					</div>
				</sl-split-panel>
			</div>
		`;
	}

	protected renderChat() {
		if (!this.hasChat) {
			return '';
		}

		return html`
			<sl-tab slot="nav" panel="chat">
				${t("course.feature.message")}
				<sl-badge pill>${chatStore.unreadMessages}</sl-badge>
			</sl-tab>
			<sl-tab-panel name="chat">
				<chat-box @chat-visibility="${this.onChatVisibility}" .messageService="${this.messageService}"></chat-box>
			</sl-tab-panel>
		`;
	}

	protected renderQuiz() {
		if (!this.hasQuiz) {
			return '';
		}

		return html`
			<sl-tab slot="nav" panel="quiz">
				${t("course.feature.quiz")}
			</sl-tab>
			<sl-tab-panel name="quiz">
				<quiz-box .courseId="${course.courseId}"></quiz-box>	
			</sl-tab-panel>
		`;
	}

	protected renderParticipants() {
		if (!this.isCompactMode || !this.participantsVisible) {
			return '';
		}

		return html`
			<sl-tab slot="nav" panel="participants">${t("course.participants")}</sl-tab>
			<sl-tab-panel name="participants">
				<participants-box></participants-box>
			</sl-tab-panel>
		`;
	}

	private async refresh() {
		this.requestUpdate();
		// Update once again for smooth tab selection as tabs come and go.
		await this.updateComplete;
		this.requestUpdate();
	}

	private onCompactLayout(compact: boolean) {
		this.isCompactMode = compact;

		let tab: SlTab = this.tabGroup.querySelector("sl-tab[active]");

		// Select non-participants tab for activation.
		if (tab.panel !== "participants") {
			this.section = tab.panel;
		}
		else {
			// Participants tab is selected and disapeared due to layout change.
			tab = this.checkOrGetDefaultTab(null);
			if (tab) {
				this.section = tab.panel;
			}
		}

		this.requestUpdate();
	}

	private onChatVisibility(event: CustomEvent) {
		this.isChatVisible = event.detail.visible;

		if (this.isChatVisible) {
			this.unreadMessagesVisible = chatStore.unreadMessages > 0;

			if (this.unreadMessagesVisible) {
				this.unreadMessagesExist = true;
			}
		}
		else {
			this.unreadMessagesVisible = false;
		}
	}

	private checkOrGetDefaultTab(tab: SlTab): SlTab {
		if (!tab) {
			tab = this.tabGroup.querySelector(`sl-tab[panel=${this.prevSection}]`);
			if (!tab) {
				tab = this.tabGroup.querySelectorAll("sl-tab:not([panel=participants])").item(0) as SlTab;
			}
		}
		return tab;
	}

	private selectTabSibling(tabs: NodeListOf<SlTab>, delta: number) {
		for (let i = 0; i < tabs.length; i++) {
			const tab = tabs[i];

			if (tab.active) {
				const nextTab = tabs[i + delta];

				if (nextTab) {
					this.tabGroup.show(nextTab.panel);
					break;
				}
			}
		}
	}
}
