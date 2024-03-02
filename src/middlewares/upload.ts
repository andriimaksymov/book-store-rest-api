import multer from 'multer';
import { Request } from 'express';

// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
		callback(null, 'images');
	},
	filename(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
		callback(null, new Date().toISOString() + '-' + file.originalname);
	},
});

// const fileFilter = (
// 	req: Request,
// 	file: Express.Multer.File,
// 	callback: (error: Error | null, bool: boolean) => void,
// ) => {
// 	const isAcceptableType = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype);
// 	callback(null, isAcceptableType);
// };

// Create the multer instance
const upload = multer({ storage: storage });

export = upload;
