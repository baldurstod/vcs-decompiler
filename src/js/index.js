import { BinaryReader } from 'harmony-binary-reader';
import { ShaderFile } from './shaderfile';
import { ShaderBlock } from './shaderblock';
import { ShaderConstraintBlock } from './shaderconstraintblock';

export function loadFile(file) {
	/*const br = new BinaryReader(ab);
	console.log(br);*/
	const reader = new FileReader();
	reader.onload = event => {
		console.log(event.target.result);
		loadArrayBuffer(event.target.result);
	}
	reader.readAsArrayBuffer(file);
}

export function loadArrayBuffer(ab) {
	const reader = new BinaryReader(ab);
	console.log(reader);
	loadShader(reader);
}

const VCS_MAGIC = 0x32736376;//vcs2

function loadShader(reader, type) {
	const shaderFile = new ShaderFile();
	const magic = reader.getUint32();
	//console.log(magic);
	if (VCS_MAGIC !== magic) {
		throw new Error('Bad magic');
	}

	if (type == 'features') {
		parseFeaturesHeader(reader, shaderFile);
	} else {
		parsePsHeader(reader, shaderFile);
	}

	const unk1 = reader.getUint32();
	const blockCount = reader.getUint32();
	for (let i = 0; i < blockCount; ++i) {
		shaderFile.blocks.push(parseBlock(reader));
	}

	const constraintBlockCount = reader.getUint32();
	for (let i = 0; i < constraintBlockCount; ++i) {
		shaderFile.constraintBlocks.push(parseConstraintBlock(reader));
	}

	console.log(shaderFile);
}

function parsePsHeader(reader, shaderFile) {

	shaderFile.version = reader.getUint32();
	if (shaderFile.version >= 64) {
		reader.skip(4);
	}

	reader.skip(16);
	reader.skip(16);

}

function parseBlock(reader) {
	const block = new ShaderBlock();
	const start = reader.tell();
	block.name = reader.getNullString();
	reader.seek(start + 64);
	block.category = reader.getNullString();
	reader.seek(start + 128);

	block.arg0 = reader.getInt32();
	block.rangeMin = reader.getInt32();
	block.rangeMax = reader.getInt32();
	block.arg3 = reader.getInt32();
	block.featureIndex = reader.getInt32();
	block.arg5 = reader.getInt32();

	return block;
}

function parseConstraintBlock(reader) {
	const block = new ShaderConstraintBlock();

	block.rule= reader.getInt32();
	block.blockType = reader.getInt32();
	console.log(reader.tell());

	return block;
}
