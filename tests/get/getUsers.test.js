const { getUsers } = require("../../controllers/users");
const db = require("../../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utils = require("../../utils/index");

jest.mock("../../config/mysql");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../utils/index");

describe("Get Users Function", () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 1 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 403 if user is not an admin", async () => {
        utils.isAdmin.mockResolvedValue(false);

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            success: 0,
            message: "Sem permissão",
        });
    });

    it("should return users if user is an admin", async () => {
        utils.isAdmin.mockResolvedValue(true);
        db.user.findAll.mockResolvedValue([
            { uid: 1, user_email: "user1@example.com", user_name: "User 1" },
        ]);

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            success: 1,
            length: 1,
            results: [
                {
                    id: 1,
                    email: "user1@example.com",
                    name: "User 1",
                    status: undefined,
                    type: undefined,
                },
            ],
        });
    });

    it("should return 404 if no users found", async () => {
        utils.isAdmin.mockResolvedValue(true);
        db.user.findAll.mockResolvedValue([]);

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
            success: 0,
            message: "Não existem utilizadores",
        });
    });

    it("should return 500 if an error occurs", async () => {
        utils.isAdmin.mockRejectedValue(new Error("Database error"));

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: expect.any(Error),
            message: "Database error",
        });
    });
});
