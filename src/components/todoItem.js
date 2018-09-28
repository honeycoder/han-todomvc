import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

@observer
export default class TodoItem extends React.Component {
	@observable editText = "";
	@observable editTag = ""; //initializing string for tag

	render() {
		const {viewStore, todo} = this.props;
		return (
			<li className={[
				todo.completed ? "completed": "",
				expr(() => todo === viewStore.todoBeingEdited ? "editing" : "")
			].join(" ")}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={todo.completed}
						onChange={this.handleToggle}
					/>
					<label onDoubleClick={this.handleEdit}>
						{todo.title}<br />
						{todo.tag}
					</label>
					<button className="destroy" onClick={this.handleDeleteTag} />	{/*can only delete todo after delete tags first*/}
				</div>
				<input
					ref="editField"
					className="edit"
					value={this.editText}
					onBlur={this.handleSubmit}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
				/>
				<input
					ref="newtag"
					className="new-tag"
					id="tag-id"
					placeholder="ADD A TAG"/*instructs users where to type tag*/
					value={this.editTag}
					onBlur={this.handleSubmitTag} /*submits tag when clicking outside of textfield*/
					onChange={this.handleChangeTag}
					onKeyDown={this.handleKeyDownTag} 
				/>
				<button type="button" onClick={this.handleDeleteTag} />
			</li>
		);
	}

	handleSubmit = (event) => {
		const val = this.editText.trim();
		if (val) {
			this.props.todo.setTitle(val);
			this.editText = val;
		} else {
			this.handleDestroy();
		}
		this.props.viewStore.todoBeingEdited = null;
	};
	
	handleSubmitTag = (event) => {
		const val = this.editTag.trim();
		if (val) {
			this.props.todo.addTag(val);
			this.editTag = '';
		} 
		this.props.viewStore.todoBeingEdited = null;
		document.getElementById("tag-id").value='';//empties textfield once submitted
	};

	handleDestroy = () => {
		this.props.todo.destroy();
		this.props.viewStore.todoBeingEdited = null;
	};
	
	handleDeleteTag = () => { //can only delete todos after first deleting tag, button must be clicked twice
		if (this.props.todo.tag.length == 0){
			this.handleDestroy();
		}else{
			this.props.todo.deleteTag();
		}
	};

	handleEdit = () => {
		const todo = this.props.todo;
		this.props.viewStore.todoBeingEdited = todo;
		this.editText = todo.title;
	};
	
	handleEditTag = () => {
		const todo = this.props.todo;
		this.props.viewStore.todoBeingEdited = todo;
		this.editTag = todo.tag;
	};

	handleKeyDown = (event) => {
		if (event.which === ESCAPE_KEY) {
			this.editText = this.props.todo.title;
			this.props.viewStore.todoBeingEdited = null;
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	};
	
	handleKeyDownTag = (event) => {
		if (event.which === ESCAPE_KEY) {
			this.editTag = this.props.todo.tag;
			this.props.viewStore.todoBeingEdited = null;
		} else if (event.which === ENTER_KEY) {
			this.handleSubmitTag(event);
		}
	};

	handleChange = (event) => {
		this.editText = event.target.value;
	};
	
	handleChangeTag = (event) => {
		this.editTag = event.target.value;
	};

	handleToggle = () => {
		this.props.todo.toggle();
	};
}

TodoItem.propTypes = {
	todo: PropTypes.object.isRequired,
	viewStore: PropTypes.object.isRequired
};