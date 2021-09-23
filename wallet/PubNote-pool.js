class NotePool {
	constructor() {
		this.NoteMap = [];
	}

	setNote(Note) {
		this.NoteMap.push(Note);
	}

	setPool(NotePool) {
		this.NoteMap = NotePool;
	}
	clear() {
		this.NoteMap =[]; 
	}
}

module.exports = NotePool;
