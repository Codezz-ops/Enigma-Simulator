const readline = require('readline');

class Rotor {
  constructor(wiring, notchPosition) {
    this.wiring = wiring;
    this.notchPosition = notchPosition;
    this.position = 0;
  }

  encrypt(character) {
    const charCode = character.charCodeAt(0) - 65; // Convert character to numeric value (assuming uppercase letters only)

    // Apply the rotor's wiring configuration
    const encryptedCharCode = (charCode + this.position) % 26;
    const encryptedCharacter = String.fromCharCode(encryptedCharCode + 65); // Convert back to character representation

    return encryptedCharacter;
  }

  step() {
    this.position = (this.position + 1) % 26; // Rotate the rotor by one position

    // Check if the rotor reached its notch position
    if (this.position === this.notchPosition) {
      // Trigger rotation of the adjacent rotor(s)
      if (this.nextRotor) {
        this.nextRotor.step(); // Call the step() method of the next rotor
      }
    }
  }
}

class Reflector {
  constructor(wiring) {
    this.wiring = wiring;
  }

  reflect(character) {
    const charCode = character.charCodeAt(0) - 65; // Convert character to numeric value (assuming uppercase letters only)
    const reflectedCharCode = this.wiring[charCode]; // Get the reflected character code from the wiring configuration
    const reflectedCharacter = String.fromCharCode(reflectedCharCode + 65); // Convert back to character representation
    return reflectedCharacter;
  }
}

class Plugboard {
  constructor(mapping) {
    this.mapping = mapping;
  }

  swap(character) {
    const swappedCharacter = this.mapping[character] || character; // Swap the character based on the plugboard's mapping, if available
    return swappedCharacter;
  }
}

class Keyboard {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async getInput() {
    return new Promise((resolve) => {
      this.rl.question('Enter a character: ', (answer) => {
        resolve(answer.trim().charAt(0));
      });
    });
  }

  close() {
    this.rl.close();
  }
}

class Lampboard {
  constructor() {
    // No initialization required for console-based output
  }

  display(character) {
    // Display the encrypted/decrypted character on the lampboard using console.log
    console.log('Output:', character);
  }
}

class EnigmaMachine {
  constructor(rotors, reflector, plugboard, lampboard) {
    this.rotors = rotors;
    this.reflector = reflector;
    this.plugboard = plugboard;
    this.lampboard = lampboard;
  }

  encrypt(character) {
    let encryptedCharacter = this.plugboard.swap(character);

    for (let rotor of this.rotors) {
      encryptedCharacter = rotor.encrypt(encryptedCharacter);
    }

    encryptedCharacter = this.reflector.reflect(encryptedCharacter);

    for (let i = this.rotors.length - 1; i >= 0; i--) {
      encryptedCharacter = this.rotors[i].encrypt(encryptedCharacter);
    }

    encryptedCharacter = this.plugboard.swap(encryptedCharacter);

    return encryptedCharacter;
  }
}

module.exports = {
  Rotor,
  Reflector,
  Plugboard,
  Keyboard,
  Lampboard,
  EnigmaMachine,
};