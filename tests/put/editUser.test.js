const { editUser } = require('../../controllers/users');
const db = require('../../config/mysql');
const utils = require('../../utils/index');

jest.mock('../../config/mysql');
jest.mock('../../utils/index');

describe('Edit User Function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 2 },
            params: { id: 1 },
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 403 if user is not an admin and is not editing their own profile', async () => {
        utils.isAdmin.mockResolvedValue(false);

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'Sem permissão' });
    });

    it('should update user information if user is an admin', async () => {
        utils.isAdmin.mockResolvedValue(true);
        db.user.findByPk.mockResolvedValue({
            uid: 2,
            user_email: 'admin',
            user_name: 'example',
        });
        req.body.email = 'newemail@example.com';

        await editUser(req, res);

        expect(db.user.findByPk).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ success: 1, message: 'Utilizador editado com sucesso' });
    });

    it('should update user information if user is editing their own profile', async () => {
        utils.isAdmin.mockResolvedValue(false);
        db.user.findByPk.mockResolvedValue({
            uid: 1,
            user_email: 'user1@example.com',
            user_name: 'User 1',
        });
        req.body.email = 'newemail@example.com';

        await editUser(req, res);

        expect(db.user.findByPk).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ success: 1, message: 'Utilizador editado com sucesso' });
    });

    it('should return 404 if user does not exist', async () => {
        utils.isAdmin.mockResolvedValue(true);
        db.user.findByPk.mockResolvedValue(null);

        await editUser(req, res);

        expect(db.user.findByPk).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ success: 0, message: 'Utilizador inexistente' });
    });

    it('should return 500 if an error occurs', async () => {
        utils.isAdmin.mockRejectedValue(new Error('Database error'));

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: expect.any(Error), message: 'Database error' });
    });
});
