import { config } from 'dotenv';
import { connectDB } from '../lib/db.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

config();

const seedUsers = [
  // Female Users
  {
    email: 'alem.tadesse@example.com',
    fullName: 'Alem Tadesse',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    phoneNumber: '+251911223344',
  },
  {
    email: 'selam.awol@example.com',
    fullName: 'Selam Awol',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    phoneNumber: '+251922334455',
  },
  {
    email: 'mekdes.berhanu@example.com',
    fullName: 'Mekdes Berhanu',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
    phoneNumber: '+251933445566',
  },
  {
    email: 'helen.kebede@example.com',
    fullName: 'Helen Kebede',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
    phoneNumber: '+251944556677',
  },
  {
    email: 'tsion.tesfaye@example.com',
    fullName: 'Tsion Tesfaye',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
    phoneNumber: '+251955667788',
  },
  {
    email: 'hana.lemma@example.com',
    fullName: 'Hana Lemma',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/6.jpg',
    phoneNumber: '+251966778899',
  },
  {
    email: 'beti.mulugeta@example.com',
    fullName: 'Beti Mulugeta',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/7.jpg',
    phoneNumber: '+251977889900',
  },
  {
    email: 'aynet.abebe@example.com',
    fullName: 'Aynet Abebe',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/8.jpg',
    phoneNumber: '+251988990011',
  },

  // Male Users
  {
    email: 'yohannes.teshome@example.com',
    fullName: 'Yohannes Teshome',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    phoneNumber: '+251911223355',
  },
  {
    email: 'dawit.mekonnen@example.com',
    fullName: 'Dawit Mekonnen',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    phoneNumber: '+251922334466',
  },
  {
    email: 'abebe.kebede@example.com',
    fullName: 'Abebe Kebede',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    phoneNumber: '+251933445577',
  },
  {
    email: 'tadesse.lemma@example.com',
    fullName: 'Tadesse Lemma',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    phoneNumber: '+251944556688',
  },
  {
    email: 'mulugeta.tesfaye@example.com',
    fullName: 'Mulugeta Tesfaye',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    phoneNumber: '+251955667799',
  },
  {
    email: 'getachew.abebe@example.com',
    fullName: 'Getachew Abebe',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/6.jpg',
    phoneNumber: '+251966778811',
  },
  {
    email: 'ashenafi.molla@example.com',
    fullName: 'Ashenafi Molla',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/7.jpg',
    phoneNumber: '+251977889922',
  },
  {
    email: 'teshome.berhanu@example.com',
    fullName: 'Teshome Berhanu',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/8.jpg',
    phoneNumber: '+251988990033',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Hash passwords before inserting users
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10); // Hash password with salt round 10
        return {
          ...user,
          password: hashedPassword, // Replace plain password with hashed password
        };
      })
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log('Database seeded successfully');
    process.exit(0); // Exit the script after seeding
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with an error code
  }
};

// Call the function
seedDatabase();
