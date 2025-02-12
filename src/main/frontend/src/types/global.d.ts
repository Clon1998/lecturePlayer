declare module '*.css';
declare module '*.scss';


interface HTMLMediaElement {

	setSinkId(id: string): Promise<undefined>;

}

interface RTCCodecStats {

	payloadType: number;
	transportId: string;
	mimeType: string;
	clockRate: number;
	channels: number;
	sdpFmtpLine: string;

}

interface RTCInboundRtpStreamStats extends RTCReceivedRtpStreamStats {

	firCount?: number;
	framesDecoded?: number;
	nackCount?: number;
	pliCount?: number;
	qpSum?: number;
	remoteId?: string;
	bytesReceived?: number;
	frameHeight?: number;
	frameWidth?: number;
	framesPerSecond?: number;

}

interface RTCOutboundRtpStreamStats extends RTCSentRtpStreamStats {

	firCount?: number;
	framesEncoded?: number;
	nackCount?: number;
	pliCount?: number;
	qpSum?: number;
	remoteId?: string;
	frameHeight?: number;
	frameWidth?: number;
	framesPerSecond?: number;

}

interface RTCDataChannelStats extends RTCStats {

	label?: string;
	protocol?: string;
	dataChannelIdentifier?: number;
	state?: RTCDataChannelState;
	messagesSent?: number;
	bytesSent?: number;
	messagesReceived?: number;
	bytesReceived?: number;

}