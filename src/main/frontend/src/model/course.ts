import { Utils } from '../utils/utils';
import { CourseMediaState, CoursePrivilege } from './course-state';
import { CourseStateDocument } from './course-state-document';
import { StreamStats } from './stream-stats';

class Course extends EventTarget {

	private _courseId: number;

	private _timeStarted: number;

	private _title: string;

	private _description: string;

	private _userId: string;

	private _documentMap: Map<bigint, CourseStateDocument>;

	private _activeDocument: CourseStateDocument;

	private _mediaState: CourseMediaState;

	private _streamStats: StreamStats = {};


	get courseId() {
		return this._courseId;
	}

	set courseId(courseId: number) {
		this._courseId = courseId;

		this.dispatchEvent(Utils.createEvent("course-id"));
	}

	get timeStarted() {
		return this._timeStarted;
	}

	set timeStarted(timeStarted: number) {
		this._timeStarted = timeStarted;

		this.dispatchEvent(Utils.createEvent("course-time-started"));
	}

	get title() {
		return this._title;
	}

	set title(title: string) {
		this._title = title;

		this.dispatchEvent(Utils.createEvent("course-title"));
	}

	get description() {
		return this._description;
	}

	set description(description: string) {
		this._description = description;

		this.dispatchEvent(Utils.createEvent("course-description"));
	}

	get userId() {
		return this._userId;
	}

	set userId(userId: string) {
		this._userId = userId;

		this.dispatchEvent(Utils.createEvent("course-user-id"));
	}

	get documentMap() {
		return this._documentMap;
	}

	set documentMap(map: Map<bigint, CourseStateDocument>) {
		this._documentMap = map;

		this.dispatchEvent(Utils.createEvent("course-documents"));
	}

	get activeDocument() {
		return this._activeDocument;
	}

	set activeDocument(document: CourseStateDocument) {
		this._activeDocument = document;

		this.dispatchEvent(Utils.createEvent("course-active-document"));
	}

	get mediaState() {
		return this._mediaState;
	}

	set mediaState(state: CourseMediaState) {
		this._mediaState = state;

		this.dispatchEvent(Utils.createEvent("course-media-state"));
	}

	get streamStats() {
		return this._streamStats;
	}

	set streamStats(stats: StreamStats) {
		this._streamStats = stats;

		this.dispatchEvent(Utils.createEvent("course-stream-stats"));
	}
}

export const course = new Course();