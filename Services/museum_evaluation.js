const utils = require("../utils/index");
const db = require("../config/mysql");

exports.getMuseumEvaluations = async () => {
	try {
		let museum_evaluations = await db.museum_evaluation.findAll();

		if (museum_evaluations.length === 0) throw new Error("Não existem avaliações de museu");

		let response = {
			success: 1,
			length: museum_evaluations.length,
			results: museum_evaluations.map((museum_evaluation) => {
				return {
					description: museum_evaluation.me_description,
					evaluation: museum_evaluation.me_evaluation,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getMuseumEvaluation = async (id) => {
	try {
		let museum_evaluation = await db.museum_evaluation.findByPk(id);

		if (!museum_evaluation) throw new Error("Avaliação inexistente");

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					description: museum_evaluation.me_description,
					evaluation: museum_evaluation.me_evaluation,
				},
			],
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addMuseumEvaluation = async (description, evaluation, museumId, userId) => {
	try {
		let newMuseum_Evaluation = await db.museum_evaluation.create({
			me_description: description,
			me_evaluation: evaluation,
			museummid: museumId,
			useruid: userId,
		});

		let response = {
			success: 1,
			message: "Avaliação criada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editMuseumEvaluation = async (id, description, evaluation) => {
	try {
		let museum_evaluation = await db.museum_evaluation.findByPk(id);

		if (!museum_evaluation) {
			throw new Error("Avaliação inexistente");
		}

		if (description) museum_evaluation.me_description = description;
		if (evaluation) museum_evaluation.me_evaluation = evaluation;

		await museum_evaluation.save();

		let response = {
			success: 1,
			message: "Avaliação editada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeMuseumEvaluation = async (id) => {
	try {
		const museum_evaluation = await db.museum_evaluation.findByPk(id);

		if (!museum_evaluation) {
			throw new Error("Avaliação inexistente");
		}

		await museum_evaluation.destroy();

		let response = {
			success: 1,
			message: "Avaliação removida com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
