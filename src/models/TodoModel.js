import {observable} from 'mobx';

export default class TodoModel {
	store;
	id;
	@observable title;
	@observable tag = []; //array to contain tags
	@observable completed;

	constructor(store, id, tag, title, completed) {
		this.store = store;
		this.id = id;
		this.tag = [tag];
		this.title = title;
		this.completed = completed;
	}

	toggle() {
		this.completed = !this.completed;
	}

	destroy() {
		this.store.todos.remove(this);
	}
	
	deleteTag(index) { //deletes all tags in tag
		var newTag = [];
		//this.tag.pop();
		if (this.tag[index] != undefined) {
			this.tag.splice(index, 1);
			//newTag = this.tag.slice(0, index).concat(this.tag.slice(index + 1, this.tag.length));
		}
		//this.tag = newTag;
		//this.tag[index] = undefined;
		//this.tag = [];
	}

	setTitle(title) {
		this.title = title;
	}
	
	addTag(tag) { //add a tag
		tag = tag.toUpperCase(); //capitalizes all letters in tag to prevent duplicates, also would like nicer given the proper style
		if (this.tag.includes(tag) == false) {
			this.tag.push(tag);
		}
	}

	toJS() {
		return {
			id: this.id,
			tag: this.tag,
			title: this.title,
			completed: this.completed
		};
	}

	static fromJS(store, object) {
		return new TodoModel(store, object.id, object.tag, object.title, object.completed);
	}
}
