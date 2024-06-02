const services = require("../../Services/users");
const db = require("../../config/mysql");
const utils = require("../../utils/index");

jest.mock("../../config/mysql");
jest.mock("../../utils/index");

describe("getUsers", () => {
	let findAllMock;
	let userTypeMock;

	beforeEach(() => {
		findAllMock = jest.fn();
		db.user.findAll = findAllMock;

		userTypeMock = jest.fn();
		utils.userType = userTypeMock;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return a list of users for an admin", async () => {
		const users = [
			{
				uid: 1,
				user_email: "admin@example.com",
				user_name: "Admin",
				user_statusus_id: 1,
				user_typeutid: 1,
			},
			{
				uid: 2,
				user_email: "user@example.com",
				user_name: "User",
				user_statusus_id: 2,
				user_typeutid: 3,
			},
		];
		userTypeMock.mockResolvedValue(1);
		findAllMock.mockResolvedValue(users);

		const result = await services.getUsers("admin-token");

		expect(result).toEqual({
			success: 1,
			length: users.length,
			results: users.map((user) => ({
				id: user.uid,
				email: user.user_email,
				name: user.user_name,
				status: user.user_statusus_id,
				type: user.user_typeutid,
			})),
		});
	});

	test("should throw an error for a manager user", async () => {
		userTypeMock.mockResolvedValue(2);

		await expect(services.getUsers("manager-token")).rejects.toThrow("Sem permissao!");
	});

	test("should throw an error for a regular user", async () => {
		userTypeMock.mockResolvedValue(3);

		await expect(services.getUsers("user-token")).rejects.toThrow("Sem permissao!");
	});

	test("should throw an error if user type is not recognized", async () => {
		userTypeMock.mockResolvedValue(99);

		await expect(services.getUsers("unknown-token")).rejects.toThrow("Utilizador nao reconhecido!");
	});

	test("should handle errors from the database", async () => {
		userTypeMock.mockResolvedValue(1);
		findAllMock.mockRejectedValue(new Error("Database error"));

		await expect(services.getUsers("admin-token")).rejects.toThrow("Database error");
	});
});
