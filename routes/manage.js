const { Router } = require('express');
const CheckAuth = (req, res, next) => (req.session.user ? next() : res.status(401).redirect('/auth/login'));

module.exports.Router = class Server extends Router {
	constructor() {
		super();
		this.get('/:guildID', [CheckAuth], async (req, res) => {
			const guild = req.client.guilds.cache.get(req.params.guildID);
			if (!guild) return res.redirect('/selector');

            const member = await guild.members.fetch(req.user.id);
            if (!member || !member.permissions.has("MANAGE_GUILD")) return res.redirect("/selector");
            
			res.status(200).render('guild.ejs', {
				bot: req.client,
				user: req.user,
				is_logged: Boolean(req.session.user),
				guild,
                alert: null,
				errors: false,
                dashboardDetails: req.dashboardDetails,
				settings: req.dashboardSettings
			});
		});

		this.post("/:guildID", [CheckAuth], async (req, res) => {
			const guild = req.client.guilds.cache.get(req.params.guildID);
			if (!guild) return res.redirect("/selector");
			
			const member = await guild.members.fetch(req.user.id);
			if (!member) return res.redirect("/selector");
			if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/selector");

			const errors = [];
			Object.keys(req.body).forEach(item => {
				const setting = req.dashboardSettings.find(x => x.name === item);
				if (!setting) return;

				if (setting.validator && !setting.validator(req.body[item])) return errors.push(item);

				if (setting.type === 'boolean input') req.body[item] = Array.isArray(req.body[item]) ? true : false;

				setting.set(req.client, guild, req.body[item]);
			})
			
			res.status(200).render('guild.ejs', {
				bot: req.client,
				user: req.user,
				is_logged: Boolean(req.session.user),
				guild,
                alert: errors.length > 0 ? `The following items are invalid and have not been saved: ${errors.join(', ')}.` : 'Your settings have been saved.',
				errors: errors.length > 0,
                dashboardDetails: req.dashboardDetails,
				settings: req.dashboardSettings
			});
		});

		this.get('/', [CheckAuth], (req, res) => {
			res.redirect('/selector');
		});
	}
};

module.exports.name = '/manage';