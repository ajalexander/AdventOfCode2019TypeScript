import { PasswordFinder } from './PasswordFinder';

const lower = 146810;
const upper = 612564;

const finder = new PasswordFinder();

let possiblePasswords = finder.findPasswords(lower, upper, false);
console.log(`${possiblePasswords.length} possible passwords found`);

possiblePasswords = finder.findPasswords(lower, upper);
console.log(`${possiblePasswords.length} possible passwords found with added requirement`);
