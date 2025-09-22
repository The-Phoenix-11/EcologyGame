import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';

let sequelize: Sequelize;

// Check if a DATABASE_URL is provided (for Render/PostgreSQL)
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Necessary for Render's free tier PostgreSQL
            }
        }
    });
} else {
    // Fallback to SQLite for local development
    const name = "ecodnp";
    const getStoragePath = () => {
        let storagePath = `${process.env.SQLITE_DBS_LOCATION || './'}/${name}`; // Default to local dir if not set
        console.log(`STORAGE PATH: ${storagePath}`);
        return storagePath;
    };

    sequelize = new Sequelize({
        dialect: "sqlite",
        dialectModule: sqlite3,
        storage: getStoragePath()
    });
}

const Person = sequelize.define('Person', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
		unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
		unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    is_forum_contributor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

const LoginInstance = sequelize.define("LoginInstance", {
	login_id: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
    user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Person,
            key: "user_id"
		},
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	}
})

const Relationship = sequelize.define("Relationship", {
    relationship_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
		unique: true,
        primaryKey: false,
        autoIncrement: true
    },
    first_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    second_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    indexes: [
      {
        unique: true,
        fields: ['first_user_id', 'second_user_id']
      }
    ]
})

const ForumPost = sequelize.define("ForumPost", {
	post_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
		primaryKey: true,
        autoIncrement: true
	},
	creator_id: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: Person,
			key: "user_id",
		}
	},
	content: {
		type: DataTypes.STRING,
		allowNull: false
	},
	title: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

export default {
    sequelize: sequelize,
    Person: Person,
    LoginInstance: LoginInstance,
    Relationship: Relationship,
    ForumPost: ForumPost,
};
