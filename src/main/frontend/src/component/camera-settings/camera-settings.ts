import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property, query } from 'lit/decorators.js';
import { I18nLitElement, t } from '../i18n-mixin';
import { DeviceInfo, Devices } from '../../utils/devices';
import { DeviceSettings, Settings } from '../../utils/settings';
import { cameraSettingsStyles } from './camera-settings.styles';

@customElement("camera-settings")
export class CameraSettings extends I18nLitElement {

	static styles = [
		I18nLitElement.styles,
		cameraSettingsStyles
	];

	@property()
	videoInputDevices: MediaDeviceInfo[] = [];

	@property({ type: Boolean, reflect: true })
	enabled: boolean = false;

	@property({ type: Boolean, reflect: true })
	error: boolean = false;

	@property()
	devicesBlocked: boolean;

	@property()
	videoInputBlocked: boolean;

	@query('#cameraPreview')
	video: HTMLVideoElement;


	getDeviceSettings(): DeviceSettings {
		const deviceForm: HTMLFormElement = this.renderRoot?.querySelector('#deviceSelectForm') ?? null;
		const data = new FormData(deviceForm);

		return <DeviceSettings> <unknown> Object.fromEntries(data.entries());
	}

	override connectedCallback() {
		super.connectedCallback();

		Devices.enumerateDevices(true, true)
			.then((result: DeviceInfo) => {
				this.updateModel(result, false);
			})
			.catch(error => {
				console.error(error);

				if (error.name == "NotReadableError") {
					Devices.enumerateDevices(false, true)
						.then((result: DeviceInfo) => {
							this.updateModel(result, true);
						})
						.catch(error => {
							console.error(error);
						});
				}
				else if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError") {
					this.devicesBlocked = true;
					this.setError();
				}
				else {
					Devices.enumerateDevices(false, false)
						.then((result: DeviceInfo) => {
							this.updateModel(result, false);
						})
						.catch(error => {
							console.error(error);
						});
				}
			});
	}

	override disconnectedCallback() {
		Devices.stopMediaTracks(<MediaStream> this.video.srcObject);

		this.video.srcObject = null;

		super.disconnectedCallback();
	}

	protected override firstUpdated() {
		this.setEnabled(false);
	}

	private setEnabled(enabled: boolean) {
		this.enabled = enabled;

		// Initially, disable all inputs.
		this.renderRoot.querySelectorAll("button, input, select").forEach((element: HTMLInputElement) => {
			element.disabled = !enabled;
		});
	}

	private setError() {
		this.error = true;

		// Enable only buttons in the footer.
		this.renderRoot.querySelectorAll("footer button").forEach((element: HTMLInputElement) => {
			element.disabled = false;
		});
	}

	private updateModel(result: DeviceInfo, cameraBlocked: boolean) {
		const devices = result.devices;

		this.videoInputDevices = devices.filter(device => device.kind === "videoinput");
		this.videoInputBlocked = cameraBlocked;

		this.video.srcObject = result.stream;
		this.video.muted = true;

		if (!this.videoInputDevices.find(devInfo => { return devInfo.deviceId === Settings.getCameraId() })) {
			Devices.stopVideoTracks(this.video.srcObject as MediaStream);
		}

		this.setEnabled(true);
	}

	private onCameraChange(event: Event) {
		Devices.stopVideoTracks(this.video.srcObject as MediaStream);

		const videoSource = (<HTMLInputElement> event.target).value;
		const videoConstraints: any = {};

		if (videoSource === "none") {
			this.video.style.display = "none";
			this.videoInputBlocked = false;
			return;
		}

		videoConstraints.video = {
			deviceId: videoSource ? { exact: videoSource } : undefined,
			width: 1280,
			height: 720,
			facingMode: "user"
		};

		navigator.mediaDevices.getUserMedia(videoConstraints)
			.then(videoStream => {
				const newStream = new MediaStream();

				(<MediaStream> this.video.srcObject).getAudioTracks().forEach(track => newStream.addTrack(track));
				videoStream.getVideoTracks().forEach(track => newStream.addTrack(track));

				this.video.srcObject = newStream;
				this.video.style.display = "block";

				this.videoInputBlocked = false;
			})
			.catch(error => {
				console.error(error);

				if (error.name == "NotReadableError") {
					this.videoInputBlocked = true;
				}
				else if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError") {
					this.devicesBlocked = true;
				}
			});
	}

	protected override render() {
		return html`
			<player-loading .text="${t("devices.querying")}"></player-loading>

			<div class="row alert alert-warning m-2 ${classMap({ "d-none": !this.devicesBlocked })}" role="alert">
				<span>${t("devices.permission")}</span>
			</div>
			<div class="row alert alert-warning m-2 ${classMap({ "d-none": !this.videoInputBlocked })}" role="alert">
				<span>${t("devices.camera.blocked")}</span>
			</div>

			<form id="deviceSelectForm">
				<div class="row">
					<div class="col-md-4">
						<video id="cameraPreview" class="pt-2 ratio ratio-16x9" playsinline autoplay muted></video>
					</div>
					<div class="col-md-8">
						<div class="mb-3">
							<label for="cameraSelect" class="form-label">${t("devices.camera")}</label>
							<select @change="${this.onCameraChange}" name="videoInput" id="cameraSelect" class="form-select form-select-sm" aria-label=".form-select-sm camera">
								<option value="none">${t("devices.none")}</option>
								${this.videoInputDevices.map((device) =>
									html`<option value="${device.deviceId}" ?selected="${Settings.getCameraId() === device.deviceId}">${Devices.removeHwId(device.label)}</option>`
								)}
							</select>
						</div>
					</div>
				</div>
				<div class="row">
					<canvas id="meter" width="300" height="5"></canvas>
				</div>
			</form>
		`;
	}
}