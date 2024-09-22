const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()
const db_url = process.env.POSTGRES_URL
const sequelize = new Sequelize(db_url);

async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully. ' + db_url);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit process with failure code
    }
}

checkConnection();

// Define the InstagramProfile model
const InstagramProfile = sequelize.define('InstagramProfile', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    post_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'instagram_instagramprofile'
});

// Define the InstagramPost model
const InstagramPost = sequelize.define('InstagramPost', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    media_type: {
        type: DataTypes.ENUM('image', 'video', 'carousel'),
        defaultValue: 'image',
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profile_id: {
        type: DataTypes.STRING,
        references: {
            model: 'instagram_instagramprofile',
            key: 'username'
        }
    }
}, {
    timestamps: false,
    tableName: 'instagram_instagrampost'
});

// Establish the relationship
InstagramProfile.hasMany(InstagramPost, { foreignKey: 'profile_id', as: 'posts' });
InstagramPost.belongsTo(InstagramProfile, { foreignKey: 'profile_id', targetKey: 'username', as: 'profile' });

module.exports = { InstagramProfile, InstagramPost, sequelize, Sequelize };
