import nodemailer from 'nodemailer';

const sendEmail = async (email: string, subject: string, text: string) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.NODEMAILER_HOST,
			port: 2525,
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_Password,
			},
		});

		await transporter.sendMail({
			from: 'test@gmail.com',
			to: email,
			subject,
			text,
		});
	} catch (error) {
		console.log(error, 'email not sent');
	}
};

export default sendEmail;
