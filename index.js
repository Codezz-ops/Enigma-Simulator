const { Rotor, Reflector, Plugboard, Keyboard, Lampboard, EnigmaMachine } = require('./components');

function randomizeString(string) {
    const array = string.split('');
    const length = array.length;

    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array.join('');
}

const string1 = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
const string2 = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
const string3 = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';

// Set up initial rotor positions
const rotor1Wiring = randomizeString(string1);
// Debugging
// console.log(rotor1Wiring);
const rotor1NotchPosition = Math.floor(Math.random() * 16); // Random number 0 - 16

const rotor2Wiring = randomizeString(string2);
const rotor2NotchPosition = Math.floor(Math.random() * 4); // Random number 0 - 4

const rotor3Wiring = randomizeString(string3);
const rotor3NotchPosition =  Math.floor(Math.random() * 21); // Random number 0 - 21

const reflectorWiring = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

const rotor1 = new Rotor(rotor1Wiring, rotor1NotchPosition);
const rotor2 = new Rotor(rotor2Wiring, rotor2NotchPosition);
const rotor3 = new Rotor(rotor3Wiring, rotor3NotchPosition);

// Set initial positions of the rotors
rotor1.position = Math.floor(Math.random() * rotor1NotchPosition);
rotor2.position = Math.floor(Math.random() * rotor2NotchPosition);
rotor3.position = Math.floor(Math.random() * rotor3NotchPosition);

// Configure the plugboard
const plugboardMapping = {};
const plugboard = new Plugboard(plugboardMapping);

// Configure the lampboard
const lampboard = new Lampboard();

// Create the Enigma machine instance
const enigmaMachine = new EnigmaMachine(
  [rotor1, rotor2, rotor3],
  new Reflector(reflectorWiring),
  plugboard,
  lampboard
);

class MyKeyboard extends Keyboard {
  constructor() {
    super();
  }

  async getInput() {
    return new Promise((resolve) => {
      this.rl.question('Enter a character: ', (answer) => {
        resolve(answer.trim().charAt(0));
      });
    });
  }
}

(async () => {
  const keyboard = new MyKeyboard();

  while (true) {
    const character = await keyboard.getInput();
    if (character === 'q') break; // Exit loop if 'q' is entered

    const encryptedCharacter = enigmaMachine.encrypt(character);
    console.log('Output:', encryptedCharacter);

    // Step the rotors after encrypting a character
    rotor1.step();
    if (rotor1.position === rotor1NotchPosition) {
      rotor2.step();
      if (rotor2.position === rotor2NotchPosition) {
        rotor3.step();
      }
    }
  }

  keyboard.close();
})();
