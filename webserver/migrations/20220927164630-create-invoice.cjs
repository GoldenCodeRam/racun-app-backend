'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Invoices', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            generation_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            period_start: {
                allowNull: false,
                type: Sequelize.DATE
            },
            period_end: {
                allowNull: false,
                type: Sequelize.DATE
            },
            payment_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            suspension_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            value: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            adjustment: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            status: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            contract_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "ClientContracts",
                    },
                    key: "id",
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Invoices');
    }
};
