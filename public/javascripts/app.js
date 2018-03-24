var subjects = [];
var selected_note;
var selected_subject;
var selected_subject_id;
var selected_subject_tags = [];

// Forms
var add_subject_form = document.getElementById("add-subject-form");
var add_note_form = document.getElementById("add-note-form");
var add_tag_form = document.getElementById("add-tag-form");

// nav ul
var nav_ul = document.getElementById("nav-ul");
var controller_nav = document.getElementById("controller-nav");

// Templates
var new_subject_template = document.getElementById("new-subject");
var new_note_template = document.getElementById("new-note");
var notes_template = document.getElementById("notes");
var new_tag_template = document.getElementById("new-tag");
var detail_template = document.getElementById("detail");
var welcome_template = document.getElementById("welcome-page");

var templates = [
	new_subject_template, new_note_template,
	new_tag_template,notes_template, 
	welcome_template, detail_template
	];

var showTemplate = function(template_to_show){
	for(template of templates){
		if(template == template_to_show){
			template.style.display="block";
		} else {
			template.style.display="none";
		}
	}
}


add_subject_form.onsubmit = function (event) {
	event.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'api/subject', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == "200") {
			note = JSON.parse(xhr.responseText);
			update_notes(dump_notes(note.tagNotes));
			showTemplate(templates[3]);
			update_all_subjects();
		} else if ( xhr.status == 404) {
			console.log('Error');
		}
	};
	var new_subject = encode_URI(add_subject_form.childNodes[1].value);

	empty_form_field(add_subject_form, [1]);
	xhr.send("subject="+new_subject);
}

add_tag_form.onsubmit = function (event) {
	event.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'api/subject/tag', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == "200") {
			note = JSON.parse(xhr.responseText);
			update_tag(note);
			showTemplate(new_note_template);
			update_all_subjects();
		} else if ( xhr.status == 404) {
			console.log('Error');
		}
	};
	var subject_id = encode_URI(selected_subject_id);
	var tag = encode_URI(add_tag_form.childNodes[1].value);

	empty_form_field(add_tag_form, [1]);
	xhr.send("subjectId="+subject_id+"&tag="+tag);
}

add_note_form.onsubmit = function (event) {
	event.preventDefault();
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'api/subject/note', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == "200") {
			note = JSON.parse(xhr.responseText);
			update_notes(dump_notes(note));
			showTemplate(templates[3]);
			update_all_subjects();
		} else if ( xhr.status == 404) {
			console.log('Error');
		}
	};
	var subjectId = encode_URI(selected_subject_id);
	var tagId = encode_URI(add_note_form.childNodes[1].value);
	var title = encode_URI(add_note_form.childNodes[3].value);
	var content = encode_URI(add_note_form.childNodes[5].value); 
	empty_form_field(add_note_form, [1,3,5]);
	xhr.send("subjectId="+subjectId+"&tagId="+tagId+"&title="+title+"&content="+content);
}

var empty_form_field = function(form, child_index){
	for(index of child_index){
		form.childNodes[index].value = "";
	}
}

var encode_URI = function(uri){
	return encodeURIComponent(uri).replace(/%20/g,'+');
}

var dump_notes = function(raw_note){
	var note = [];
	for(tag_note of raw_note){
		note = note.concat(tag_note.notes);
	}
	return note;
}

var update_subject = function(subjects){
	var HTMLContent = "";

	if(subjects.length == 0){
		controller_nav.style.display = "none";
		showTemplate(templates[0]);
	} else if (selected_subject == null){
		controller_nav.style.display = "none";
	} else {
		controller_nav.style.display = "block";
	}

	for(subject of subjects){
		HTMLContent += `<li`;
		if(selected_subject == subject.subject){
			HTMLContent += ` class="active" `
			selected_subject_id = subject._id;
			selected_subject_tags = subject.tagNotes;
		}
		HTMLContent += `>
							<a onclick="select_subject('` + subject.subject + `')">
							` + subject.subject + `</a>
						</li>`;
	}
	nav_ul.innerHTML = HTMLContent;
}

var update_notes = function(notes){
	let HTMLContent = `<h2>Notes</h2>`;
	for(var i = 0; i < notes.length; i++){
		
		HTMLContent += `<div class="note-card">
							<h3 class="title-mini">
								<a onclick="select_note(`+i+`)">` 
								+ notes[i].title + `</a>
							</h3>
							<hr>
							<p class="content-mini">`
							+ notes[i].content +
							`</p>
						</div>`;
	}

	notes_template.innerHTML = HTMLContent;
}	

var update_detail_note = function(){
	var HTMLContent = `<h2 class="title">`+selected_note.title+`</h2>
            <div class="note-description">
            	<div class="desc">`+selected_subject+`</div>
            	<div class="desc">Tag</div>
            </div>
          <h3> Note </h3>
          <p class="content">` + selected_note.content + `</p>`;

	detail_template.innerHTML = HTMLContent;
}

var update_tag = function(tags){
	let HTMLContent = "";
	for(tag of tags){
		HTMLContent += '<option value="'+tag._id+'">';
		HTMLContent += tag.tagName
		HTMLContent += '</option>';
	}
	if(tags.length == 0){
		HTMLContent += '<option>';
		HTMLContent += "No Tag";
		HTMLContent += '</option>';
	}
	add_note_form.childNodes[1].innerHTML = HTMLContent;
}

var select_subject = function(subject){
	selected_subject = subject;
	update_subject(subjects);
	update_notes(dump_notes(selected_subject_tags));
	showTemplate(notes_template);
	update_tag(selected_subject_tags);
	//console.log(selected_subject_tags);
}

var select_note = function(note){
	selected_note = dump_notes(selected_subject_tags)[note];
	update_detail_note();
	showTemplate(detail_template);
	console.log(selected_note);
}

var update_all_subjects = function () {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'api/subject/all', true);
	xhr.setRequestHeader("Content-Type", "text/json");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == "200") {
			note = JSON.parse(xhr.responseText);
			subjects = note;
			update_subject(note);
		} else if ( xhr.status == 404) {
			console.log('Error');
			return "Error";
		}
	};

	xhr.send()
}

update_all_subjects();