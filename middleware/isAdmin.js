const database = require("../services/database");

exports.isAdmin = (roles = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(400).json({ message: 'User not authenticated' });
            }

            const result = await database.pool.query({
                text: 'SELECT * FROM users WHERE id = $1',
                values: [req.user.id]
            });

            if (result.rows.length === 0 || !roles.includes(result.rows[0].role)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };
};
