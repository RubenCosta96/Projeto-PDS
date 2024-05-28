const db = require('../config/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');
const notification = require('./notifications');
const services = require("../Services/users");

exports.login = async (req, res) => {
	try {
		let email = req.body.email; 
		let password = req.body.password;

		let response = await services.login(email, password);

		return res.status(201).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.register = async (req, res) => {
	try {
		let { email, password, name} = req.body;

		let response = await services.register(email, password,name);

		return res.status(201).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.registerAdmin = async(req, res) =>{
	try {
		let idUserToken = req.user.id;
		let { email, password, name} = req.body;

		let response = await services.registerAdmin(idUserToken, email, password, name);

		return res.status(201).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUsers = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		
		let response = await services.getUsers(idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUser = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.getUser(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.editUser = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let email = req.body.email;
		let name = req.body.name;

		let response = await services.editUser(idUserToken, email, name);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeUser = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeUser(idUserToken, id);
		
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.tokenVerify = async (req, res) => {
	try {
		let token = req.params.token;

		let response = await services.tokenVerify(token);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.changeUserType = async (req, res) => {
	try {
		let id = req.params.id;
		let type = req.body.type;
		let idUserToken = req.user.id;

		let response = await services.changeUserType(idUserToken, id, type);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.changePassword = async (req, res) => {
	try {
		let oldPassword = req.body.oldPassword;
		let newPassword = req.body.newPassword;
		let idUserToken = req.user.id;

		let response = await services.changePassword(idUserToken, oldPassword, newPassword);
		
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.suspendActivity = async (req, res) => {
	try{
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.suspendActivity(idUserToken, id);

		return res.status(200).send(response);
	}catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


