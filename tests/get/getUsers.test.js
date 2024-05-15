var request = require("request");
var usersController = require("../../controllers/users");

const hostname = "127.0.0.1";
const port = 3000;

var baseUrl = `http://${hostname}:${port}/users/`;

describe("Creating cenarios where the program must return the expected codes", function () {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	jest.setTimeout(10000);

	it("Trying a token without generating one", async function () {
		const req = {
			token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE1Nzg2NjI5LCJleHAiOjE3MTU4NzMwMjl9.meD0vbyMu9W_IfcnkpgvHofAiDcqly4X-CMQ6ESCrgQ",
		};

		const res = {
			status: jest.fn().mockReturnValue(404),
			send: jest.fn().mockReturnValue({ sucess: 0, message: "Utilizador inexistente" }),
		};

		await usersController.tokenVerify(req, res);

		expect(res.status()).toBe(404);

		expect(res.send().sucess).toEqual(0);
	});

	it("Trying by link", function () {
		request.get(
			{
				url: `${baseUrl}/token/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE1Nzg2NjI5LCJleHAiOjE3MTU4NzMwMjl9.meD0vbyMu9W_IfcnkpgvHofAiDcqly4X-CMQ6ESCrgQ`,
			},
			function (error, response, body) {
				expect(response).toEqual(404);
				done();
			}
		);
	});
});
