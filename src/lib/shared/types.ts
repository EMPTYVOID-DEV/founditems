export type PostStates =
	| 'Idle'
	| 'Processing claims'
	| 'Validated'
	| 'Payment'
	| 'Payment Validated'
	| 'Shipment'
	| 'Released';

export type ClaimsStates = 'Idle' | 'Rejected' | 'Accepted' | 'Post deleted';

export type Languages = 'ar' | 'fr';

export type QuizType = 'direct' | 'time' | 'address';
