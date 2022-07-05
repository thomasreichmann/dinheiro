import { ObjectId } from 'mongodb';

export default interface Transaction {
	userId: ObjectId;
	type: TransactionType;
	ammount: Number;
	before: Number;
	after: Number;
	date: String;
}

export enum TransactionType {
	OUT = 'OUT',
	IN = 'IN',
	RESET = 'RESET',
}
