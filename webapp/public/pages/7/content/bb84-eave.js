
// Alice Input Fields
const attackActiveInputAliceBits = document.getElementById("attack-alice-bits");
const attackActiveInputAliceBitsError = document.getElementById("attack-alice-bits-error");
const attackActiveInputAliceBases = document.getElementById("attack-alice-bases");
const attackActiveInputAliceBasesError = document.getElementById("attack-alice-bases-error");
const attackInputAliceBasesShared = document.getElementById("attack-alice-bases-shared");
const attackInputAliceQubits = document.getElementById("attack-alice-qubits");
const attackInputSharedQubits = document.getElementById("attack-shared-qubits");
// Bob Input Fields
const attackActiveInputBobBases = document.getElementById("attack-bob-bases");
const attackActiveInputBobBasesError = document.getElementById("attack-bob-bases-error");
const attackInputBobBasesShared = document.getElementById("attack-bob-bases-shared");
const attackInputBobResult = document.getElementById("attack-bob-result");

// Eve Input Fields
const attackActiveInputEveBases = document.getElementById("attack-eve-bases");
const attackActiveInputEveBasesError = document.getElementById("attack-eve-bases-error");

//
// Global Variables & Functions
//

const attackMaxLength = 16;
let attackAliceBitError = false;
let attackAliceBaseError = false;
let attackEveBaseError = false;
let attackBobBaseError = false;

function attackVerifyInput(target, regex) {
  if (!target.value.match(regex)) {
    // remove latest character if not matching regex
    target.value = target.value.split("").splice(0, target.value.length - 1).join("");
  } 
}

// startup methods
attackUpdateAliceBases();
attackUpdateEveBases();
attackUpdateBobBases();


//
// Event Listeners for Active Input Fields
//

// ALICE INPUT BITS
attackActiveInputAliceBits.addEventListener("input", (event) => {
  const target = event.target;
  attackVerifyInput(event.target, /^[0-1]*$/);
  if (target.value.length > attackMaxLength) {
    target.setAttribute("class", "form-control border border-danger");
    attackActiveInputAliceBitsError.setAttribute("class", "text-danger");
    attackAliceBitError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    attackActiveInputAliceBitsError.setAttribute("class", "text-danger d-none");
    attackAliceBitError = false;
  }
  attackUpdateAliceBases();
  attackUpdateBobBases();
  attackUpdateEveBases();
});

// ALICE INPUT BASES
attackActiveInputAliceBases.addEventListener("input", attackUpdateAliceBases);
function attackUpdateAliceBases() {
  const target = attackActiveInputAliceBases;
  target.value = target.value.toUpperCase();
  attackVerifyInput(target, /^[XZ]*$/);
  if (target.value.length !== attackActiveInputAliceBits.value.length) {
    target.setAttribute("class", "form-control border border-danger");
    attackActiveInputAliceBasesError.setAttribute("class", "text-danger");
    attackAliceBaseError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    attackActiveInputAliceBasesError.setAttribute("class", "text-danger d-none");
    attackAliceBaseError = false;
  }
  const aliceQubits = attackGetQubitStateFromBit(attackActiveInputAliceBits.value.split(""), attackActiveInputAliceBases.value.split(""));
  attackInputAliceQubits.value = aliceQubits; 
  attackInputSharedQubits.value = aliceQubits;
  attackInputAliceBasesShared.value = target.value;
  document.getElementById("attack-alice-eve-qubits").value = aliceQubits;
  attackUpdateTables();
}

// EVE INPUT BASES
attackActiveInputEveBases.addEventListener("input", attackUpdateEveBases);
function attackUpdateEveBases() {
  const target = attackActiveInputEveBases;
  target.value = target.value.toUpperCase();
  attackVerifyInput(target, /^[XZ]*$/);
  if (target.value.length !== attackActiveInputAliceBits.value.length) {
    target.setAttribute("class", "form-control border border-danger");
    attackActiveInputEveBasesError.setAttribute("class", "text-danger");
    attackBobBaseError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    attackActiveInputEveBasesError.setAttribute("class", "text-danger d-none");
    attackBobBaseError = false;
  }
  // measure eve
  const aliceQubits = document.getElementById("attack-alice-qubits").value.split("");
  const eveBase = document.getElementById("attack-eve-bases").value.split("");
  const eveMeasurements = attackMeasureQubitsWithBaset(aliceQubits, eveBase);
  document.getElementById("attack-eve-result").value = eveMeasurements.join("");
  document.getElementById("attack-eve-shared-qubits").value = eveMeasurements.join("");
  document.getElementById("attack-bob-eve-shared-qubits").value = eveMeasurements.join("");
  attackUpdateTables();
}

// BOB INPUT BASES
attackActiveInputBobBases.addEventListener("input", attackUpdateBobBases);
function attackUpdateBobBases() {
  const target = attackActiveInputBobBases;
  target.value = target.value.toUpperCase();
  attackVerifyInput(target, /^[XZ]*$/);
  attackInputBobBasesShared.value = target.value;
  if (target.value.length !== attackActiveInputAliceBits.value.length) {
    target.setAttribute("class", "form-control border border-danger");
    attackActiveInputBobBasesError.setAttribute("class", "text-danger");
    attackBobBaseError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    attackActiveInputBobBasesError.setAttribute("class", "text-danger d-none");
    attackBobBaseError = false;
  }
  attackUpdateTables();
}

function attackUpdateTables() {
  if(attackAliceBitError || attackAliceBaseError || attackEveBaseError || attackBobBaseError) {
    return;
  }
  attackUpdateBaseTables();
}

