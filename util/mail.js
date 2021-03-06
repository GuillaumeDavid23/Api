import nodemailer from 'nodemailer'

export default async (method, infos) => {
	// Création du transporteur:
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		auth: {
			user: process.env.mailAmaizon,
			pass: process.env.passMail,
		},
	})

	// Récupération du contenu:
	switch (method) {
		case 'sendAlert':
			var from = `"Amaizon" <${process.env.mailAmaizon}>`
			var { to, amount, city, surface, type, idProperty } = infos
			var subject = 'Nouvelle propriété dans vos critères.'
			var body = `Bonjour,<br><br>
            Une nouvelle propriété vient d'être ajouté sur notre site.<br>
			Une ou plusieurs de ces caractéristiques correspond à ce que vous avez renseigné dans vos préférences.<br><br>
			Voici les propriétés de cette propriété:<br>
			Montant: ${amount} €<br>
			Ville: ${city}<br>
			Surface: ${surface} m²<br>
			Type: ${type}<br><br>
			Vous pourrez retrouver cette propriété à l'adresse suivante:<br>
			https://amaizon.fr/property/${idProperty}<br><br>
			N'hésitez pas à nous contacter si cette propriété suscite votre intérêt !<br>
			A bientôt<br>
			Amaizon`
			break

		case 'forgotPass':
			var from = `"Amaizon" <${process.env.mailAmaizon}>`
			var { to, userId, token } = infos
			var subject = 'Réinitialisation de mot de passe.'
			var body = `Bonjour<br>
			Une demande de réinitialisation de mot de passe a été sollicité de votre part.
            Veuillez vous rendre sur la page dédié en cliquant 
            sur ce lien:<br>
            <a href="${process.env.UI_DOMAIN}resetPassword/${userId}/${token}">
            https://amaizon.fr/resetPassword/${userId}/${token}
            </a><br><br>
			Cordialement,<br>
			L'équipe Amaizon`
			break

		case 'emailVerification':
			var from = `"Amaizon" <${process.env.mailAmaizon}>`
			var { to, token } = infos
			var subject = 'Vérification de votre email.'
			var body = `Bonjour<br>
			Merci d'avoir créer un compte sur notre site web Amaizon.<br>
			Une vérification par email est nécessaire, merci de cliquer sur le lien suivant pour y procéder:<br>
            <a href="${process.env.UI_DOMAIN}emailVerification/${token}">
            ${process.env.UI_DOMAIN}emailVerification/${token}
            </a><br><br>
			Cordialement,<br>
			L'équipe Amaizon`
			break

		case 'sendMessage':
			var { lastname, firstname, email, tel, subject, message } = infos
			var from = `"${lastname} ${firstname}" <${email}>`
			var to = process.env.mailAmaizon
			var subject = 'Contact: ' + subject
			var body = `Un message a été reçu depuis le site Vitrine.<br><br>
			Voici son contenu:<br>
			${message}<br><br>
			Voici les coordonnées de l'utilisateur à l'origine du message:<br>
			Nom: ${firstname} ${lastname}<br>
			Email: ${email}<br>
			Téléphone: ${tel}`
			break

		case 'emailAppointment':
			var from = `"Amaizon" <${process.env.mailAmaizon}>`
			var { to, details } = infos
			var subject = 'Rendez-vous client.'
			var body = `Bonjour<br>
			Un client souhaite prendre rendez-vous pour le bien : ${details.ref}<br>
			Voici ses informations :<br>
            <br><br>
			Nom : ${details.lastname} 
			<br>
			Prénom : ${details.firstname} 
			<br>
			Email : ${details.email} 
			<br>
			Raison : ${details.reason} 
			<br>
			<span style="font-weight: bold;">infos : </span>
			<br>
			${details.infos} 
			<br>

			Cordialement,<br>
			L'équipe Amaizon`
			break
	}
	// Envoi de l'email:
	var sending = await transporter.sendMail({
		from,
		to,
		subject,
		html: body,
	})

	console.log('Message sent: %s', sending.messageId)
}
