const db = require('../config/mysql');
const utils = require('../utils/index');
const services = require('../Services/notifications');

exports.getUnreadNotifications = async (req, res) => {
    try{
        let idUserToken = req.user.id;

		let response = await services.getUnreadNotifications(idUserToken);
        
        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getReadNotifications = async (req, res) => {
    try{
        let idUserToken = req.user.id;

		let response = await services.getReadNotifications(idUserToken);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getAllNotifications = async (req, res) =>{
    try{
		let idUserToken = req.user.id;

		let response = await services.getAllNotifications(idUserToken);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addNotifications = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
		let description = req.body.description;
		let type = req.body.type;
		let userId = req.body.userId;

		let response = await services.addNotifications(idUserToken, description,type,userId);

		return response;
    }catch (err) {
		throw new Error(err.message);
	}
};

exports.informImproperConduct = async (req, res) =>{
	try{
		let id = req.params.id;
		let idUserToken = req.user.id;
		let description = req.body.description;
		let type = req.body.type;

		let response = await services.informImproperConduct(idUserToken, id, description, type)

		return res.status(200).send(response);
	}catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
}