function attackUpdateBaseTables() {
  const aliceInput = document.getElementById("attack-alice-bits").value.split("");
  const aliceBase = document.getElementById("attack-alice-bases").value.split("");
  const eveQubits = document.getElementById("attack-eve-shared-qubits").value.split("");
  const bobBase = document.getElementById("attack-bob-bases").value.split("");
  const same = [];
  aliceBase.forEach((base, index) => {
    if (base === bobBase[index]) {
      same.push(index);
    }
  });
  const bobMeasurements = attackMeasureQubitsWithBaset(eveQubits, bobBase);
  attackInputBobResult.value = bobMeasurements.join("");
  const notSame = [];
  aliceInput.forEach((bit, index) => {
    if (same.includes(index)) {
      if (bit !== bobMeasurements[index]) {
        notSame.push(index);
      }
    }
  });

  const baseTBody = attackGetBaseTBody(aliceBase, bobBase, same);

  const aliceBaseTable = document.getElementById("attack-alice-base-table");
  aliceBaseTable.appendChild(baseTBody.cloneNode(true));
  aliceBaseTable.removeChild(aliceBaseTable.getElementsByTagName("tbody")[0]);

  const bobBaseTable = document.getElementById("attack-bob-base-table");
  bobBaseTable.appendChild(baseTBody);
  bobBaseTable.removeChild(bobBaseTable.getElementsByTagName("tbody")[0]);

  const aliceResultTable = document.getElementById("attack-alice-result-table");
  aliceResultTable.appendChild(attackGetResultTBody("Alice's Input", aliceInput, same, notSame));
  aliceResultTable.removeChild(aliceResultTable.getElementsByTagName("tbody")[0]);

  const bobResultTable = document.getElementById("attack-bob-result-table");
  bobResultTable.appendChild(attackGetResultTBody("Bob's Messung", bobMeasurements, same, notSame));
  bobResultTable.removeChild(bobResultTable.getElementsByTagName("tbody")[0]);
}


//
// Generate tables
//

function attackGetBaseTBody(aliceBase, bobBase, same) {
  const tbody = document.createElement("tbody");

  // alice bases
  const trowAlice = document.createElement("tr");
  const thAlice = document.createElement("th");
  thAlice.setAttribute("class", "text-black text-start");
  thAlice.innerHTML = "Alice's Basen";
  trowAlice.append(thAlice);
  aliceBase.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
    } 
    td.innerHTML = base;
    trowAlice.append(td);
  });
  tbody.append(trowAlice);

  // bob bases
  const trowBob = document.createElement("tr");
  const thBob = document.createElement("th");
  thBob.setAttribute("class", "text-black text-start");
  thBob.innerHTML = "Bob's Basen";
  trowBob.append(thBob);
  bobBase.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
    } 
    td.innerHTML = base;
    trowBob.append(td);
  });
  tbody.append(trowBob);

  // index
  const trowIndex = document.createElement("tr");
  const thIndex = document.createElement("th");
  thIndex.setAttribute("class", "text-black text-start");
  thIndex.innerHTML = "Index";
  trowIndex.append(thIndex);
  aliceBase.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
    } 
    td.innerHTML = index+1;
    trowIndex.append(td);
  });
  tbody.append(trowIndex);
  return tbody;
}

function attackGetResultTBody(title, input, same, notSame) {
  
  const tbody = document.createElement("tbody");

  // index
  const trowIndex = document.createElement("tr");
  const thIndex = document.createElement("th");
  thIndex.setAttribute("class", "text-black text-start");
  thIndex.innerHTML = "Index";
  trowIndex.append(thIndex);
  input.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "fw-bold");
      td.innerHTML = index+1;
    } 
    trowIndex.append(td);
  });
  tbody.append(trowIndex);

  // alice input / bobs measurement
  const trowInput = document.createElement("tr");
  const thInput = document.createElement("th");
  thInput.setAttribute("class", "text-black text-start");
  thInput.innerHTML = title;
  trowInput.append(thInput);
  input.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "fw-bold");
    } 
    td.innerHTML = base;
    trowInput.append(td);
  });
  tbody.append(trowInput);

  // result
  const trowRes = document.createElement("tr");
  const thRes = document.createElement("th");
  thRes.setAttribute("class", "text-black text-start");
  thRes.innerHTML = "Schlüssel";
  trowRes.append(thRes);
  input.forEach((input, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      if (notSame.includes(index)) {
        td.setAttribute("class", "text-danger fw-bold");
      } else {
        td.setAttribute("class", "text-success fw-bold");
      }
      td.innerHTML = input;
    } 
    trowRes.append(td);
  });
  tbody.append(trowRes);

  return tbody;
}


//
// Calc Qubits
//

function attackGetQubitStateFromBit(input, base) {
  const res = [];
  input.forEach((bit, index) => {
    if (bit === "0") {
      if (base[index] === "X") {
        res.push("+");
      } else {
        res.push("0");
      }
    } else { // bit = 1
      if (base[index] === "X") {
        res.push("-");
      } else {
        res.push("1");
      }
    }
  });
  return res.join("");
}

function attackMeasureQubitsWithBaset(input, base) {
  const res = [];
  input.forEach((qubit, index) => {
    if (base[index] === "X") {
      switch(qubit) {
        case "+":
          res.push("0");
          break;
        case "-":
          res.push("1");
          break;
        case "0":
          res.push("1");
          break;
        case "1":
          res.push("0");
          break;
        default:
          res.push("?");
      }
    } else { // Z
      switch(qubit) {
        case "+":
          res.push("1");
          break;
        case "-":
          res.push("0");
          break;
        case "0":
          res.push("0");
          break;
        case "1":
          res.push("1");
          break;
        default:
          res.push("?");
      }
    }
  });
  return res;
}