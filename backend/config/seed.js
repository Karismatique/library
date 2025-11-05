// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Author = require('../models/author.model');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// --- DONNÉES ---
const authorsData = [
  { name: "Victor Hugo", birthYear: 1802 },
  { name: "George Orwell", birthYear: 1903 },
  { name: "J.K. Rowling", birthYear: 1965 },
  { name: "Agatha Christie", birthYear: 1890 },
  { name: "Stephen King", birthYear: 1947 },
  { name: "Haruki Murakami", birthYear: 1949 },
  { name: "Jane Austen", birthYear: 1775 },
  { name: "Albert Camus", birthYear: 1913 },
  { name: "Gabriel García Márquez", birthYear: 1927 },
  { name: "Tolkien", birthYear: 1892 },
  { name: "Virginia Woolf", birthYear: 1882 },
  { name: "Franz Kafka", birthYear: 1883 },
  { name: "Marcel Proust", birthYear: 1871 },
  { name: "Simone de Beauvoir", birthYear: 1908 },
  { name: "Ray Bradbury", birthYear: 1920 },
  { name: "Neil Gaiman", birthYear: 1960 },
  { name: "Chinua Achebe", birthYear: 1930 },
  { name: "Toni Morrison", birthYear: 1931 },
  { name: "Dostoïevski", birthYear: 1821 },
  { name: "Émile Zola", birthYear: 1840 }
];

const booksData = [
  { title: "Les Misérables", year: 1862 },
  { title: "1984", year: 1949 },
  { title: "Harry Potter à l'école des sorciers", year: 1997 },
  { title: "Le Crime de l'Orient Express", year: 1934 },
  { title: "Ça", year: 1986 },
  { title: "Kafka sur le rivage", year: 2002 },
  { title: "Orgueil et Préjugés", year: 1813 },
  { title: "L'Étranger", year: 1942 },
  { title: "Cent ans de solitude", year: 1967 },
  { title: "Le Seigneur des Anneaux", year: 1954 },
  { title: "Mrs Dalloway", year: 1925 },
  { title: "La Métamorphose", year: 1915 },
  { title: "À la recherche du temps perdu", year: 1913 },
  { title: "Le Deuxième Sexe", year: 1949 },
  { title: "Fahrenheit 451", year: 1953 },
  { title: "American Gods", year: 2001 },
  { title: "Le Monde s'effondre", year: 1958 },
  { title: "Beloved", year: 1987 },
  { title: "Crime et Châtiment", year: 1866 },
  { title: "Germinal", year: 1885 },
  { title: "Le Petit Prince", year: 1943 },
  { title: "Le Nom de la rose", year: 1980 },
  { title: "Dune", year: 1965 },
  { title: "Fondation", year: 1951 },
  { title: "Neuromancien", year: 1984 },
  { title: "Le Parfum", year: 1985 },
  { title: "L'Alchimiste", year: 1988 },
  { title: "Sapiens", year: 2011 },
  { title: "Le Prophète", year: 1923 },
  { title: "Le Hobbit", year: 1937 },
  { title: "Le Comte de Monte-Cristo", year: 1844 },
  { title: "Madame Bovary", year: 1857 },
  { title: "Anna Karénine", year: 1877 },
  { title: "Guerre et Paix", year: 1869 },
  { title: "L'Odyssée", year: -800 },
  { title: "L'Iliade", year: -800 },
  { title: "Le Portrait de Dorian Gray", year: 1890 },
  { title: "Dracula", year: 1897 },
  { title: "Frankenstein", year: 1818 },
  { title: "1984 (édition collector)", year: 2020 },
  { title: "Harry Potter et la Chambre des Secrets", year: 1998 },
  { title: "Shining", year: 1977 },
  { title: "Le Silmarillion", year: 1977 },
  { title: "Neverwhere", year: 1996 },
  { title: "Chroniques martiennes", year: 1950 },
  { title: "Le Cycle de Fondation", year: 1951 },
  { title: "L'Écume des jours", year: 1947 },
  { title: "Voyage au bout de la nuit", year: 1932 }
];

// --- FONCTION ---
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB');

    // Nettoyer
    await Author.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('Bases nettoyées');

    // Créer admin
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ email: 'admin@ynov.com', password: hashed, role: 'admin' });
    console.log('Admin créé : admin@ynov.com / admin123');

    // Créer auteurs
    const authors = await Author.insertMany(authorsData);
    console.log(`${authors.length} auteurs ajoutés`);

    // Créer livres
    const books = booksData.map((book, i) => ({
      ...book,
      authorId: authors[i % authors.length]._id
    }));
    await Book.insertMany(books);
    console.log(`${books.length} livres ajoutés`);

    console.log('Seeding terminé !');
    process.exit(0);
  } catch (err) {
    console.error('Erreur seeding:', err);
    process.exit(1);
  }
}

seed();