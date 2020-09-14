const fs = require('fs'),
  mongoose = require('mongoose'),
  colors = require('colors'),
  dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

//load models
const btcModel = require('./models/btcModel'),
  crsModel = require('./models/crsModel');

//connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/btcList.json`, 'utf-8')
);

//read JSON files
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

//Import into DB
const importData = async () => {
  try {
    await btcModel.create(bootcamps);
    await crsModel.create(courses);
    await console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await btcModel.deleteMany();
    await crsModel.deteleMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
